var Kami = function (game, x, y, index) {
  Phaser.Sprite.call(this, game, x, y, 'tiles_s', 0);
  this.anchor.set(0.5, 0.5);

  this.game.physics.arcade.enable(this);
  this.body.setSize(32, 32);

  this.tint = 0xFF0000;

  this.index = index;

  this.game.add.existing(this);
};
Kami.prototype = Object.create(Phaser.Sprite.prototype);
Kami.prototype.constructor = Kami;

Kami.prototype.update = function () {
  this.body.velocity.set(Math.random() * 100 - 50, Math.random() * 100 - 50);
};