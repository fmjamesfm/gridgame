import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useState } from 'react';
import letterdata from './letters.json';
import dictionary from './dict.json';


let cumsum = 0;
let cumprob = Array();
const probabilities = Object.values(letterdata);
probabilities.map((p)=>cumprob.push(cumsum+=p));
const letters = Object.keys(letterdata);


// get letter frequencies for 4 letter words

let dict4 = dictionary.filter((item)=>item.length==4);
console.log(dict4.length);



function getRandomLetter(){

  let goal = Math.random() * 99.999;
  var closest = cumprob.reduce(function(prev, curr) {
    return ((goal > prev) && (goal <= curr) ? curr : prev);
  });

  let idx = cumprob.indexOf(closest);
return letters[idx];

}

function initGrid(r,c){
  let arr = [...new Array(r)].map(x=>Array(c).fill(''));
return arr;
}


function initQueue(size){

  let arr = new Array(size).fill('').map((item)=>getRandomLetter());
  return arr;

}

function checkWord(word){

  return (dictionary.includes(word))

}

function App() {
  
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [letterQueue, setLetterQueue] = useState(initQueue(cols+1));
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState(initGrid(rows, cols));

  const onCellClick = (r,c)=>{   
      
      if (!(grid[r][c] == '')) {return}

      // if cell is empty, fill with current letter

      let newgrid = grid.map((row)=>row.slice()); 
      newgrid[r][c] = letterQueue[0];
      setGrid(newgrid);
      let newQ = [...letterQueue];
      newQ.shift();
      newQ.push(getRandomLetter());
      setLetterQueue(newQ);

  }

  useEffect(()=>{

    
    // check full rows
    let cleanRows = [];
    let cleanCols = [];
    
    let newscore = 1*score;

    let newgrid = [...grid].map((row)=>row.slice());
    
    grid.map((row, idx)=> {
      if (!(row.includes(''))){
        // row is full, check word then add to clean list 
        if (checkWord(row.join(''))){
          cleanRows.push(idx);}
      }
  } );
  
  // check columns
    for (let i=0; i<cols;i++){
      let column = grid.map((row) => row[i]);
      if (!(column.includes(''))){
        // column is full, check word and add to clean list

        if (checkWord(column.join('')))
            {cleanCols.push(i);}
      }


    }

    newgrid.map((row, rown)=> {
      if (cleanRows.includes(rown)) {
        row.fill('');
        newscore+=rows;
      }
      row.map((item, coln) => {

        if (cleanCols.includes(coln)) {
          newgrid[rown][coln] = '';
          newscore+= 1.0;
        
        }
      })
    })
    
    
    setGrid(newgrid);
    setScore(newscore);
    // check full cols
  }, [letterQueue])

  return (
    <div className="app">
      <div className='app-header'>
          <div className='app-title'>Grid Game</div>
          </div>
      
      <div className='app-main-body'>
        <div className='rules' style={{textAlign: "center", padding: "10px"}}><p>Click on the grid to add the next letter in the queue.</p><p> Make four letter words horizontally (left to right) or vertically (top to bottom) to score points.</p></div>
        
      <div className='tetris-container'>
      <div className='letter-queue' style={{gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `1fr 1fr`}}>{letterQueue.map((item, idx) => <div  className={`letter-queue-item ${(idx==0) ? "letter-queue-item-first": ''}`} key={idx}>{item}</div>)}</div>  
          <div className='tetris-grid' style={{gridTemplateColumns: `repeat(${cols}, 1fr)`}}>
          {grid.map((row, rown)=> row.map((col, coln)=><div className='grid-cell' onClick={()=>onCellClick(rown, coln)} key={`${rown}${coln}`}> {col} </div>))}
          
          </div>
                 
      </div>
      <div className='score-display'>{score}</div>
          </div> 
    </div>
  );
}

export default App;
