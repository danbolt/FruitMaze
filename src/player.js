var PLAYER_MOVE_SPEED = 300;

var Player = function(game, x, y, gamepad, index) {
  Phaser.Sprite.call(this, game, x, y, 'charsheet', index * 51);
  this.anchor.set(0.5, 0.7);

  this.animations.add('idle_down', [0].map(function (a) { return a + index * 51; }), 12, false);
  this.animations.add('idle_left', [1].map(function (a) { return a + index * 51; }), 12, false);
  this.animations.add('idle_up', [2].map(function (a) { return a + index * 51; }), 12, false);
  this.animations.add('walk_down', [3, 4, 5, 6, 5, 4].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('walk_left', [7, 8, 9, 10, 9, 8].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('walk_up', [11, 12, 13, 14, 13, 12].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('idle_down_carry', [15].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('idle_left_carry', [19].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('idle_up_carry', [23].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('walk_down_carry', [15, 16, 17, 18, 17, 16].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('walk_left_carry', [19, 20, 21, 22, 21, 20].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('walk_up_carry', [23, 24, 25, 26, 25, 24].map(function (a) { return a + index * 51; }), 12, true);
  this.animations.add('die', [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50].map(function (a) { return a + index * 51; }), 24, false);

  this.facing = 'down';

  this.defeated = false;

  this.game.physics.arcade.enable(this);
  this.body.setSize(24, 24);

  if (gamepad instanceof Phaser.SinglePad)
  {
    this.gamepad = gamepad;
  }
  else
  {
    this.keyboard = gamepad;
  }

  this.index = index;

  this.holdingFruit = false;

  this.lockMovement = false;

  this.knockbackDirection = new Phaser.Point(0, 0);

  game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if (this.knockbackDirection.getMagnitude() < 0.01)
  {
    this.directionalMove();
  }
  else
  {
    this.body.velocity.set(Phaser.Point.normalize(this.knockbackDirection).x * PLAYER_MOVE_SPEED, Phaser.Point.normalize(this.knockbackDirection).y * PLAYER_MOVE_SPEED);
  }

  this.scale.x = (this.facing === 'right' ? -1 : 1);

  if (this.defeated === false) {
    this.animations.play(((this.body.velocity.getMagnitude() < 0.001) ? 'idle' : 'walk') + '_' + (this.facing === 'right' ? 'left' : this.facing) + (this.holding !== undefined ? '_carry' : ''));
  } else {
    //
  }
};
Player.prototype.directionalMove = function () {
  if (this.lockMovement === true) {
    this.body.velocity.set(0);
    return;
  }

  if (this.gamepad) {
    if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
      this.body.velocity.x = -1 * PLAYER_MOVE_SPEED;

      this.facing = 'left';
    } else if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
      this.body.velocity.x = PLAYER_MOVE_SPEED;

      this.facing = 'right';
    } else {
      this.body.velocity.x = 0;
    }

    if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
      this.body.velocity.y = -1 * PLAYER_MOVE_SPEED;

      this.facing = 'up';
    } else if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
      this.body.velocity.y = PLAYER_MOVE_SPEED;

      this.facing = 'down';
    } else {
      this.body.velocity.y = 0;
    }
    } else if (this.keyboard) {
      if (this.keyboard.isDown(Phaser.KeyCode.LEFT)) {
        this.body.velocity.x = -1 * PLAYER_MOVE_SPEED;

        this.facing = 'left';
      } else if (this.keyboard.isDown(Phaser.KeyCode.RIGHT))
      {
        this.body.velocity.x = PLAYER_MOVE_SPEED;

        this.facing = 'right';
      } else {
        this.body.velocity.x = 0;
      }

      if (this.keyboard.isDown(Phaser.KeyCode.UP)) {
        this.body.velocity.y = -1 * PLAYER_MOVE_SPEED;

        this.facing = 'up';
      } else if (this.keyboard.isDown(Phaser.KeyCode.DOWN))
      {
        this.body.velocity.y = PLAYER_MOVE_SPEED;

        this.facing = 'down';
      } else {
        this.body.velocity.y = 0;
      }
  }
};
Player.prototype.holdFruit = function() {
  this.holdingFruit = true;
};
Player.prototype.defeat = function() {
  this.lockMovement = true;
  this.defeated = true;
  this.animations.play('die');
  this.knockbackDirection.set(0);

  if (this.holding !== undefined) {
    this.holding.kill();
    this.holding = null;
  }
};