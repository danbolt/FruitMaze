var PLAYER_MOVE_SPEED = 300;

var Player = function(game, x, y, gamepad, index, keyboard) {
  Phaser.Sprite.call(this, game, x, y, 'tiles_s', 0);
  this.anchor.set(0.5, 0.75);

  this.game.physics.arcade.enable(this);
  this.body.setSize(16, 16);

  this.gamepad = gamepad;
  this.keyboard = keyboard;

  this.index = index;

  this.holdingFruit = false;

  game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  this.directionalMove();
};
Player.prototype.directionalMove = function () {
  if (this.gamepad) {
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
    } else if (this.keyboard) {
      if (this.keyboard.isDown(Phaser.KeyCode.LEFT)) {
        this.body.velocity.x = -1 * PLAYER_MOVE_SPEED;
      } else if (this.keyboard.isDown(Phaser.KeyCode.RIGHT))
      {
        this.body.velocity.x = PLAYER_MOVE_SPEED;
      } else {
        this.body.velocity.x = 0;
      }

      if (this.keyboard.isDown(Phaser.KeyCode.UP)) {
        this.body.velocity.y = -1 * PLAYER_MOVE_SPEED;
      } else if (this.keyboard.isDown(Phaser.KeyCode.DOWN))
      {
        this.body.velocity.y = PLAYER_MOVE_SPEED;
      } else {
        this.body.velocity.y = 0;
      }
  }
};
Player.prototype.holdFruit = function() {
  this.holdingFruit = true;
};