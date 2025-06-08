const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const grid = 20;
const rows = canvas.height / grid;
const cols = canvas.width / grid;

let board = Array.from({ length: rows }, () => Array(cols).fill(0));

const tetrominoes = {
  I: [[1, 1, 1, 1]],
  O: [
    [2, 2],
    [2, 2]
  ],
  T: [
    [0, 3, 0],
    [3, 3, 3]
  ],
  L: [
    [4, 0, 0],
    [4, 4, 4]
  ],
  J: [
    [0, 0, 5],
    [5, 5, 5]
  ],
  S: [
    [0, 6, 6],
    [6, 6, 0]
  ],
  Z: [
    [7, 7, 0],
    [0, 7, 7]
  ]
};

let piece = null;
let pos = { x: 3, y: 0 };

function drawBoard() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x]) {
        drawBlock(x, y, board[y][x]);
      }
    }
  }
}

function drawPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) drawBlock(pos.x + x, pos.y + y, value);
    });
  });
}

function drawBlock(x, y, value) {
  context.fillStyle = getColor(value);
  context.fillRect(x * grid, y * grid, grid - 1, grid - 1);
}

function getColor(value) {
  const colors = ['#000', '#0ff', '#ff0', '#f0f', '#f90', '#00f', '#0f0', '#f00'];
  return colors[value];
}

function mergePiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) board[pos.y + y][pos.x + x] = value;
    });
  });
}

function collide() {
  return piece.shape.some((row, y) =>
    row.some((value, x) => {
      if (value && (board[pos.y + y] && board[pos.y + y][pos.x + x]) !== 0) {
        return true;
      }
      return value && (pos.y + y >= rows || pos.x + x < 0 || pos.x + x >= cols);
    })
  );
}

function rotate(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function drop() {
  pos.y++;
  if (collide()) {
    pos.y--;
    mergePiece();
    resetPiece();
    clearRows();
  }
}

function clearRows() {
  outer: for (let y = rows - 1; y >= 0; y--) {
    for (let x = 0; x < cols; x++) {
      if (!board[y][x]) continue outer;
    }
    board.splice(y, 1);
    board.unshift(Array(cols).fill(0));
  }
}

function resetPiece() {
  const keys = Object.keys(tetrominoes);
  const name = keys[Math.floor(Math.random() * keys.length)];
  piece = {
    name,
    shape: tetrominoes[name]
  };
  pos.y = 0;
  pos.x = Math.floor((cols - piece.shape[0].length) / 2);
}

function update() {
  drop();
  drawBoard();
  drawPiece();
}

resetPiece();
setInterval(update, 500);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') pos.x--;
  if (e.key === 'ArrowRight') pos.x++;
  if (e.key === 'ArrowDown') drop();
  if (e.key === 'ArrowUp') {
    piece.shape = rotate(piece.shape);
  }

  if (collide()) {
    if (e.key === 'ArrowLeft') pos.x++;
    if (e.key === 'ArrowRight') pos.x--;
    if (e.key === 'ArrowUp') piece.shape = rotate(rotate(rotate(piece.shape)));
  }
});
