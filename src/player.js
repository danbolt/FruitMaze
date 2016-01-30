var PLAYER_MOVE_SPEED = 100;

var Player = function(game, x, y, gamepad, index) {
  Phaser.Sprite.call(this, game, x, y, 'tiles_s', 0);
  this.anchor.set(0.5, 1);

  this.game.physics.arcade.enable(this);
  this.body.setSize(24, 24);

  this.gamepad = gamepad;

  game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  this.directionalMove();
};
Player.prototype.directionalMove = function () {
  if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
    this.body.velocity.x = -1 * PLAYER_MOVE_SPEED;
  } else if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
    this.body.velocity.x = PLAYER_MOVE_SPEED;
  } else {
    this.body.velocity.x = 0;
  }

  if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
    this.body.velocity.y = -1 * PLAYER_MOVE_SPEED;
  } else if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
    this.body.velocity.y = PLAYER_MOVE_SPEED;
  } else {
    this.body.velocity.y = 0;
  }
};