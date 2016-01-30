var TitleScreen = function(game) { };
TitleScreen.prototype.init = function() {
  this.enteredPlayers = [];
};
TitleScreen.prototype.create = function() {
  this.debugSlotsText = this.game.add.text(160, 160, '(no players)', { fill: 'white', font: '64px Arial'});

  var spaceKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  spaceKey.onUp.add(function () { this.pushInput(this.game.input.keyboard); }, this);

  var backspaceKey = this.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
  backspaceKey.onUp.add(function () { this.removeInput(this.game.input.keyboard); }, this);

  var enterKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
  enterKey.onUp.add(function () {
    this.startWithInput(this.game.input.keyboard);
  }, this);

  // start Gameplay state with something like[this.game.input.gamepad.pad1, this.game.input.keyboard, this.game.input.gamepad.pad2]
};
TitleScreen.prototype.update = function() {
  if (this.game.input.gamepad.pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
    this.pushInput(this.game.input.gamepad.pad1);
  }
  if (this.game.input.gamepad.pad2.justPressed(Phaser.Gamepad.XBOX360_A)) {
    this.pushInput(this.game.input.gamepad.pad2);
  }
  if (this.game.input.gamepad.pad3.justPressed(Phaser.Gamepad.XBOX360_A)) {
    this.pushInput(pthis.game.input.gamepad.pad3);
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
  if (this.enteredPlayers.indexOf(input) !== -1)
  {
    return;
  }

  this.enteredPlayers.push(input);

  this.debugSlotsText.text = '';
  this.enteredPlayers.forEach(function (player) { this.debugSlotsText.text += (player instanceof Phaser.Keyboard ? 'Ⓚ' : ['①', '②', '③', '④'][player.index]) + '\n'; }, this);
};
TitleScreen.prototype.removeInput = function(input) {
  if (this.enteredPlayers.indexOf(input) === -1)
  {
    return;
  }

  this.enteredPlayers.splice(this.enteredPlayers.indexOf(input), 1);

  if (this.enteredPlayers.length === 0)
  {
    this.debugSlotsText.text = '(no players)';
  }
  else
  {
    this.debugSlotsText.text = '';
    this.enteredPlayers.forEach(function (player) { this.debugSlotsText.text += (player instanceof Phaser.Keyboard ? 'Ⓚ' : ['①', '②', '③', '④'][player.index]) + '\n'; }, this);
  }
};
TitleScreen.prototype.startWithInput = function(input) {
  if (this.enteredPlayers.length < 2 || this.enteredPlayers.indexOf(input) === -1)
  {
    return;
  }

  this.game.state.start('Gameplay', true, false, this.enteredPlayers);
};