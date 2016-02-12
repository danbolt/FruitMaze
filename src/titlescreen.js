var TitleScreen = function(game) { };
TitleScreen.prototype.init = function() {
  this.enteredPlayers = [];
  this.enteredPlayerData = [null, null, null, null];
  this.enteredPlayerCount = 0;

  this.inputOptions = [];

  this.slots = null;
};
TitleScreen.prototype.create = function() {

  var explanations = this.game.add.sprite(0, 0, 'explanations');

  this.game.world.sendToBack(explanations);

  this.game.input.gamepad.pads.forEach(function (pad) {
    this.inputOptions.push(new InputHandler(this.game, pad, Phaser.Gamepad.XBOX360_DPAD_UP, Phaser.Gamepad.XBOX360_DPAD_DOWN, Phaser.Gamepad.XBOX360_DPAD_LEFT, Phaser.Gamepad.XBOX360_DPAD_RIGHT, Phaser.Gamepad.XBOX360_A, Phaser.Gamepad.XBOX360_B, Phaser.Gamepad.XBOX360_START));
  }, this);

  this.inputOptions.push(new InputHandler(this.game, this.game.input.keyboard, Phaser.KeyCode.UP, Phaser.KeyCode.DOWN, Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT, Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.BACKSPACE, Phaser.KeyCode.ENTER));
  this.inputOptions.push(new InputHandler(this.game, this.game.input.keyboard, Phaser.KeyCode.W, Phaser.KeyCode.S, Phaser.KeyCode.A, Phaser.KeyCode.D, Phaser.KeyCode.E, Phaser.KeyCode.Q, Phaser.KeyCode.ENTER));

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
  this.inputOptions.forEach(function (option) {
    if (option.isDown('accept')) {
      this.pushInput(option);
    }
  }, this);

  this.inputOptions.forEach(function (option) {
    if (option.isDown('back')) {
      this.removeInput(option);
    }
  }, this);

  this.inputOptions.forEach(function (option) {
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
};
TitleScreen.prototype.removeInput = function(inputOption) {
  for (var i = 0; i < 4; i++) {
    if (this.enteredPlayerData[i] === inputOption) {
      this.enteredPlayerData[i] = null;
      this.enteredPlayerCount -= 1;

      return;
    }
  }
};
TitleScreen.prototype.startWithInput = function() {
  if (this.enteredPlayerCount < 2)
  {
    return;
  }

  this.game.state.start('Gameplay', true, false, this.enteredPlayerData);
};