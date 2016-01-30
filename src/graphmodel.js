var MATRIX_WIDTH = Math.ceil(MAP_WIDTH / ROOM_WIDTH);
var MATRIX_HEIGHT = Math.ceil(MAP_HEIGHT / ROOM_HEIGHT);

var GraphModel = function(game, map, wallLayer) {
  this.game = game;

  this.map = map;
  this.wallLayer = wallLayer;

  this.adjacncyMatrix = [];
  for (var i = 0; i < MATRIX_WIDTH * MATRIX_HEIGHT; i++) {
    var row = [];
    for (var j = 0; j < MATRIX_WIDTH * MATRIX_HEIGHT; j++) {
      row.push(false);
    }
    this.adjacncyMatrix.push(row);
  }
};
GraphModel.prototype.addEdge = function (x1, y1, x2, y2) {
  if (x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0 || x1 >= MATRIX_WIDTH || x2 >= MATRIX_WIDTH || y1 >= MATRIX_HEIGHT || y2 >= MATRIX_HEIGHT) {
    return;
  }

  if ((x2 === MATRIX_WIDTH - 1 && y1 !== y2) || (x2 === 0 && y1 !== y2) ||
      (y2 === MATRIX_HEIGHT - 1 && x1 !== x2) || (y2 === 0 && x1 !== x2)) 
  {
    return;
  }

  this.adjacncyMatrix[x1 * MATRIX_HEIGHT + y1][x2 * MATRIX_HEIGHT + y2] = true;
  this.adjacncyMatrix[x2 * MATRIX_HEIGHT + y2][x1 * MATRIX_HEIGHT + y1] = true;
}
GraphModel.prototype.removeEdge = function (x1, y1, x2, y2) {
  if (x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0 || x1 >= MATRIX_WIDTH || x2 >= MATRIX_WIDTH || y1 >= MATRIX_HEIGHT || y2 >= MATRIX_HEIGHT) {
    return;
  }

  this.adjacncyMatrix[x1 * MATRIX_HEIGHT + y1][x2 * MATRIX_HEIGHT + y2] = false;
  this.adjacncyMatrix[x2 * MATRIX_HEIGHT + y2][x1 * MATRIX_HEIGHT + y1] = false;
}
GraphModel.prototype.checkEdge = function (x1, y1, x2, y2) {
  if (x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0 || x1 >= MATRIX_WIDTH || x2 >= MATRIX_WIDTH || y1 >= MATRIX_HEIGHT || y2 >= MATRIX_HEIGHT) {
    return false;
  }

  return (this.adjacncyMatrix[x1 * MATRIX_HEIGHT + y1][x2 * MATRIX_HEIGHT + y2]) && (this.adjacncyMatrix[x2 * MATRIX_HEIGHT + y2][x1 * MATRIX_HEIGHT + y1]);
}

GraphModel.prototype.randomizeEdges = function() {
  for (var i = 0; i < MATRIX_WIDTH; i++) {
    for (var j = 0; j < MATRIX_HEIGHT; j++) {
      if (Math.random() < 0.5) {
        this.addEdge(i, j, i + 1, j);
      } else {
        this.removeEdge(i, j, i + 1, j);
      }

      if (Math.random() < 0.5) {
        this.addEdge(i, j, i, j + 1);
      } else {
        this.removeEdge(i, j, i, j + 1);
      }
    }
  }
}

GraphModel.prototype.fillWalls = function() {
  for (var i = 0; i < MATRIX_WIDTH; i++)
  {
    for (var j = 0; j < MATRIX_HEIGHT; j++)
    {
      this.map.putTile(14, i * ROOM_WIDTH, j * ROOM_HEIGHT, 0);

      // place horizontal gaps
      if (this.checkEdge(i, j, i + 1, j) === false) {
        this.map.putTile(5, i * ROOM_WIDTH + 1, j * ROOM_HEIGHT, 0);
      }
      else {
        this.map.removeTile(i * ROOM_WIDTH + 1, j * ROOM_HEIGHT, 0);
      }

      if (this.checkEdge(i, j, i - 1, j) === false) {
        this.map.putTile(5, i * ROOM_WIDTH - 1, j * ROOM_HEIGHT, 0);
      }
      else {
        this.map.removeTile(i * ROOM_WIDTH - 1, j * ROOM_HEIGHT, 0);
      }

      // place vertical gaps
      if (this.checkEdge(i, j, i, j + 1) === false) {
        this.map.putTile(5, i * ROOM_WIDTH, j * ROOM_HEIGHT + 1, 0);
      }
      else {
        this.map.removeTile(i * ROOM_WIDTH, j * ROOM_HEIGHT + 1, 0);
      }

      if (this.checkEdge(i, j, i, j - 1) === false) {
        this.map.putTile(5, i * ROOM_WIDTH, j * ROOM_HEIGHT - 1, 0);
      }
      else {
        this.map.removeTile(i * ROOM_WIDTH, j * ROOM_HEIGHT - 1, 0);
      }
    }
  }
}