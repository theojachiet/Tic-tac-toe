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
    const setCell = (x, y, token) => {
        board[x][y].addToken(token);
    };

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

    return {
        getBoard,
        fillCell,
        displayBoard,
        checkWin,
        checkTie,
        setCell
    };
};

function Cell() {
    //Cell can be empty (0), crossed (1), or circled (2);
    let value = 0;

    const getValue = () => value;
    const setValue = (newValue) => {
        value = newValue;
    };

    const addToken = (playerToken) => {
        value = playerToken;
    };

    return { getValue, addToken, setValue };
}

function GameFlow(name1 = '2', name2 = '1') {

    const board = GameBoard();
    let situation = 0;

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
    const getSituation = () => situation;

    const setSituation = (state) => {
        situation = state;
    };
    const setCurrentPlayer = (player) => {
        currentPlayer = player;
    }

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
            situation = 1;
            console.log(`Game over ! ${currentPlayer.name} wins !`);
        } else if (board.checkTie()) {
            situation = 2;
            board.displayBoard();
            console.log('No space left on the board. It is a tie !')
        } else {
            //Default
            addTurn();
            printNewRound();
        }


    };

    //Print the initial round
    printNewRound();

    return {
        playRound,
        getCurrentPlayer,
        getBoard: board.getBoard,
        getSituation,
        setSituation,
        setCurrentPlayer,
        player1: players[0].name,
        player2: players[1].name
    };
}

function ScreenController() {
    const game = GameFlow(PlayerState.getplayer1Name(), PlayerState.getplayer2Name());
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const reset = document.querySelector('.reset');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer().name;
        const situation = game.getSituation();

        if (situation === 0) {
            playerTurnDiv.textContent = `${currentPlayer}'s Turn !`;
        } else if (situation === 1) {
            playerTurnDiv.textContent = `Game over ! ${currentPlayer} wins !`;
        } else if (situation === 2) {
            playerTurnDiv.textContent = 'No space left on the board. It is a tie !';
        }

        board.forEach((row, indexRow) => {
            row.forEach((cell, indexCol) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.column = indexCol;
                cellButton.dataset.row = indexRow;

                if (cell.getValue() === 2) {
                    cellButton.textContent = 'O';
                    cellButton.style.color = 'rgb(100, 180, 100)';
                } else if (cell.getValue() === 1) {
                    cellButton.textContent = 'X';
                    cellButton.style.color = 'rgb(220, 100, 100)';
                } else {
                    cellButton.textContent = '';
                }
                boardDiv.appendChild(cellButton);
            })
        })
    };

    function eventHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;

        game.playRound(selectedRow, selectedCol);
        updateScreen();
    }
    boardDiv.addEventListener('click', eventHandler);
    reset.addEventListener('click', resetGame);

    //Initial render
    updateScreen();
}

function DialogStarter() {
    const dialog = document.querySelector('dialog');
    const confirmButton = document.querySelector('.submit');

    dialog.showModal();

    confirmButton.addEventListener('click', (event) => {
        const name1 = document.querySelector('#player1-name').value;
        const name2 = document.querySelector('#player2-name').value;

        PlayerState.setNames(name1, name2);
        ScreenController();
        event.preventDefault();
        dialog.close();
    });
}

function resetGame() {
    const board = GameBoard();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board.setCell(i, j, 0);
        }
    }
    ScreenController();
}

const PlayerState = (function () {
    let player1 = 'Player 1';
    let player2 = 'Player 2';

    const setNames = (name1, name2) => {
        player1 = name1;
        player2 = name2;
    };

    const getplayer1Name = () => player1;
    const getplayer2Name = () => player2;

    return {
        getplayer1Name,
        getplayer2Name,
        setNames
    }

})();

DialogStarter();