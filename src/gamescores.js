var GameScores = function(game, playerCount, playerWinCallback, playerWinCallbackContext) {
  this.playerCount = playerCount;

  this.playerWinCallback = playerWinCallback;
  this.playerWinCallbackContext = playerWinCallbackContext;

  this.scores = [];
  for (var i = 0; i < playerCount; i++) { this.scores.push(0); }
};
GameScores.prototype.playerEarnsScore = function(index) {
  this.scores[index] = this.scores[index] + 1;

  if (this.scores[index] >= 3) {
    this.playerWinCallback.call(this.playerWinCallbackContext, index);
  }
};
GameScores.prototype.playerScore = function(index) {
  return this.scores[index];
};
GameScores.prototype.resetScores = function() {
  this.scores = this.scores.map((function (x) { return 0; }));
}