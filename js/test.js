'use strict';

//note: due to time constraints I am not putting a lot of effort into the test file
//rather showcasing a few token tests as an example of unit testing

console.log('Test file is up and running!');

console.group('Tests Run');

console.groupCollapsed('Test 1 - init game');
//Test 1 - checking that initGame() sets the isGameOn currectly
initGame();
console.log('Checking correct assignment of game on boolean, expecting true');
console.log('variable current state is:', gState.isGameOn);
console.assert(gState.isGameOn === true, 'expected true on variable');
console.groupEnd();


//Test 2 - checking that buildBoard() produces a matrix of objects in the rightSize;
console.groupCollapsed('Test2: buildBoard() matrix creation');
var testBoard = buildBoard(4, 8);
console.log('The board is:', testBoard);
console.table(testBoard);
console.assert(testBoard.length === 4 && testBoard[0].length === 4, 'Expecting a 4*4 matrix');
console.groupEnd();

//Test 3 - test for correct creation of mines in the board
console.groupCollapsed('Test3: buildBoard() mines creation');
console.assert(false, 'Not working yet');
console.groupEnd();


console.groupEnd();
