function GameBoard() {
    const boardSize = 3;
    const board = [];

    //Making the gameBoard 2D Array
    for (let i = 0; i < boardSize; i++) {
        board[i] = []; //Making rows
        for (let j = 0; j < boardSize; j++) {
            board[i].push(Cell());
        }
    }

    const fillCell = (token, row, column) => {
        if (board[row][column].getValue() !== 0) { //Checking if the cell is empty
            console.log('cell already taken');
            return true; // We tell the gameflow that this is not a valid input
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

    const checkWin = () => {
        const isWinning = (a, b, c) => {
            return (a === b && a === c && a !== 0);
        }
        //The values of one row are all the same
        for (let i = 0; i < boardSize; i++) {
            if (isWinning(board[i][0].getValue(), board[i][1].getValue(), board[i][2].getValue())) {
                return true;
            }
        }
        //The values of one column are all the same
        for (let i = 0; i < boardSize; i++) {
            if (isWinning(board[0][i].getValue(), board[1][i].getValue(), board[2][i].getValue())) {
                return true;
            }
        }
        //The values of one diagonal are all the same
        if (isWinning(board[0][0].getValue(), board[1][1].getValue(), board[2][2].getValue())) {
            return true
        }
        if (isWinning(board[0][2].getValue(), board[1][1].getValue(), board[2][0].getValue())) {
            return true
        }
        return false;
    }

    const checkTie = () => {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j].getValue() === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    return { getBoard, fillCell, displayBoard, checkWin, checkTie };
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

        playAgain = board.fillCell(currentPlayer.token, row, column);

        //Check if the player inputed a valid cell
        if (playAgain) {
            printNewRound();
        } else if (board.checkWin()) {
            board.displayBoard();
            console.log(`Game over ! ${currentPlayer.name} wins !`);
        } else if (board.checkTie()) {
            board.displayBoard();
            console.log('No space left on the board. It is a tie !')
        } else {
            addTurn();
            printNewRound();
        }


    };

    //Print the initial round
    printNewRound();

    return { playRound, getCurrentPlayer };
};

const game = GameFlow();
const board = GameBoard();