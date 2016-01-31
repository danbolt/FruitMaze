var TitleScreen = function(game) { };
TitleScreen.prototype.init = function() {
  this.enteredPlayers = [];

  this.slots = null;
};
TitleScreen.prototype.create = function() {

  var explanations = this.game.add.sprite(0, 0, 'explanations');

  this.slots = this.game.add.group();
  this.slots.x = GAME_SCREEN_WIDTH * 0.15;
  this.slots.y = (GAME_SCREEN_HEIGHT + UI_BAR_HEIGHT) * 0.75;

  this.emtpySlots = this.game.add.group();
  this.emtpySlots.x = this.slots.x;
  this.emtpySlots.y = this.slots.y;

  for (var i = 0; i < 4; i++) {
    var empty = this.game.add.sprite(i * 180, -48, 'grey_icon');
    empty.anchor.x = 0.5;
    empty.alpha = 0.5;
    this.emtpySlots.addChild(empty);
  }

  this.game.world.sendToBack(this.emtpySlots);
  this.game.world.sendToBack(explanations);

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

  var instructions = this.game.add.text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT * 0.6, 'Press Ⓐ to enter\nPress Ⓑ to exit\nPress START when everyone has joined', {fill: 'white', font: '24px Georgia, sans-serif'});
  instructions.anchor.x = 0.5;
  instructions.align = 'center';

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
  var slotData = this.game.add.sprite(ind * 180, -48, 'icon', 4 * ind);
  for (var i = 0; i < 4; i++) {
    slotData.animations.add(i.toString(), [0, 1, 2, 3].map(function (a) { return a + i * 4; }), 12, true);
  }
  slotData.animations.play(ind.toString());
  slotData.anchor.x = 0.5;
  this.slots.addChild(slotData);
  var slotSymbol = this.game.add.text(0, 180, (input instanceof Phaser.Keyboard ? '⌨' : ['🎮', '🎮', '🎮', '🎮'][input.index]), {fill: 'white', font: '48px Georgia, sans-serif'});
  slotSymbol.align = 'center';
  slotSymbol.anchor.set(0.5);
  slotSymbol.cacheAsBitmap = true;
  slotData.addChild(slotSymbol);

  for (var i = 0; i < 4; i++) {
    this.emtpySlots.children[i].visible = (i >= this.enteredPlayers.length);
  }
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
    slot.animations.play((this.slots.children.indexOf(slot)).toString());
    slot.x = (this.slots.children.indexOf(slot)) * 180;
  }, this);

  for (var i = 0; i < 4; i++) {
    this.emtpySlots.children[i].visible = (i >= this.enteredPlayers.length);
  }
};
TitleScreen.prototype.startWithInput = function(input) {
  if (this.enteredPlayers.length < 2 || this.enteredPlayers.indexOf(input) === -1)
  {
    return;
  }

  this.game.state.start('Gameplay', true, false, this.enteredPlayers);
};