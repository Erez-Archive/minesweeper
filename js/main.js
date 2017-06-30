'use strict';
console.log('Game page is loading!');

var gBoard;
var gElBoard;
var gElStatusPanel;
var gElTimer;
var gLevel = { sideLength: 4, mines: 2 }; //default start
var gState = {};
var gInterval;

function initGame() {
    console.log('Initializing game!');
    gElBoard = document.querySelector('.game-board');
    gElStatusPanel = document.querySelector('.status-panel');
    gElTimer = document.querySelector('.timer');
    // console.log('gLevel variable:', gLevel);
    gBoard = buildBoard(gLevel.sideLength);
    gBoard = setBoardBombs(gBoard, gLevel.mines);
    gBoard = setMinesNegsCount(gBoard);
    // console.log('built board:', gBoard);
    renderBoard(gBoard, gElBoard);
    gState.isGameOn = false;
    gState.shownCount = 0;
    gState.markedCount = 0;
    gState.secsPassed = 0;
    gLevel.emptyCells = Math.pow(+gLevel.sideLength, 2) - (gLevel.mines);
    // console.log('gState variable:', gState);
    // runGame(); //later on may change so that it triggers from user click
    gState.isGameOn = true;
    gInterval = setInterval(function () {
        gElTimer.innerText = 'elapsed time: ' + gState.secsPassed;
        gState.secsPassed++;
        // console.log(gState.secsPassed);
    }, 1000);
    gElStatusPanel.innerText = 'Playing Game!!!';
}

function buildBoard(boardSideLength) {
    var board = [];
    for (var i = 0; i < boardSideLength; i++) {
        var row = [];
        for (var j = 0; j < boardSideLength; j++) {
            var cell = {
                id: i + '-' + j,
                isMine: 0,
                negs: 0,
                state: 'H'
            };
            row.push(cell);
        }
        board.push(row);
    }
    return board;
}

function setBoardBombs(board, minesNum) {
    var minesCount = 0;
    while (minesCount < minesNum) { //likely there is a better way. Try refactoring later
        var randI = getRandomInt(0, board.length);
        var randJ = getRandomInt(0, board.length);
        var currCell = board[randI][randJ];
        if (!currCell.isMine) {
            currCell.isMine = '1'
            minesCount++;
        }
    }
    return board;
}

function setMinesNegsCount(board) {
    board.forEach(function (row, i) {
        row.forEach(function (cell, j) {
            cell.negs = countNegs(board, i, j);
        });
    });
    return board;
}

function countNegs(board, cellI, cellJ) {
    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (i < 0 || i >= board.length) continue;
            if (j < 0 || j >= board[0].length) continue;
            var cell = board[i][j];
            if (cell.isMine) {
                negsCount++;
            }
        }
    }
    return negsCount;
}

function renderBoard(board, elBoard) {
    var strHTML = '';
    board.forEach(function (row, i) {
        strHTML += '<tr>';
        row.forEach(function (cell, j) {
            switch (cell.state) {
                case 'R':
                    strHTML += '<td id = "' + i + '-' + j +
                        '" class = "revealed" onclick = "cellClicked(this)" onmousedown = "rightCellClicked(event, this)">' + ('' + cell.negs).replace('0', '') + '</td>';
                    break;
                case 'M':
                    strHTML += '<td id = "' + i + '-' + j +
                        '" class = "revealed" onclick = "cellClicked(this)" onmousedown = "rightCellClicked(event, this)"> &#x1f4a3 </td>';
                    break;
                case 'EM':
                    strHTML += '<td id = "' + i + '-' + j +
                        '" class = "revealed exploded" onclick = "cellClicked(this)" onmousedown = "rightCellClicked(event, this)"> &#x1f4a3 </td>';
                    break;
                case 'F':
                    strHTML += '<td id = "' + i + '-' + j +
                        '" class = "flagged" onclick = "cellClicked(this)" onmousedown = "rightCellClicked(event, this)"> &#9971 </td>';
                    break;
                default:
                    strHTML += '<td id = "' + i + '-' + j +
                        '" class = "hidden" onclick = "cellClicked(this)" onmousedown = "rightCellClicked(event, this)">  </td>';
                    break;
            }
        });
        strHTML += '</tr>'
    });
    // console.log('str html:', strHTML);
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell) { //seems function must touch the globals so I'm not sending anything except 'this'
    // console.log('elCell:', elCell);
    if (!gState.isGameOn) return;
    var cellCoords = getCellCoord(elCell.id);
    var currCell = gBoard[cellCoords.i][cellCoords.j];
    if (currCell.state === 'H') {
        if (currCell.isMine) {
            checkGameOver(true);
            currCell.state = 'EM';
            renderBoard(gBoard, gElBoard);
        } else {
            expandShown(gBoard, cellCoords.i, cellCoords.j);
            checkGameOver(false);
            renderBoard(gBoard, gElBoard);
        }
    }
}

function rightCellClicked(event, elCell) { //same as cellClicked
    if (!gState.isGameOn || event.button !== 2) return;

    var cellCoords = getCellCoord(elCell.id);
    var currCell = gBoard[cellCoords.i][cellCoords.j];

    if (currCell.state === 'F') {
        currCell.state = 'H';
        gState.markedCount--;
        renderBoard(gBoard, gElBoard);
    } else if (currCell.state === 'H') {
        currCell.state = 'F';
        gState.markedCount++;
        checkGameOver(false);
        renderBoard(gBoard, gElBoard);
    }
}

function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(0, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    // console.log('coord', coord);
    return coord;
}

function buttonClicked(elButton) {
    // console.log('button Clicked!');
    clearInterval(gInterval);
    switch (elButton.innerText) {
        case 'Restart game':
            initGame();
            break;
        case 'Beginner':
            gLevel.sideLength = 4;
            gLevel.mines = 2;
            initGame();
            break;
        case 'Pro':
            gLevel.sideLength = 6;
            gLevel.mines = 5;
            initGame();
            break;
        case 'Expert':
            gLevel.sideLength = 8;
            gLevel.mines = 15;
            initGame();
    }
}

function expandShown(board, cellI, cellJ) {
    if (board[cellI][cellJ].isMine || board[cellI][cellJ].state === 'F' || board[cellI][cellJ].state === 'R') return;
    board[cellI][cellJ].state = 'R';
    gState.shownCount++;
    if (board[cellI][cellJ].negs > 0) return;

    var minI = Math.max(0, cellI - 1);
    var maxI = Math.min(cellI + 1, board.length - 1);
    var minJ = Math.max(0, cellJ - 1);
    var maxJ = Math.min(cellJ + 1, board.length - 1);
    for (var i = minI; i <= maxI; i++) {
        for (var j = minJ; j <= maxJ; j++) {
            if (i === cellI && j === cellJ) continue;
            expandShown(board, i, j);
        }
    }
}

function checkGameOver(shouldKillGame) {
    if (shouldKillGame) {
        gState.isGameOn = false;
        clearInterval(gInterval);
        gElStatusPanel.innerText = 'CAAAAABBBBBOOOOOOOOOOOOM! You are dead!';
        showMines(gBoard);
    } else {
        if (gState.shownCount === gLevel.emptyCells && gState.markedCount === gLevel.mines) {
            gState.isGameOn = false;
            gElStatusPanel.innerText = 'Congratulations! You win! Restart game if you wish!';
            clearInterval(gInterval);
        }
    }
}

function showMines(board) {
    board.forEach(function (row) {
        row.forEach(function (cell) {
            if (cell.isMine) cell.state = 'M';
        })
    })
}