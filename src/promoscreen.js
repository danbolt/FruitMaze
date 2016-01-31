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

  var gameLogoPlaceHolder = this.game.add.text(GAME_SCREEN_WIDTH / 2, (GAME_SCREEN_HEIGHT + UI_BAR_HEIGHT) * 0.4, '(logo here)', {fill: 'white', font: '24px Georgia, serif'})
  gameLogoPlaceHolder.anchor.set(0.5);
  gameLogoPlaceHolder.align = 'center';

  var beginText = this.game.add.text(GAME_SCREEN_WIDTH / 2, (GAME_SCREEN_HEIGHT + UI_BAR_HEIGHT) * 0.8, 'Press any Button to Begin!', {fill: 'white', font: '48px Georgia, serif'})
  beginText.anchor.set(0.5);
  beginText.align = 'center';

  var beginText = this.game.add.text(16, GAME_SCREEN_HEIGHT + UI_BAR_HEIGHT - 24, '#ggj2016kyoto', {fill : 'white', font: '16px Georgia, sans-serif'});
};
Promoscreen.prototype.update = function () {
  //
};
Promoscreen.prototype.shutdown = function () {
  this.game.input.gamepad.onUpCallback = function () {};
  this.game.input.keyboard.onUpCallback = function () {};
}
