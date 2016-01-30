var main = function() {
  var game = new Phaser.Game(GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT + UI_BAR_HEIGHT);

  game.state.add('Preload', Preload, false);
  game.state.add('TitleScreen', TitleScreen, false);
  game.state.add('Gameplay', Gameplay, false);

  game.state.start('Preload');
};
 
