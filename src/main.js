var Preload = function() {};
Preload.prototype.preload = function()
{
  this.game.load.image('tiles', 'asset/img/tiles.png');

  this.game.load.spritesheet('tiles_s', 'asset/img/tiles.png', 32, 32);
};
Preload.prototype.create = function()
{
  this.game.stage.backgroundColor = '#222222';

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
  this.players = this.game.add.group();
  var player1 = new Player(this.game, 128 + 16, 128 + 48, this.game.input.gamepad.pad1, 0);
  this.players.addChild(player1);

  this.map = this.game.add.tilemap();
  this.map.addTilesetImage('tiles');

  this.wallTiles = this.map.create('walls', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE);
  this.wallTiles.resizeWorld();

  this.map.setCollisionBetween(0, 63);

  this.model = new GraphModel(this.game, this.map, this.wallTiles, this.players);
  this.model.refreshMaze();

  this.timer = new RoundTimer(this.game, function () { this.model.refreshMaze(); }, this);
  this.timer.resetTimer();

  // init UI
  this.timeCountdown = this.game.add.text(32, 32, this.timer.timeLeft, {fill: 'white'});

  // Ordering hacks
  this.game.world.bringToTop(this.players);
};
Gameplay.prototype.update = function()
{
  this.timeCountdown.text = this.timer.timeLeft;

  this.game.physics.arcade.collide(this.players, this.wallTiles);
};

var main = function() {
  var game = new Phaser.Game(GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT);

  game.state.add('Preload', Preload, false);
  game.state.add('Gameplay', Gameplay, false);

  game.state.start('Preload');
};
 
