var ROUND_TIME = 40; //seconds
var TIME_PER_LABRYNTH_SWITCH = 4;

var RoundTimer = function(game, labrynthSwitchCallback, labrynthSwitchCallbackContext, roundUpCallback, roundUpCallbackContext) {
  this.game = game;

  this.timeLeft = ROUND_TIME;
  this.timeUntilSwitch = TIME_PER_LABRYNTH_SWITCH;

  this.timer = game.time.create(false);
  this.timer.start();

  this.timerEvent = null;

  this.labrynthSwitchCallback = labrynthSwitchCallback;
  this.labrynthSwitchCallbackContext = labrynthSwitchCallbackContext;

  this.roundUpCallback = roundUpCallback;
  this.roundUpCallbackContext = roundUpCallbackContext;
};
RoundTimer.prototype.resetTimer = function () {
  this.timeLeft = ROUND_TIME;

  if (this.timerEvent !== null) {
    this.stopTimer();
  }

  this.timerEvent = this.timer.loop(1000, this.tick, this);
};
RoundTimer.prototype.isPaused = function () {
  return this.timer.paused;
};
RoundTimer.prototype.pauseTimer = function () {
  this.timer.pause();
};
RoundTimer.prototype.unpauseTimer = function () {
  this.timer.resume();
};
RoundTimer.prototype.stopTimer = function () {
  if (this.timerEvent !== null)
  {
    this.timer.remove(this.timerEvent);
    this.timerEvent = null;
  }

  this.roundUpCallback.call(this.roundUpCallbackContext, -1);
}
RoundTimer.prototype.tick = function () {
  this.timeLeft = Math.max(this.timeLeft - 1, 0);
  this.timeUntilSwitch = Math.max(this.timeUntilSwitch - 1, 0);

  if (this.timeUntilSwitch === 0) {
    this.timeUntilSwitch = TIME_PER_LABRYNTH_SWITCH;

    this.labrynthSwitchCallback.call(this.labrynthSwitchCallbackContext);
  }

  if (this.timeLeft === 0) {
    this.stopTimer();
  }
}