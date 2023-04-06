import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component {
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         value:null,
    //     };
    // }

    render() {
      if(winSquareIndex && (this.props.index === winSquareIndex[0] || this.props.index === winSquareIndex[1] || this.props.index === winSquareIndex[2])){
        return (
          <button className="square" style={{backgroundColor:'yellow'}} onClick={()=>this.props.onClick()}>
            {this.props.value}
          </button>
        );
      }else{
        return (
          <button className="square" onClick={()=>this.props.onClick()}>
            {this.props.value}
          </button>
        );
      }
     
    }
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square index={i} value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}/>
    }

    // handleClick(i){
    //     const squares = this.state.squares.slice();
    //     squares[i] = this.state.xIsNext? 'x' : 'o';
    //     this.setState({squares:squares,xIsNext:!this.state.xIsNext,});
    // }

    // constructor(props){
    //     super(props);
    //     this.state={
    //         squares:Array(9).fill(null),
    //         xIsNext:true,
    //     }
    // }

    render() {
      // let status;
      // const winner = calculateWinner(this.state.squares);
      // if(winner){
      //   status = 'Winner:'+winner;
      // }else{
      //   status = 'Next player: '+(this.state.xIsNext ? 'X':'o');
      // }
      // return (
      //   <div>
      //     {/* <div className="status">{status}</div> */}
      //     <div className="board-row">
      //       {this.renderSquare(0)}
      //       {this.renderSquare(1)}
      //       {this.renderSquare(2)}
      //     </div>
      //     <div className="board-row">
      //       {this.renderSquare(3)}
      //       {this.renderSquare(4)}
      //       {this.renderSquare(5)}
      //     </div>
      //     <div className="board-row">
      //       {this.renderSquare(6)}
      //       {this.renderSquare(7)}
      //       {this.renderSquare(8)}
      //     </div>
      //   </div>
      // );


      return(<div>{this.renderRows()}</div>);
        
    }

    renderRows(){
      let rows=[];
      for(let i=0; i<3; i++){
        rows.push(
          <div className="board-row">
            {this.renderCols(i)}
          </div>    
        );
      }
      return rows;  
    }

    renderCols(rowIndex){
      let cols=[];
      for(let i=0; i<3; i++){
        cols.push(
          this.renderSquare(rowIndex*3+i)
        );
      }
      return cols;
    }
    
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history : [{squares:Array(9).fill(null),lastSquareIndex:-1}],
        stepNumber:0,
        xIsNext:true,
        aesdes:'降序',
      }
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const overGame = calculateOverGame(current.squares);


      const moves = history.map((step,move)=>{
        let desc = move? 'Go to move #'+move + '('+(step.lastSquareIndex%3+1)+'列,'+(parseInt(step.lastSquareIndex/3)+1)+'行)'
        : 'Go to game start';

        desc = move + '、'+ desc;

        if(this.state.stepNumber === move){
          return (
            <li>
              <button style={{ fontWeight: 'bold' }} onClick={()=>this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }else{
          return (
            <li>
              <button onClick={()=>this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
       
      });

      if(this.state.aesdes === '升序'){
        moves.reverse();
      }

      let status;
      if(winner){
        status = 'Winner:'+winner;
      }else if(overGame){
        status = 'tie game';
      }else{
        status = 'Next player:'+(this.state.xIsNext ? 'x':'o');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i)=>this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><button onClick={()=>this.funAesdes()}>{this.state.aesdes}</button></div>
            <ul>{moves}</ul>
          </div>
        </div>
      );
    }
    funAesdes(){
      let aesdes = this.state.aesdes;
      if(aesdes==='升序'){
        aesdes ='降序'
      }else{
        aesdes ='升序'
      }
      this.setState({
        aesdes:aesdes,
      })
    }
    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber+1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]){
        return;
      }

      squares[i] = this.state.xIsNext? 'x' : 'o';
      this.setState({
        history:history.concat([{squares:squares,lastSquareIndex:i}]),
        xIsNext:!this.state.xIsNext,
        stepNumber:history.length,
      });
    }

    jumpTo(step){
      this.setState({
        stepNumber:step,
        xIsNext: (step % 2) === 0,
      });
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);


  function calculateWinner(squares) {
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        winSquareIndex = [a,b,c];
        return squares[a];
      }else{
        winSquareIndex = null;
      }
    }
    return null;
  }


  function calculateOverGame(squares){
    let fullIndex = 0;
    for(let i=0;i<squares.length;i++){
      if(squares[i]){
        fullIndex++;
      }
    }
    return fullIndex===9;
  }

  
  var winSquareIndex = null;
  