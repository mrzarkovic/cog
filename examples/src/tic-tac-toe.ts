import { variable, render } from "../../src/cog";

document.addEventListener("DOMContentLoaded", function () {
    render(document.getElementById("app")!);
});

// Initialize the game's state
const history = variable("history", [Array(9).fill("")]); // The history of the game's moves
let currentMove = 0; // The current move number
const xIsNext = () => currentMove % 2 === 0; // Function to determine if it's X's turn
const status = variable("status", "Next player: X"); // The status message
const squares = variable("squares", history.value[0]); // The current state of the game board

// Function to calculate the winner of the game
function calculateWinner(squares: string[]) {
    // All possible winning combinations
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

    // Check each winning combination
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // If all squares in a combination are filled by the same player, that player wins
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            status.set("Winner: " + squares[a]);
            return squares[a];
        }
    }

    // If all squares are filled and there's no winner, it's a draw
    if (history.value.length === 10) {
        status.set("Draw");
        return null;
    }

    // If the game is still ongoing, update the status message to indicate whose turn is next
    status.set("Next player: " + (xIsNext() ? "X" : "O"));

    return null;
}

// Function to handle a play
function handlePlay(nextSquares: string[]) {
    // Create a new history array with the current state of the game board
    const nextHistory = [
        ...history.value.slice(0, currentMove + 1),
        nextSquares,
    ];

    // Update the current move to the latest one
    currentMove = nextHistory.length - 1;

    // Update the history and squares variables with the new state
    history.set(nextHistory);
    squares.set(nextSquares);

    // Check if the game has ended
    calculateWinner(nextSquares);
}

// Function to jump to a specific move in the game's history
window.jumpTo = function (nextMove: number) {
    // Update the current move
    currentMove = nextMove;

    // Update the squares variable to the state of the game board at the specified move
    squares.set(history.value[currentMove]);

    // Update the status message to indicate whose turn is next
    status.set("Next player: " + (xIsNext() ? "X" : "O"));
};

// Function to handle a click on a square
window.handleClick = function (i: number) {
    // If the game has already ended or the clicked square is already filled, do nothing
    if (calculateWinner(squares.value) || squares.value[i]) {
        return;
    }

    // Create a copy of the current state of the game board
    const nextSquares: string[] = squares.value.slice();

    // If it's X's turn, fill the clicked square with an X; otherwise, fill it with an O
    if (xIsNext()) {
        nextSquares[i] = "X";
    } else {
        nextSquares[i] = "O";
    }

    // Handle the play with the updated state of the game board
    handlePlay(nextSquares);
};
