var Flame = function(game, x, y) {
  Phaser.Sprite.call(this, game, x + 16, y + 16, 'flame', 0);
  this.anchor.set(0.5, 0.75);

  this.game.physics.arcade.enable(this);
  this.body.setSize(32, 32);

  this.animations.add('burn', [0, 1, 2, 1], 12, true);
  this.animations.play('burn');

  this.game.add.existing(this);
};
Flame.prototype = Object.create(Phaser.Sprite.prototype);
Flame.prototype.constructor = Flame;