var Preload = function() {};
Preload.prototype.preload = function()
{
  this.game.load.image('tiles', 'asset/img/tiles.png');

  this.game.load.spritesheet('tiles_s', 'asset/img/tiles.png', 32, 32);
};
Preload.prototype.create = function()
{
  this.game.stage.backgroundColor = '#222222';

  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.refresh();

  this.game.scale.pageAlignHorizontally = true;
  this.game.scale.pageAlignVertically = true;

  this.game.stage.smoothed = false;

  PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL

  this.game.input.gamepad.start();  

  this.game.state.start('Gameplay');
};

var Gameplay = function() {};
Gameplay.prototype.init = function()
{
  this.players = null;
  this.kamis = null;
  this.fruits = null;

  this.map = null;
  this.wallTiles = null
  this.floorTiles = null;

  this.model = null;

  this.timer = null;

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

  var player1 = new Player(this.game, 512 + 16, 512 + 48 - 64, this.game.input.gamepad.pad1, 0, undefined);
  //var player1 = new Player(this.game, 128 + 16, 128 + 48, undefined, 0, this.game.input.keyboard);
  this.players.addChild(player1);
  this.players.addToHash(player1);

  this.kamis = this.game.add.group();

  var kami1 = new Kami(this.game, 256, 256, 0);
  this.kamis.addChild(kami1);
  this.kamis.addToHash(kami1);

  this.fruits = this.game.add.group();
  var fruit1 = new Fruit(this.game, 512 + 32, 512 + 32);
  this.fruits.addChild(fruit1);
  this.fruits.addToHash(fruit1);

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

  // init UI
  this.timeCountdown = this.game.add.text(32, GAME_SCREEN_HEIGHT + 32, this.timer.timeLeft, {fill: 'white'});

  // Ordering hacks
  this.game.world.bringToTop(this.fruits);
  this.game.world.bringToTop(this.players);
  this.game.world.bringToTop(this.kamis);
};
Gameplay.prototype.update = function()
{
  this.timeCountdown.text = this.timer.timeLeft;

  this.game.physics.arcade.collide(this.players, this.wallTiles);

  this.game.physics.arcade.overlap(this.players, this.fruits, this.pickUpFruit, this.checkPickUpFruit, this);
  this.game.physics.arcade.overlap(this.players, this.kamis, null, this.playerCollidesKami, this);
};
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

      console.log('player game fruit!');
    }
  } else {
    player.kill();
  }

  return false;
};

var main = function() {
  var game = new Phaser.Game(GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT + UI_BAR_HEIGHT);

  game.state.add('Preload', Preload, false);
  game.state.add('Gameplay', Gameplay, false);

  game.state.start('Preload');
};
 
