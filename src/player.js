var Player = function(game, x, y, gamepad) {
  Phaser.Sprite.call(this, game, x, y, null, undefined);

  this.game.physics.arcade.enable(this);
  this.body.setSize(24, 24);

  this.gamepad = gamepad;

  game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
};