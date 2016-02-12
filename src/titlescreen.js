var TitleScreen = function(game) { };
TitleScreen.prototype.init = function(prevPlayerData) {
  this.enteredPlayerData = prevPlayerData ? prevPlayerData : [null, null, null, null];
  this.enteredPlayerCount = 0;

  for (var i = 0; i < 4; i++) {
    if (this.enteredPlayerData[i] !== null) {
      this.enteredPlayerCount++;
    }
  }

  this.slotGraphics = null;
  this.emptySlotGraphics = null;
};
TitleScreen.prototype.create = function() {

  var explanations = this.game.add.sprite(0, 0, 'explanations');

  this.game.world.sendToBack(explanations);

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

  var instructions = this.game.add.text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT * 0.6, 'Press Ⓐ/SPACE/Q to enter\nPress Ⓑ/ESC/Q to exit\nPress START/ENTER when everyone has joined', {fill: 'white', font: '24px Georgia, sans-serif'});
  instructions.anchor.x = 0.5;
  instructions.align = 'center';

  this.slotGraphics = this.game.add.group();
  this.emptySlotGraphics = this.game.add.group();
  for (var i = 0; i < 4; i++) {
    var newSlotSprite = this.game.add.sprite(192 * i - 288, 0, 'icon', i * 4);
    newSlotSprite.animations.add('run', [0, 1, 2, 3, 2, 1].map(function (a) { return a + i * 4; }), 12, true);
    newSlotSprite.anchor.set(0.5);
    newSlotSprite.animations.play('run');
    newSlotSprite.renderable = false;
    this.slotGraphics.addChild(newSlotSprite);

    var offGraphic = this.game.add.sprite(192 * i - 288, 0, 'grey_icon');
    offGraphic.anchor.set(0.5);
    offGraphic.alpha = 0.75;
    this.emptySlotGraphics.addChild(offGraphic);
  }
  this.slotGraphics.x = this.emptySlotGraphics.x = this.game.width / 2;
  this.slotGraphics.y = this.emptySlotGraphics.y = this.game.height - 128;

  this.game.bgm.volume = 0.25;

  this.updateInputGraphics();
};
TitleScreen.prototype.update = function() {
  InputHandler.Options.forEach(function (option) {
    if (option.isDown('accept')) {
      this.pushInput(option);
    }
  }, this);

  InputHandler.Options.forEach(function (option) {
    if (option.isDown('back')) {
      this.removeInput(option);
    }
  }, this);

  InputHandler.Options.forEach(function (option) {
    if (option.isDown('start')) {
      if (this.enteredPlayerData.indexOf(option) !== -1) {
        this.startWithInput();
      }
    }
  }, this);
};

TitleScreen.prototype.pushInput = function(inputOption) {
  // don't enter the same player twice
  for (var i = 0; i < 4; i++) {
    if (this.enteredPlayerData[i] === inputOption) {
      return;
    }
  }

  // find an empty spot to place the player
  var placementIndex = -1;
  for (var i = 0; i < 4; i++) {
    if (this.enteredPlayerData[i] === null) {
      placementIndex = i;
      break;
    }
  }
  if (placementIndex === -1) {
    return;
  }

  this.enteredPlayerData[placementIndex] = inputOption;
  this.game.sound.play('click', 1.2);
  this.enteredPlayerCount += 1;

  this.updateInputGraphics();
};
TitleScreen.prototype.removeInput = function(inputOption) {
  for (var i = 0; i < 4; i++) {
    if (this.enteredPlayerData[i] === inputOption) {
      this.enteredPlayerData[i] = null;
      this.enteredPlayerCount -= 1;

      this.updateInputGraphics();

      return;
    }
  }
};
TitleScreen.prototype.updateInputGraphics = function() {
  for (var i = 0; i < 4; i++) {
    this.slotGraphics.children[i].renderable = this.enteredPlayerData[i] !== null;
    this.emptySlotGraphics.children[i].renderable = this.enteredPlayerData[i] == null;
  }
};
TitleScreen.prototype.startWithInput = function() {
  if (this.enteredPlayerCount < 2)
  {
    return;
  }

  this.game.state.start('Gameplay', true, false, this.enteredPlayerData);
};