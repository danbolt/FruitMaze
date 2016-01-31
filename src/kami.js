var KAMI_MOVE_SPEED = 50;

var Kami = function (game, x, y, index) {
  Phaser.Sprite.call(this, game, x, y, 'kami', 0);
  this.anchor.set(0.5, 0.7);

  this.scale.set(0.8);

  this.game.physics.arcade.enable(this);
  this.body.setSize(32 * (1 / this.scale.x), 32 * (1 / this.scale.x));

  this.animations.add('wiggle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(function (i) { return i + (index * 20); }), 24, true);
  this.animations.play('wiggle');

  this.alpha = 0.75;

  this.target = new Phaser.Point(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2);

  this.index = index;

  this.lockMovement = false;

  this.game.add.existing(this);
};
Kami.prototype = Object.create(Phaser.Sprite.prototype);
Kami.prototype.constructor = Kami;

Kami.prototype.update = function () {
  if (this.lockMovement === true) {
    this.body.velocity.set(0);
    return;
  }

  var deltaDirection = Phaser.Point.normalize(Phaser.Point.subtract(this.target, this.position));
  this.body.velocity.set(deltaDirection.x * KAMI_MOVE_SPEED, deltaDirection.y * KAMI_MOVE_SPEED);

  if (Math.sqrt((this.target.x - this.x) * (this.target.x - this.x) + (this.target.y - this.y) * (this.target.y - this.y)) < 16) {
    this.target.x = GAME_SCREEN_WIDTH * Math.random() * 0.8 + (0.1);
    this.target.y = GAME_SCREEN_HEIGHT * Math.random() * 0.8 + (0.1);
  }
};