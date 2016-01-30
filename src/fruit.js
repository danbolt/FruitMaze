var Fruit = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'tiles_s', 0);

  this.anchor.set(0.5);

  this.game.physics.arcade.enable(this);
  this.body.setSize(32, 32);

  this.tint = 0xDD22DD;

  this.game.add.existing(this);
};
Fruit.prototype = Object.create(Phaser.Sprite.prototype);
Fruit.prototype.constructor = Fruit;