var KAMI_MOVE_SPEED = 50;

var Kami = function (game, x, y, index) {
  Phaser.Sprite.call(this, game, x, y, 'tiles_s', 0);
  this.anchor.set(0.5, 0.5);

  this.game.physics.arcade.enable(this);
  this.body.setSize(32, 32);

  this.target = new Phaser.Point(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2);

  this.index = index;

  this.game.add.existing(this);
};
Kami.prototype = Object.create(Phaser.Sprite.prototype);
Kami.prototype.constructor = Kami;

Kami.prototype.update = function () {
  var deltaDirection = Phaser.Point.normalize(Phaser.Point.subtract(this.target, this.position));
  this.body.velocity.set(deltaDirection.x * KAMI_MOVE_SPEED, deltaDirection.y * KAMI_MOVE_SPEED);

  if (Math.sqrt((this.target.x - this.x) * (this.target.x - this.x) + (this.target.y - this.y) * (this.target.y - this.y)) < 16) {
    this.target.x = GAME_SCREEN_WIDTH * Math.random() * 0.8 + (0.1);
    this.target.y = GAME_SCREEN_HEIGHT * Math.random() * 0.8 + (0.1);
  }
};