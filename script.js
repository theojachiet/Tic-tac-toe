function GameBoard() {
    const boardSize = 3;
    const board = [];

    //Making the gameBoard 2D Array
    for (let i = 0; i < boardSize; i++) {
        board[i] = []; //Making rows
        for (let j = 0; j < boardSize; j++) {
            board[i].push(Cell()); // TODO I have to make a cell object now
        }
    }

    const fillCell = (token, row, column) => {
        if (board[column][row].getValue() !== 0) { //Checking if the cell is empty
            console.log('cell already taken');
            //Here i need to ask the same player again and not go through with the round
            return true;
        } else {
            board[row][column].addToken(token);
            return false;
        }
    };

    const getBoard = () => board;

    const displayBoard = () => {
        const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardValues);
    };

    return { getBoard, fillCell, displayBoard };
};

function Cell() {
    //Cell can be empty (0), crossed (1), or circled (2);
    let value = 0;

    const getValue = () => value;

    const addToken = (playerToken) => {
        value = playerToken;
    };

    return { getValue, addToken };
}

function GameFlow(name1 = 'player1', name2 = 'player2') {

    const board = GameBoard();

    const players = [
        {
            name: name1,
            token: 1
        },
        {
            name: name2,
            token: 2
        }
    ];

    let currentPlayer = players[0];
    let playAgain = false;

    const getCurrentPlayer = () => currentPlayer;

    const addTurn = () => {
        if (currentPlayer === players[0]) currentPlayer = players[1];
        else currentPlayer = players[0];
    };

    const printNewRound = () => {
        board.displayBoard();
        console.log(`It's ${currentPlayer.name}'s turn to play`);
    };

    const playRound = (row, column) => {

        playAgain = board.fillCell(currentPlayer.token, column, row);

        //Check if the player inputed a valid cell
        if (playAgain) {
            printNewRound();
        } 
        //TODO : check in between these two if the game is won or tied
        else {
            addTurn();
            printNewRound();
        }

        
    };

    const checkGameOver = () => {
        // Check for a winner or if the gameboard is full.
        // Implement after the rest of the game is done
    };

    printNewRound();

    return {playRound, getCurrentPlayer};
};

const game = GameFlow();