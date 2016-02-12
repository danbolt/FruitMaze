var InputHandler = function(game, device, up, down, left, right, accept, back, start) {
  if (device instanceof Phaser.SinglePad || device instanceof Phaser.Keyboard) {
    this.device = device;
  }
  else {
    throw "No proper device specified";
  }

  this.upButton = up;
  this.downButton = down;
  this.leftButton = left;
  this.rightButton = right;
  this.acceptButton = accept;
  this.backButton = back;
  this.startButton = start;
};
InputHandler.prototype.isDown = function (value) {
  switch (value) {
    case 'up':
      return this.device.isDown(this.upButton);
    case 'down':
      return this.device.isDown(this.downButton);
    case 'left':
      return this.device.isDown(this.leftButton);
    case 'right':
      return this.device.isDown(this.rightButton);
    case 'accept':
      return this.device.isDown(this.acceptButton);
    case 'back':
      return this.device.isDown(this.backButton);
    case 'start':
      return this.device.isDown(this.startButton);
    default:
      return false;
  }
};
InputHandler.Options = [];