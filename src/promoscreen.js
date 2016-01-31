var Promoscreen = function () {};
Promoscreen.prototype.init = function () {
  //
};
Promoscreen.prototype.create = function () {
  var that = this;

  this.game.input.gamepad.onUpCallback = function () {
    that.game.state.start('TitleScreen');
  };

  this.game.input.keyboard.onUpCallback = function () {
    that.game.state.start('TitleScreen');
  };

  this.game.add.sprite(0, 0, 'title_bg');

  var gameLogo = this.game.add.sprite(0, 0, 'logo');
  gameLogo.alpha = 0;
  var logoTween = this.game.add.tween(gameLogo);
  logoTween.to({alpha: 1}, 500, Phaser.Easing.Cubic.InOut);
  logoTween.start();

  var beginText = this.game.add.text(GAME_SCREEN_WIDTH / 2, (GAME_SCREEN_HEIGHT + UI_BAR_HEIGHT) * 0.4, 'START', {fill: 'white', font: '24px Georgia, serif'})
  beginText.anchor.set(0.5);
  beginText.align = 'center';
  this.game.time.events.loop(400, function () { beginText.visible = !beginText.visible; }, this);

  var note = this.game.add.text(16, GAME_SCREEN_HEIGHT + UI_BAR_HEIGHT - 24, 'By Rinaldo Wirz, Daniel Savage, and Thomas Olsson', {fill : 'white', font: '16px Georgia, sans-serif'});
};
Promoscreen.prototype.update = function () {
  //
};
Promoscreen.prototype.shutdown = function () {
  this.game.input.gamepad.onUpCallback = function () {};
  this.game.input.keyboard.onUpCallback = function () {};
}
