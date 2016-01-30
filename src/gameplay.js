var Gameplay = function() {};
Gameplay.prototype.init = function(playerInputData)
{
  this.states = ['PREGAME', 'ACTION', 'GAMEOVER'];
  this.currentState = this.states[2];

  this.players = null;
  this.kamis = null;
  this.fruits = null;

  this.map = null;
  this.wallTiles = null
  this.floorTiles = null;

  this.model = null;

  this.timer = null;
  this.scores = null;

  this.playerInputData = playerInputData;

  this.numberOfFruitToSpawn = (playerInputData.length > 2 ? 2 : 1);

  // UI-related stuff
  this.timeCountdown = null;
};
Gameplay.prototype.create = function()
{
  var fullScreenKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);
  fullScreenKey.onUp.add(function () {
    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
    }
    else
    {
        this.game.scale.startFullScreen(false);
    }
  }, this);

  this.currentState = this.states[0];

  this.players = this.game.add.group();
  this.kamis = this.game.add.group();

  for (var i = 0; i < this.playerInputData.length; i++) {
    var player1 = new Player(this.game, (i === 0 || i === 3) ? GAME_SCREEN_WIDTH - 128 : 128, (i === 0 || i === 2) ? 128 : GAME_SCREEN_HEIGHT - 128, this.playerInputData[i], i, undefined);
    this.players.addChild(player1);
    this.players.addToHash(player1);

    var kami1 = new Kami(this.game, (i === 0 || i === 3) ? GAME_SCREEN_WIDTH - 256 : 256, (i === 0 || i === 2) ? 192 : GAME_SCREEN_HEIGHT - 192, i);
    this.kamis.addChild(kami1);
    this.kamis.addToHash(kami1);
    kami1.tint = DEBUG_TINTS[i];
  }

  this.fruits = this.game.add.group();
  for (var i = 0; i < 5; i++) {
    var fruit1 = new Fruit(this.game, 512 + 32, 512 + 32);
    this.fruits.addChild(fruit1);
    this.fruits.addToHash(fruit1);
    fruit1.kill();
  }

  this.map = this.game.add.tilemap();
  this.map.addTilesetImage('tiles', undefined, TILE_SIZE, TILE_SIZE);

  this.floorTiles = this.map.create('floors', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE);
  this.map.fill(10, 0, 0, MAP_WIDTH, MAP_HEIGHT, this.floorTiles);

  this.wallTiles = this.map.create('walls', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE);
  this.wallTiles.resizeWorld();

  this.map.setCollisionBetween(0, 63);

  this.model = new GraphModel(this.game, this.map, this.wallTiles, this.players, this.fruits);
  this.model.refreshMaze();

  this.timer = new RoundTimer(this.game, function () { this.model.refreshMaze(); }, this);
  this.timer.resetTimer();
  this.timer.pauseTimer();

  this.scores = new GameScores(this.game, this.playerInputData.length, this.playerWins, this);

  // init UI
  this.timeCountdown = this.game.add.text(32, GAME_SCREEN_HEIGHT + 32, this.timer.timeLeft, {fill: 'white'});

  this.playerScoresUI = this.game.add.group();
  for (var i = 0; i < this.scores.playerCount; i++) {
    var text = this.game.add.text(256 + i * 172, GAME_SCREEN_HEIGHT + 32, 'P' + (i + 1) + ' SCORE', {fill: 'white'});
    this.playerScoresUI.addChild(text);
  }

  // Ordering hacks
  this.game.world.bringToTop(this.fruits);
  this.game.world.bringToTop(this.players);
  this.game.world.bringToTop(this.kamis);

  this.players.forEach(function (p) { p.lockMovement = true; }, this);
  var startText = this.game.add.text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2, 'READY?', {fill: 'white', font: '128px Arial'});
  startText.align = 'center';
  startText.anchor.x = 0.5;
  startText.cacheAsBitmap = true;
  var startGameEvent = this.game.time.events.add(1000, function () {
    this.players.forEach(function (p) { p.lockMovement = false; }, this);
    startText.text = 'GO!'
    this.timer.unpauseTimer();
    this.game.time.events.add(750, function () { startText.destroy(); } );
  }, this);
};
Gameplay.prototype.update = function()
{
  // update UI
  this.timeCountdown.text = this.timer.timeLeft;
  for (var i = 0; i < this.scores.playerCount; i++) {
    this.playerScoresUI.children[i].text = 'P' + (i + 1) + ':' + this.scores.playerScore(i);
  }

  // collision detection
  this.game.physics.arcade.collide(this.players, this.wallTiles);
  this.game.physics.arcade.overlap(this.players, this.fruits, this.pickUpFruit, this.checkPickUpFruit, this);
  this.game.physics.arcade.overlap(this.players, this.kamis, null, this.playerCollidesKami, this);

  if (this.fruits.countLiving() < this.numberOfFruitToSpawn) {
    this.spawnFruit();
  }

  // check if only one player is standing
  var playersLeftStanding = [];
  this.players.forEach(function (p) { if (p.defeated === false) { playersLeftStanding.push(p); } });
  if (playersLeftStanding.length == 1) {
    this.playerWins(playersLeftStanding[0].index);
  }
};

// game logic helpers
Gameplay.prototype.spawnFruit = function() {
  var randX = ~~(Math.random() * MAP_WIDTH * 0.8 + MAP_WIDTH * 0.1);
  var randY = ~~(Math.random() * MAP_HEIGHT * 0.8 + MAP_HEIGHT * 0.1);
  var randTile = this.map.getTile(randX, randY, this.wallTiles);
  while (randTile !== null) {
    randX = ~~(Math.random() * MAP_WIDTH * 0.8 + MAP_WIDTH * 0.1);
    randY = ~~(Math.random() * MAP_HEIGHT * 0.8 + MAP_HEIGHT * 0.1);
    randTile = this.map.getTile(randX, randY, this.wallTiles);
  }

  var newFruit = this.fruits.getFirstDead();
  if (newFruit !== null) {
    newFruit.revive();
    newFruit.x = randX * 32 + 16;
    newFruit.y = randY * 32 + 16;
  }
};
Gameplay.prototype.playerWins = function(index) {
  var startText = this.game.add.text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2, 'PLAYER ' + (index + 1) + ' WINS!', {fill: 'white', font: '110px Arial'});
  startText.align = 'center';
  startText.anchor.x = 0.5;

  this.timer.pauseTimer();
  this.kamis.forEach(function (k) { k.lockMovement = true; }, this);
  this.players.forEach(function (p) { p.lockMovement = true; }, this);
};

// Collision detection callbacks
Gameplay.prototype.checkPickUpFruit = function(player)
{
  return player.holdingFruit === false;
};
Gameplay.prototype.pickUpFruit = function (player, fruit)
{
  if (fruit.visible === false) { return; }
  fruit.visible = false;
  player.holding = fruit;
  player.holdFruit();
};
Gameplay.prototype.playerCollidesKami = function(player, kami)
{
  if (player.defeated === true) {
    return;
  }

  if (player.index === kami.index) {
    if (player.holdingFruit === true) {
      player.holdingFruit = false;

      player.holding.kill();
      player.holding = undefined;
      this.scores.playerEarnsScore(player.index);
    }
  } else {
    player.defeat();
  }

  return false;
};