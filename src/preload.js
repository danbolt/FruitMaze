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

  this.game.state.start('Gameplay', true, false, [this.game.input.gamepad.pad1, this.game.input.keyboard]);
};