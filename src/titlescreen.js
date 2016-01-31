var TitleScreen = function(game) { };
TitleScreen.prototype.init = function() {
  this.enteredPlayers = [];

  this.slots = null;
};
TitleScreen.prototype.create = function() {

  this.slots = this.game.add.group();
  this.slots.x = GAME_SCREEN_WIDTH * 0.15;
  this.slots.y = GAME_SCREEN_HEIGHT * 0.8;

  var spaceKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  spaceKey.onUp.add(function () { this.pushInput(this.game.input.keyboard); }, this);

  var backspaceKey = this.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
  backspaceKey.onUp.add(function () { this.removeInput(this.game.input.keyboard); }, this);

  var enterKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
  enterKey.onUp.add(function () {
    this.startWithInput(this.game.input.keyboard);
  }, this);

  var fullScreenKey = this.game.input.keyboard.addKey(Phaser.KeyCode.F4);
  fullScreenKey.onUp.add(function () {
    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
    }
    else
    {
        this.game.scale.startFullScreen(false);
    }
  }, this);

  this.game.bgm.volume = 0.25;
};
TitleScreen.prototype.update = function() {
  if (this.game.input.gamepad.pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
    this.pushInput(this.game.input.gamepad.pad1);
  }
  if (this.game.input.gamepad.pad2.justPressed(Phaser.Gamepad.XBOX360_A)) {
    this.pushInput(this.game.input.gamepad.pad2);
  }
  if (this.game.input.gamepad.pad3.justPressed(Phaser.Gamepad.XBOX360_A)) {
    this.pushInput(this.game.input.gamepad.pad3);
  }
  if (this.game.input.gamepad.pad4.justPressed(Phaser.Gamepad.XBOX360_A)) {
    this.pushInput(this.game.input.gamepad.pad4);
  }

  if (this.game.input.gamepad.pad1.justPressed(Phaser.Gamepad.XBOX360_B)) {
    this.removeInput(this.game.input.gamepad.pad1);
  }
  if (this.game.input.gamepad.pad2.justPressed(Phaser.Gamepad.XBOX360_B)) {
    this.removeInput(this.game.input.gamepad.pad2);
  }
  if (this.game.input.gamepad.pad3.justPressed(Phaser.Gamepad.XBOX360_B)) {
    this.removeInput(this.game.input.gamepad.pad3);
  }
  if (this.game.input.gamepad.pad4.justPressed(Phaser.Gamepad.XBOX360_B)) {
    this.removeInput(this.game.input.gamepad.pad4);
  }

  if (this.game.input.gamepad.pad1.justPressed(Phaser.Gamepad.XBOX360_START)) {
    this.startWithInput(this.game.input.gamepad.pad1);
  }
  if (this.game.input.gamepad.pad2.justPressed(Phaser.Gamepad.XBOX360_START)) {
    this.startWithInput(this.game.input.gamepad.pad2);
  }
  if (this.game.input.gamepad.pad3.justPressed(Phaser.Gamepad.XBOX360_START)) {
    this.startWithInput(this.game.input.gamepad.pad3);
  }
  if (this.game.input.gamepad.pad4.justPressed(Phaser.Gamepad.XBOX360_START)) {
    this.startWithInput(this.game.input.gamepad.pad4);
  }
};

TitleScreen.prototype.pushInput = function(input) {
  if (this.enteredPlayers.indexOf(input) !== -1 || this.enteredPlayers.length > 3)
  {
    return;
  }

  this.enteredPlayers.push(input);

  this.game.sound.play('click', 1.2);

  var ind = this.enteredPlayers.length - 1;
  var slotData = this.game.add.sprite((ind / 4) * (GAME_SCREEN_WIDTH * 0.8), 0, 'charsheet', 51 * ind);
  this.slots.addChild(slotData);
  var slotSymbol = this.game.add.text(32, 128, (input instanceof Phaser.Keyboard ? '⌨' : ['①', '②', '③', '④'][input.index]), {fill: 'white', font: '64px Georgia, sans-serif'});
  slotSymbol.align = 'center';
  slotSymbol.anchor.set(0.5);
  slotSymbol.cacheAsBitmap = true;
  slotData.addChild(slotSymbol);
};
TitleScreen.prototype.removeInput = function(input) {
  if (this.enteredPlayers.indexOf(input) === -1)
  {
    return;
  }

  var ind = this.enteredPlayers.indexOf(input);

  this.enteredPlayers.splice(ind, 1);

  this.slots.remove(this.slots.children[ind]);

  this.slots.forEach(function (slot) {
    slot.frame = (this.slots.children.indexOf(slot) * 51);
    slot.x = (this.slots.children.indexOf(slot) / 4) * (GAME_SCREEN_WIDTH * 0.8);
  }, this);
};
TitleScreen.prototype.startWithInput = function(input) {
  if (this.enteredPlayers.length < 2 || this.enteredPlayers.indexOf(input) === -1)
  {
    return;
  }

  this.game.state.start('Gameplay', true, false, this.enteredPlayers);
};