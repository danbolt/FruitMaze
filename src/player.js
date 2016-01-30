var Player = function(game, x, y, index, gamepad) {
  Phaser.Sprite.call(this, game, x, y, 'tiles_sheet', 16);

  this.game.physics.arcade.enable(this);
  this.body.setSize(16, 16);
  this.body.maxVelocity.y = 600;
  this.anchor.set(0.5, 1);
  this.animations.add('dance', [18, 19, 18, 19], 4, false).onComplete.add( function () { this.animations.play('run'); }, this);
  this.animations.add('run', [16, 17], 8, true);
  this.animations.play('run');

  this.index = index;
  this.gamepad = gamepad;

  game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if ((this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) && this.animations.currentAnim.name === 'run')
  {
    this.body.velocity.x = 100;
    this.scale.x = 1;
  }
  else if ((this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) && this.animations.currentAnim.name === 'run')
  {
    this.body.velocity.x = -100;
    this.scale.x = -1;
  }
  else
  {
    this.body.velocity.x = 0;
  }

  if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_A) && this.body.onFloor() === true)
  {
    this.body.velocity.y = -600;
  }

  if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_B) && this.body.onFloor() === true && this.animations.currentAnim.name === 'run')
  {
    this.animations.play('dance');
  }
};