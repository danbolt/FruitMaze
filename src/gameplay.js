var Gameplay = function() {};
Gameplay.prototype.init = function(playerInputData)
{
  this.states = ['PREGAME', 'ACTION', 'GAMEOVER'];
  this.currentState = this.states[2];

  this.players = null;
  this.kamis = null;
  this.fruits = null;
  this.flames = null;

  this.labrynthEmitter = null;
  this.gridCache = null;

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
  this.currentState = this.states[0];

  this.players = this.game.add.group();
  this.kamis = this.game.add.group();
  this.flames = this.game.add.group();

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

  this.flames = this.game.add.group();
  for (var i = 0; i < 5; i++) {
    var flame = new Flame(this.game, 512 + 32, 512 + 32);
    this.flames.addChild(flame);
    this.flames.addToHash(flame);
    flame.kill();
  }

  this.map = this.game.add.tilemap();
  this.map.addTilesetImage('tiles', undefined, TILE_SIZE, TILE_SIZE);

  this.floorTiles = this.map.create('floors', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE);
  this.map.fill(10, 0, 0, MAP_WIDTH, MAP_HEIGHT, this.floorTiles);

  this.wallTiles = this.map.create('walls', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE);
  this.wallTiles.resizeWorld();

  this.map.setCollisionBetween(0, 63);

  this.gridCache = [];
  for (var i = 0; i < MAP_WIDTH; i++) {
    var row = [];
    for (var j = 0; j < MAP_HEIGHT; j++) {
      row.push(false);
    }
    this.gridCache.push(row);
  }

  this.model = new GraphModel(this.game, this.map, this.wallTiles, this.players, this.fruits);
  this.model.refreshMaze();
  this.updateMapCache(false);

  this.timer = new RoundTimer(this.game, function () {
    this.model.refreshMaze();
    this.updateMapCache(true);

    //this.wallSoundEffects[~~(Math.random() * this.wallSoundEffects.length)].play();
    this.game.sound.play('wall' + ~~(Math.random() * 3), 1.2);
  }, this);
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

  this.labrynthEmitter = this.game.add.emitter(0, 0, 200);
  this.labrynthEmitter.makeParticles('particles', [0, 1]);
  this.labrynthEmitter.lifespan = 150;

  // Ordering hacks
  this.game.world.bringToTop(this.fruits);
  this.game.world.bringToTop(this.players);
  this.game.world.bringToTop(this.flames);
  this.game.world.bringToTop(this.kamis);

  this.game.time.events.loop(200, function () {
    this.players.forEach(function (p) {
      if (p.defeated === false && p.body.velocity.getMagnitude() > 0.001 && p.holding !== undefined)
      {
        var oldLifespan = this.labrynthEmitter.lifespan;
        this.labrynthEmitter.lifespan = 100;
        this.labrynthEmitter.setXSpeed(p.body.velocity.x * -0.75, p.body.velocity.x * -0.75);
        this.labrynthEmitter.setYSpeed(p.body.velocity.y * -0.75, p.body.velocity.y * -0.75);
        this.labrynthEmitter.emitParticle(p.x, p.y, 'particles', 3);
        this.labrynthEmitter.lifespan = oldLifespan;
      }
    }, this);
  }, this);

  this.players.forEach(function (p) { p.lockMovement = true; }, this);
  var startText = this.game.add.text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2, 'READY?', {fill: 'white', font: '128px Arial'});
  startText.align = 'center';
  startText.anchor.x = 0.5;
  startText.cacheAsBitmap = true;
  var startGameEvent = this.game.time.events.add(1000, function () {
    this.players.forEach(function (p) { p.lockMovement = false; }, this);
    startText.text = 'GO!'
    this.currentState = this.states[1];
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
  this.game.physics.arcade.collide(this.players, this.players, function (pA, pB) {
    
    if (pA.holdingFruit === true)
    {
      var fallFruit = pA.holding;
      fallFruit.visible = true;
      pA.holdingFruit = false;
      pA.holding = undefined;
      
      fallFruit.body.moves = false;
      fallFruit.x = pA.x;
      fallFruit.y = pA.y;
      var fruitMoveTween = this.game.add.tween(fallFruit);
      var target = {x: 2, y: 2};
      this.setCleanDestination(target);
      var tx = target.x;
      var ty = target.y;
      target.x = [(tx + fallFruit.x) / 2, tx];
      target.y = [Math.min(ty, fallFruit.y) - 200, ty];
      fruitMoveTween.to(target, 500);
      fruitMoveTween.interpolation(Phaser.Math.bezierInterpolation);
      fruitMoveTween.onComplete.add(function () {
        fallFruit.body.moves = true;
      }, this);
      fruitMoveTween.start();
    }
    else
    {
      pB.knockbackDirection = Phaser.Point.subtract(pB.position, pA.position);
    }
    if (pB.holdingFruit === true)
    {
      var fallFruit = pB.holding;
      fallFruit.visible = true;
      pB.holdingFruit = false;
      pB.holding = undefined;
      
      fallFruit.body.moves = false;
      fallFruit.x = pB.x;
      fallFruit.y = pB.y;
      var fruitMoveTween = this.game.add.tween(fallFruit);
      var target = {x: 2, y: 2};
      this.setCleanDestination(target);
      var tx = target.x;
      var ty = target.y;
      target.x = [(tx + fallFruit.x) / 2, tx];
      target.y = [Math.min(ty, fallFruit.y) - 200, ty];
      fruitMoveTween.to(target, 500);
      fruitMoveTween.interpolation(Phaser.Math.bezierInterpolation);
      fruitMoveTween.onComplete.add(function () {
        fallFruit.body.moves = true;
      }, this);
      fruitMoveTween.start();
    }
    else
    {
      pA.knockbackDirection = Phaser.Point.subtract(pA.position, pB.position);
    }
    this.game.time.events.add(200, function () { pA.knockbackDirection.set(0); pB.knockbackDirection.set(0); });
  }, function (pA, pB) { return !(pA.defeated) && !(pB.defeated) && (pA.knockbackDirection.getMagnitude() < 0.01) && (pB.knockbackDirection.getMagnitude() < 0.01); }, this);

  this.game.physics.arcade.collide(this.players, this.wallTiles);
  this.game.physics.arcade.overlap(this.players, this.flames, undefined, function (player, flame) { this.playerCollidesFlame(player, flame); return false; }, this);
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
Gameplay.prototype.setCleanDestination = function (target) {
  var randX = ~~(Math.random() * MAP_WIDTH * 0.8 + MAP_WIDTH * 0.1);
  var randY = ~~(Math.random() * MAP_HEIGHT * 0.8 + MAP_HEIGHT * 0.1);
  var randTile = this.map.getTile(randX, randY, this.wallTiles);
  while (randTile !== null) {
    randX = ~~(Math.random() * MAP_WIDTH * 0.8 + MAP_WIDTH * 0.1);
    randY = ~~(Math.random() * MAP_HEIGHT * 0.8 + MAP_HEIGHT * 0.1);
    randTile = this.map.getTile(randX, randY, this.wallTiles);
  }

  target.x = randX * 32 + 16;
  target.y = randY * 32 + 16;
};
Gameplay.prototype.playerWins = function(index) {
  if (this.currentState !== this.states[1]) {
    return;
  }

  this.currentState = this.states[2];

  this.game.time.events.add(3500, function () {
    var startText = this.game.add.text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2, 'PLAYER ' + (index + 1) + ' WINS!', {fill: 'white', font: '96px Arial'});
    startText.align = 'center';
    startText.anchor.x = 0.5;

    this.timer.pauseTimer();
    this.kamis.forEach(function (k) { k.lockMovement = true; }, this);
    this.players.forEach(function (p) { p.lockMovement = true; }, this);

    this.game.bgm.fadeTo(50, 0.1);
    this.game.sound.play('victory');

    this.game.time.events.add(5000, function () { this.game.state.start('TitleScreen'); }, this);
  }, this);
};

// particle effects for map changes
Gameplay.prototype.updateMapCache = function(spitParticles) {
  for (var i = 0; i < MAP_WIDTH; i++)
  {
    for (var j = 0; j < MAP_HEIGHT; j++)
    {
      var t = this.map.getTile(i, j, this.wallTiles);
      if (t !== null && this.gridCache[i][j] === false && spitParticles) {
        this.labrynthEmitter.setXSpeed(300, 300);
        this.labrynthEmitter.setYSpeed(300, 300);
        this.labrynthEmitter.emitParticle(i * 32 + 16, j * 32 + 16, 'particles', 0);
        this.labrynthEmitter.setXSpeed(-300, -300);
        this.labrynthEmitter.setYSpeed(300, 300);
        this.labrynthEmitter.emitParticle(i * 32 + 16, j * 32 + 16, 'particles', 0);
        this.labrynthEmitter.setXSpeed(300, 300);
        this.labrynthEmitter.setYSpeed(-300, -300);
        this.labrynthEmitter.emitParticle(i * 32 + 16, j * 32 + 16, 'particles', 0);
        this.labrynthEmitter.setXSpeed(-300, -300);
        this.labrynthEmitter.setYSpeed(-300, -300);
        this.labrynthEmitter.emitParticle(i * 32 + 16, j * 32 + 16, 'particles', 0);
      }

      this.gridCache[i][j] = (t !== null);
    }
  }
};

// Collision detection callbacks
Gameplay.prototype.checkPickUpFruit = function(player, fruit)
{
  return (player.holdingFruit === false && fruit.body.moves === true);
};
Gameplay.prototype.pickUpFruit = function (player, fruit)
{
  if (fruit.visible === false) { return; }
  fruit.visible = false;
  player.holding = fruit;
  player.holdFruit();
  this.game.sound.play('pick_fruit', 1.2);
};
Gameplay.prototype.playerCollidesFlame = function(player, flame) {
  if (player.defeated || this.currentState !== this.states[1]) {
    return;
  }

  player.defeat();
  this.game.sound.play('death');
}
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

      var oldLifespan = this.labrynthEmitter.lifespan;
      this.labrynthEmitter.lifespan = 555;
      for (var i = 0; i < 10; i++)
      {
        this.labrynthEmitter.setXSpeed(300 * Math.cos(i / 10 * Math.PI * 2), 300 * Math.cos(i / 10 * Math.PI * 2));
        this.labrynthEmitter.setYSpeed(300 * Math.sin(i / 10 * Math.PI * 2), 300 * Math.sin(i / 10 * Math.PI * 2));
        this.labrynthEmitter.emitParticle(player.x, player.y, 'particles', 2);
      }
      this.labrynthEmitter.lifespan = oldLifespan;

      this.game.sound.play('gift');
    }
  } else {
    player.defeat();
    this.game.sound.play('death');
  }

  return false;
};