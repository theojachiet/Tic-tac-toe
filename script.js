const Gameboard = (function () {
    const board = [['', '', ''],['', '', ''],['', '', '']];

    const drawBoard = () => {

    };

    const updateBoard = (Player, location) => {

    };

    return {board};
})();

const GameFlow = (function () {
    const turn = () => {
        console.log('whos turn is it ?');
    };

    const getPlayerChoice = () => {
        return {Player.type, location};
    };

    const checkGameOver = () => {
        if () return true;
        return false;
    };
})();

function createPlayer (type, first) {
    return {type, first};
}

const Cross = createPlayer('X', true);
const Circle = createPlayer('O', false);

console.log(Gameboard.board)