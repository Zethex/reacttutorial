import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      // Dynamically create the board with squares.
      let boardRows = [];
      for (let i = 0; i < 3; i++) {
        let boardRow = [];
        for (let j = 0; j < 3; j++) {
          boardRow.push(this.renderSquare(i * 3 + j));
        }
        boardRows.push(<div className="board-row">{boardRow}</div>);
      }

      return (
        <div>
          {boardRows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            location: "Game Started."
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        isAscending: true
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";

      // Store the co-ordinates of the clicked location in a human friendly format (+1).
      const x = Math.floor(i / 3) + 1;
      const y = (i % 3) + 1;
      const clickLocation = squares[i] + ' moved to ('+ x + ',' + y + ')';

      this.setState({
        history: history.concat([
          {
            squares: squares,
            location: clickLocation
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    reverseSort() {
      this.setState({
        isAscending: !this.state.isAscending
      });
    }
  
    render() {
      let history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      // Reverse the history list on user input.
      if (!this.state.isAscending) {
        history = this.state.history.slice();
        history.reverse();
      }

      const moves = history.map((step, move) => {
        const desc = step.location;
        const activeStep = this.state.isAscending ? this.state.stepNumber : (this.state.history.length - 1) - this.state.stepNumber;

        // Bold if this is the active step.
        if (move == activeStep) {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>
            </li>
          );
        } else {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><button onClick={() => this.reverseSort()}>Change History Order</button></div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  