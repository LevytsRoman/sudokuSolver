import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {
  public rows = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
  ];

  public boxes = [[0,0],[0,3],[0,6],[3,0],[3,3],[3,6],[6,0],[6,3],[6,6]];

solve() {
  // var board = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
    var board = this.getBoard();
    var boardArray = [];
  	var b = board.split('').map( el => parseInt(el) || 0);
  	var l = board.length;
  	for (var i=0; i < 9; i++){
  		boardArray[i] = b.splice(0, 9);
  	}
    var guessHash = {};
  	var oldPuzzleHash = {};
    var arrayOfEmpty = this.findEmpty(boardArray);
  	var le = arrayOfEmpty.length;
    var j = 0;
    while ( j < le ) {
      var index = arrayOfEmpty[j]
      var possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      var present = boardArray[index[0]].concat(this.getCol(boardArray, index[1]), this.getBox(boardArray, index[2]),  guessHash[j] || [])

      var possible = possible.filter(elem => !present.includes(elem))

      if(possible.length == 1) {

        boardArray[index[0]][index[1]] = possible[0]
  			j += 1
      } else if(possible.length > 1){
        var guess = possible[0];
        var guesses = guessHash[j] || [];
        guesses.push(guess);
        guessHash[j] = guesses;
        oldPuzzleHash[j] = boardArray.map(r => r.map(c => c))
        boardArray[index[0]][index[1]] = guess;
  			j += 1
      } else if(possible.length === 0){
        var oldKeys = Object.keys(oldPuzzleHash);
        var oldLastKey = oldKeys[oldKeys.length - 1];
        j = parseInt(oldLastKey);
        boardArray = oldPuzzleHash[oldLastKey];
        var indexOfKeyToDelete = Object.keys(guessHash).indexOf(oldLastKey) + 1;
        while(indexOfKeyToDelete < Object.keys(guessHash).length){
          delete guessHash[Object.keys(guessHash)[indexOfKeyToDelete]];
        }
        delete oldPuzzleHash[oldLastKey];
      }
    }
    this.rows = boardArray;
    // return boardArray.join('');
  }

  findEmpty(boardArray){
    	var arrayOfEmpty = []

      for(var i = 0; i < 9; i++){
    		for(var j = 0; j < 9; j++){
    			if(boardArray[i][j] === 0){
    				for(var k = 0; k < 9; k++){
    					if(i <= this.boxes[k][0] + 2 && i >= this.boxes[k][0]){
    						if(j >= this.boxes[k][1] && j <= this.boxes[k][1] + 2){
    							arrayOfEmpty.push([i, j, k])
    						}
    					}
    				}
    			}
    		}
    	}

    	return arrayOfEmpty
    }

  getCol(boardArray, j){
    	var col = [];
    	for(var i=0; i < 9; i++){
    		col.push(boardArray[i][j]);
    	}
    	return col
    }

  getBox(bA, index){
    var cords = this.boxes[index];
    var box = []
    for(var i=cords[0]; i < cords[0] + 3; i++){
    	for(var j=cords[1]; j < cords[1] + 3; j++){
    		box.push(bA[i][j]);
    	}
    }
    return box
  }

  getBoard(){
    var boardString = '';
    var cells = (<NodeListOf<HTMLInputElement>>document.querySelectorAll('.cell'));
    for(var i=0; i<81; i++){
      boardString += cells[i].value || '0';
    }
    return boardString;
  }
}
