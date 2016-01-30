var Preload = function() {};
Preload.prototype.preload = function()
{
  this.game.load.audio('main_theme', 'asset/bgm/main.ogg');

  this.game.load.audio('wall0', 'asset/sfx/wall1.ogg');
  this.game.load.audio('wall1', 'asset/sfx/wall2.ogg');
  this.game.load.audio('wall2', 'asset/sfx/wall3.ogg');

  this.game.load.image('tiles', 'asset/img/tiles.png');

  this.game.load.spritesheet('tiles_s', 'asset/img/tiles.png', 32, 32);
  this.game.load.spritesheet('charsheet', 'asset/img/chara_anim_sheet.png', 70, 80);

  this.game.load.spritesheet('particles', 'asset/img/particles.png', 16, 16);
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
};
Preload.prototype.update = function ()
{
  if (this.game.cache.isSoundDecoded('main_theme'))
  {
    this.game.state.start('TitleScreen', true, false);

    var bgm = this.game.add.audio('main_theme', 0.25, true);
    bgm.play();
  }
};