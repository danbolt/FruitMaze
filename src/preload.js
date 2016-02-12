var Preload = function() {};
Preload.prototype.preload = function()
{
  this.game.load.audio('main_theme', 'asset/bgm/main.ogg');

  this.game.load.audio('wall0', 'asset/sfx/wall1.ogg');
  this.game.load.audio('wall1', 'asset/sfx/wall2.ogg');
  this.game.load.audio('wall2', 'asset/sfx/wall3.ogg');
  this.game.load.audio('pick_fruit', 'asset/sfx/pick_fruit.ogg');
  this.game.load.audio('gift', 'asset/sfx/gift.ogg');
  this.game.load.audio('death', 'asset/sfx/death.ogg');
  this.game.load.audio('click', 'asset/sfx/click.ogg');
  this.game.load.audio('victory', 'asset/sfx/victory.ogg');
  this.game.load.audio('drop', 'asset/sfx/drop.ogg');
  this.game.load.audio('bump', 'asset/sfx/bump.ogg');

  this.game.load.image('explanations', 'asset/img/explanations.jpg');
  this.game.load.image('title_bg', 'asset/img/title_bg.jpg');
  this.game.load.image('logo', 'asset/img/title1.png');

  this.game.load.image('tiles', 'asset/img/tiles.png');
  this.game.load.image('grey_icon', 'asset/img/icone_grey.png');
  this.game.load.image('shadow', 'asset/img/shadow.png');

  this.game.load.spritesheet('tiles_s', 'asset/img/tiles.png', 32, 32);
  this.game.load.spritesheet('charsheet', 'asset/img/chara_anim_sheet.png', 70, 80);
  this.game.load.spritesheet('flame', 'asset/img/flame.png', 32, 64);
  this.game.load.spritesheet('kami', 'asset/img/kami.png', 140, 190);
  this.game.load.spritesheet('fruit', 'asset/img/fruits.png', 40, 50);
  this.game.load.spritesheet('icon', 'asset/img/icone.png', 100, 200);

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
  this.game.input.gamepad.pads = [this.game.input.gamepad.pad1, this.game.input.gamepad.pad2, this.game.input.gamepad.pad3, this.game.input.gamepad.pad4];


  this.game.input.gamepad.pads.forEach(function (pad) {
    InputHandler.Options.push(new InputHandler(this.game, pad, Phaser.Gamepad.XBOX360_DPAD_UP, Phaser.Gamepad.XBOX360_DPAD_DOWN, Phaser.Gamepad.XBOX360_DPAD_LEFT, Phaser.Gamepad.XBOX360_DPAD_RIGHT, Phaser.Gamepad.XBOX360_A, Phaser.Gamepad.XBOX360_B, Phaser.Gamepad.XBOX360_START));
  }, this);

  InputHandler.Options.push(new InputHandler(this.game, this.game.input.keyboard, Phaser.KeyCode.UP, Phaser.KeyCode.DOWN, Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT, Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.ESC, Phaser.KeyCode.ENTER));
  InputHandler.Options.push(new InputHandler(this.game, this.game.input.keyboard, Phaser.KeyCode.W, Phaser.KeyCode.S, Phaser.KeyCode.A, Phaser.KeyCode.D, Phaser.KeyCode.E, Phaser.KeyCode.Q, Phaser.KeyCode.ENTER));
};
Preload.prototype.update = function ()
{
  if (this.game.cache.isSoundDecoded('main_theme'))
  {
    this.game.state.start('Promoscreen', true, false);

    this.game.bgm = this.game.sound.play('main_theme', 0.25, true);
  }
};