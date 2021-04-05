//DOM Elements
const allCells = document.querySelectorAll('.cell:not(.row-top)');  //grabs all of the cells that's not the top 7 cells
const topCells = document.querySelectorAll('.cell.row-top');        //Top cells 
const resetButton = document.querySelector('.reset');               //reset button to reset the game
const statusSpan = document.querySelector('.status');               //Top Span status

//variables for game
let gameIsLive = true; //boolean tells us whether game is on or not on = true
let yellowIsNext = true; //if true, yellows turn, if not reds turn

//column arrays filled from buttom up so we can fill the bottoms first
const column0 = [allCells[35], allCells[28], allCells[21], allCells[14], allCells[7], allCells[0], topCells[0]]; 
const column1 = [allCells[36], allCells[29], allCells[22], allCells[15], allCells[8], allCells[1], topCells[1]];
const column2 = [allCells[37], allCells[30], allCells[23], allCells[16], allCells[9], allCells[2], topCells[2]];
const column3 = [allCells[38], allCells[31], allCells[24], allCells[17], allCells[10], allCells[3], topCells[3]];
const column4 = [allCells[39], allCells[32], allCells[25], allCells[18], allCells[11], allCells[4], topCells[4]];
const column5 = [allCells[40], allCells[33], allCells[26], allCells[19], allCells[12], allCells[5], topCells[5]];
const column6 = [allCells[41], allCells[34], allCells[27], allCells[20], allCells[13], allCells[6], topCells[6]];
const columns = [column0, column1, column2, column3, column4, column5, column6];


//row arrays
const topRow = [topCells[0], topCells[1], topCells[2], topCells[3], topCells[4], topCells[5], topCells[6]];
const row0 = [allCells[0], allCells[1], allCells[2], allCells[3], allCells[4], allCells[5], allCells[6]];
const row1 = [allCells[7], allCells[8], allCells[9], allCells[10], allCells[11], allCells[12], allCells[13]];
const row2 = [allCells[14], allCells[15], allCells[16], allCells[17], allCells[18], allCells[19], allCells[20]];
const row3 = [allCells[21], allCells[22], allCells[23], allCells[24], allCells[25], allCells[26], allCells[27]];
const row4 = [allCells[28], allCells[29], allCells[30], allCells[31], allCells[32], allCells[33], allCells[34]];
const row5 = [allCells[35], allCells[36], allCells[37], allCells[38], allCells[39], allCells[40], allCells[41]];
const rows = [row0, row1, row2, row3, row4, row5, topRow];

//Functions
const getClassListArray = (cell) => 
{
    const classList = cell.classList;
    return [...classList];
};

const getCellLocation = (cell) =>
{
    const classList = getClassListArray(cell); //Made an array so we can invoke array methods on it!

    const rowClass = classList.find(className => className.includes('row')); //Loops through classList array and gives us back the class name that has the row string inside its class name. If none of the elements have the row class, it gives null.
    const colClass = classList.find(className => className.includes('col')); 
    // console.log(rowClass, colClass);

    const rowIndex = rowClass[4]; 
    const colIndex = colClass[4]; 
    // console.log(rowIndex, colIndex); //Why is the top row t? 
    const rowNumber = parseInt(rowIndex, 10); //converts to number of base 10
    const colNumber = parseInt(colIndex, 10);
    // console.log(rowNumber, colNumber); //top row is Not a number now. Now we can check if it's a valid number or not.

    // return [rowIndex, colIndex];
    return [rowNumber, colNumber]; //array with two elements, row and col number
};

const getFirstOpenCellForCol = (colIndex) => 
{
    const column = columns[colIndex];//looks through columns array and gives us the column we want based on the column index
    const columnWithoutTop = column.slice(0, 6);//slices out the top row of the columns
    // console.log(columnWithoutTop);

    for (const cell of columnWithoutTop)
    {
        const classList = getClassListArray(cell);//get class list of cell we're iterating over
        if(!classList.includes('yellow') && !classList.includes('red'))//checks to see if we do not have yellow and have red
        {
            return cell;
        }
    }
    return null; //if it's null you're dealing with a column that doesn't have any openings. Makes it a falsey value?
};

const clearColorFromTop = (colIndex) => //clears the color from the top of the board when a tile is placed so that the next players color can appear
{
    const topCell = topCells[colIndex];
    topCell.classList.remove('yellow');
    topCell.classList.remove('red');
};

const getColorOfCell = (cell) => 
{
    const classList = getClassListArray(cell);
    if (classList.includes('yellow')) return 'yellow';
    if (classList.includes('red')) return 'red';
    return null;
};

const checkWinningCells = (cells) =>
{
    const winningPlayer = (yellowIsNext ? 'yellow' : 'red');
    if(cells.length < 4) return false;

    gameIsLive = false;
    for (const cell of cells)
    {
        cell.classList.add('win');
    }
    // statusSpan.textContent = '${yellowIsNext} ? 'Yellow' : 'Red' + 'has won!'; //Giving me a type error or syntax error
    statusSpan.textContent = winningPlayer + ' has won!';
    return true; //we have a winner!
// if (cells.length >= 4)
// {
//     gameIsLive = false;
//     for (const cell of cells)
//     {
//         cell.classList.add('win');
//     }
// }
};

const checkStatusOfGame = (cell) => {
    const color = getColorOfCell(cell);
    if (!color) return;
    const [rowIndex, colIndex] = getCellLocation(cell);
  
    // Check horizontally
    let winningCells = [cell];
    let rowToCheck = rowIndex;
    let colToCheck = colIndex - 1;
    while (colToCheck >= 0) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        colToCheck--;
      } else {
        break;
      }
    }
    colToCheck = colIndex + 1;
    while (colToCheck <= 6) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        colToCheck++;
      } else {
        break;
      }
    }
    let isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return;
  
  
    // Check vertically
    winningCells = [cell];
    rowToCheck = rowIndex - 1;
    colToCheck = colIndex;
    while (rowToCheck >= 0) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck--;
      } else {
        break;
      }
    }
    rowToCheck = rowIndex + 1;
    while (rowToCheck <= 5) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck++;
      } else {
        break;
      }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return;
  
  
    // Check diagonally /
    winningCells = [cell];
    rowToCheck = rowIndex + 1;
    colToCheck = colIndex - 1;
    while (colToCheck >= 0 && rowToCheck <= 5) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck++;
        colToCheck--;
      } else {
        break;
      }
    }
    rowToCheck = rowIndex - 1;
    colToCheck = colIndex + 1;
    while (colToCheck <= 6 && rowToCheck >= 0) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck--;
        colToCheck++;
      } else {
        break;
      }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return;
  
  
    // Check diagonally \
    winningCells = [cell];
    rowToCheck = rowIndex - 1;
    colToCheck = colIndex - 1;
    while (colToCheck >= 0 && rowToCheck >= 0) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck--;
        colToCheck--;
      } else {
        break;
      }
    }
    rowToCheck = rowIndex + 1;
    colToCheck = colIndex + 1;
    while (colToCheck <= 6 && rowToCheck <= 5) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck++;
        colToCheck++;
      } else {
        break;
      }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return;
  
    // Check to see if we have a tie
    const rowsWithoutTop = rows.slice(0, 6);
    for (const row of rowsWithoutTop) {
      for (const cell of row) {
        const classList = getClassListArray(cell);
        if (!classList.includes('yellow') && !classList.includes('red')) {
          return;
        }
      }
    }
  
    gameIsLive = false;
    statusSpan.textContent = "Game is a tie!";
  };

//event handlers
const handleCellMouseOver = (e) => 
{
    if(!gameIsLive) return; //doesn't show a tile at the top if the game is not live.
    // console.log(e); //gives some information over mouse events
    const cell = e.target;
    // console.log(cell);
    // const classList = cell.classList;
    // console.log(classList); //DOMTokenList looks like array. We can turn it into an array to work with later
    // console.log(Array.isArray(classList));
    // console.log([...classList]); //can we extract the class list and making it into an array?
    // const classList = getClassListArray(cell);
    // console.log(classList); //Making sure we're in the right track.
    // const output = getCellLocation(cell);
    // console.log(output);//It's an array now!
    const [rowIndex, colIndex] = getCellLocation(cell); //destructuring 
    // console.log(rowIndex, colIndex); 
    //Trying to use col index to grab the top row cell for the puck to show on mouse over
    const topCell = topCells[colIndex];
    topCell.classList.add(yellowIsNext ? 'yellow' : 'red'); //shorthand of if else below. Much simpler and less code.

    // if (yellowIsNext === true)
    // {
    //     topCell.classList.add('yellow');
    // }
    // else
    // {
    //     topCell.classList.add('red'); 
    // }
};

const handleCellMouseOut = (e) => 
{
    const cell = e.target;
    const [rowIndex, colIndex] = getCellLocation(cell);

    const topCell = topCells[colIndex];
    // topCell.classList.remove('yellow'); //removes yellow if it exists. 
    // topCell.classList.remove('red');    //removes red if it exists. 
    clearColorFromTop(colIndex);
};

const handleCellClick = (e) =>
{
    if (!gameIsLive) return; //doesn't allow you to click if the game is over.
    const cell = e.target;
    const [rowIndex, colIndex] = getCellLocation(cell);
    const openCell = getFirstOpenCellForCol(colIndex);
    // console.log(openCell); //This is not showing me a cell. forgot to add event listener...
    if (!openCell) return; //becomes true if return null (no open cells)
    
    openCell.classList.add(yellowIsNext ? 'yellow' : 'red');
    checkStatusOfGame(openCell);//Make sure to check the status of the game. Did this move result in the winner?

    yellowIsNext = !yellowIsNext;
    clearColorFromTop(colIndex); 

    if (gameIsLive)
    {
    const topCell = topCells[colIndex];
    topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
    }
};

//event listeners
for (const row of rows)
{
    // console.log(row);
    for (const cell of row)
    {
        // console.log(cell);
        cell.addEventListener('mouseover', handleCellMouseOver);
        cell.addEventListener('mouseout', handleCellMouseOut);
        cell.addEventListener('click', handleCellClick);
    }
};


resetButton.addEventListener('click', () => 
{
    for (const row of rows)
    {
        for (const cell of row)
        {
            cell.classList.remove('red');
            cell.classList.remove('yellow');
            cell.classList.remove('win');
        }
    }
    gameIsLive = true;
    yellowIsNext = true;
    statusSpan.textContent = '';
});