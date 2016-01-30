var Gameplay = function() {};
Gameplay.prototype.init = function(playerInputData)
{
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

  this.players = this.game.add.group();
  this.kamis = this.game.add.group();

  for (var i = 0; i < this.playerInputData.length; i++) {
    var player1 = new Player(this.game, 512 + 16 + (i * 64), 512 + 48 - 64, this.playerInputData[i], i, undefined);
    this.players.addChild(player1);
    this.players.addToHash(player1);
    player1.tint = DEBUG_TINTS[i];

    var kami1 = new Kami(this.game, Math.random() * GAME_SCREEN_WIDTH * 0.5 + GAME_SCREEN_WIDTH * 0.25, Math.random() * GAME_SCREEN_HEIGHT * 0.5 + GAME_SCREEN_HEIGHT * 0.25, i);
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

  this.model = new GraphModel(this.game, this.map, this.wallTiles, this.players);
  this.model.refreshMaze();

  this.timer = new RoundTimer(this.game, function () { this.model.refreshMaze(); }, this);
  this.timer.resetTimer();

  this.scores = new GameScores(this.game, 1, function(index) { console.log('player ' + (index + 1) + ' wins!'); }, this);

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

  this.spawnFruit(17, 8);
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
};

// game logic helpers
Gameplay.prototype.spawnFruit = function(x, y) {
  var newFruit = this.fruits.getFirstDead();
  if (newFruit !== null) {
    newFruit.revive();
    newFruit.x = x * 32;
    newFruit.y = y * 32;
  }
};

// Collision detection callbacks
Gameplay.prototype.checkPickUpFruit = function(player)
{
  return player.holdingFruit === false;
};
Gameplay.prototype.pickUpFruit = function (player, fruit)
{
  fruit.kill();
  player.holdFruit();
};
Gameplay.prototype.playerCollidesKami = function(player, kami)
{
  if (player.index === kami.index) {
    if (player.holdingFruit === true) {
      player.holdingFruit = false;

      this.scores.playerEarnsScore(player.index);
    }
  } else {
    player.kill();
  }

  return false;
};