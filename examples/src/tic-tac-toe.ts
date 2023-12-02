import { variable } from "../../src/cog";

const history = variable("history", [Array(9).fill("")]);
const currentMove = variable("currentMove", 0);
const xIsNext = () => currentMove.value % 2 === 0;
const status = variable("status", "Next player: " + (xIsNext() ? "X" : "O"));
const squares = variable("squares", history.value[currentMove.value]);

function calculateWinner(squares: string[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            status.set("Winner: " + squares[a]);
            return squares[a];
        }
    }

    return null;
}

function handlePlay(nextSquares: string[]) {
    const nextHistory = [
        ...history.value.slice(0, currentMove.value + 1),
        nextSquares,
    ];

    history.set(nextHistory);
    const nextMove = nextHistory.length - 1;
    currentMove.set(nextMove);

    const xIsNext = nextMove % 2 === 0;

    status.set("Next player: " + (xIsNext ? "X" : "O"));
    squares.set(nextHistory[nextMove]);

    console.log(history.value, squares.value[0]);
}

window.jumpTo = function (nextMove: number) {
    currentMove.set(nextMove);
};

window.handleClick = function (i: number) {
    const currentSquares = squares.value;
    if (calculateWinner(currentSquares) || currentSquares[i]) {
        return;
    }

    const nextSquares: string[] = currentSquares.slice();

    if (xIsNext()) {
        nextSquares[i] = "X";
    } else {
        nextSquares[i] = "O";
    }

    handlePlay(nextSquares);
};
