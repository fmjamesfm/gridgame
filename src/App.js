import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useState } from 'react';
import txt from './lang.json';

import Database from './dicts.js';

const languages = Object.keys(Database);

function getRandomLetter(lang){
  let cumprob = Object.values(Database[lang]["freqs"]);

  let letters = Object.keys(Database[lang]["freqs"]);
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


function initQueue(size, lang){
  let arr = new Array(size).fill('').map((item)=>getRandomLetter(lang));
  return arr;
}

function checkWord(word, lang){

  return (Database[lang]["words"].includes(word))

}

function LangMenu(props){

const [isOpen, setIsOpen] = useState(false);

const expand = () =>{
  setIsOpen(true);
} 
const onClick = () => {

  if (!isOpen){expand()};

}

const close = () =>{
  setIsOpen(false);
} 

function select(event) {
  const value = event.target.textContent;
  props.onChange(value);
  close();
}

return(
<div className='lang-menu' tabIndex={1} onFocus={expand} onClick={onClick} onBlur={close}>
              {(!isOpen) ? <div className='lang-menu-item'>{props.value}</div>: null}
              {(props.options.map((lang)=> (isOpen) ? <div className="lang-menu-item" key={lang} onClick={select}>{lang}</div> : null))}
        </div>
)
}

function App() {
  const [language, setLanguage] = useState(
    () => {
      // getting stored value
      const pathname = window.location.pathname.replace('/','')

      if (languages.includes(pathname)) {
          return pathname;
      } 


      const saved = localStorage.getItem("language");
      const initialValue = saved;
      return initialValue || "en";
    }
    );
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [letterQueue, setLetterQueue] = useState([]);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState(initGrid(rows, cols));
  const [gameEnd, setGameEnd] = useState(false);

  const onCellClick = (r,c)=>{   
      
      if (!(grid[r][c] == '')) {return}
      // if cell is empty, fill with current letter
      let newgrid = grid.map((row)=>row.slice()); 
      newgrid[r][c] = letterQueue[0];
      setGrid(newgrid);
      let newQ = [...letterQueue];
      newQ.shift();
      newQ.push(getRandomLetter(language));
      setLetterQueue(newQ);
  }

  const restart = ()=>{

      setLetterQueue(initQueue(cols+1, language));
      setGrid(initGrid(rows, cols));
      setGameEnd(false);
      setScore(0);

    };

  useEffect(()=>{
    // check full rows
    let cleanRows = [];
    let cleanCols = [];
    let newscore = 1*score;
    let newgrid = [...grid].map((row)=>row.slice());
    
    grid.map((row, idx)=> {
      if (!(row.includes(''))){
        // row is full, check word then add to clean list 
        if (checkWord(row.join(''), language)){
          cleanRows.push(idx);}
      }
  } );
  
  // check columns
    for (let i=0; i<cols;i++){
      let column = grid.map((row) => row[i]);
      if (!(column.includes(''))){
        // column is full, check word and add to clean list
        if (checkWord(column.join(''), language))
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
    
    let isFull = true;
    
    newgrid.map((row)=>
    
    {if (row.includes('')) {isFull=false}}
    );

    if (isFull){
      setGameEnd(true);
    }

    // check full cols
  }, [letterQueue])

  useEffect(() => {
    localStorage.setItem('language', language);
    restart();
}, [language]);

  return (
    <div className="app">
      <div className='app-header'>
        <LangMenu value={language} options={languages} onChange={setLanguage}></LangMenu>
          <div className='app-title'>Grid Game</div>
          </div>
      
      <div className='app-main-body'>
        <div className='rules' style={{textAlign: "center", padding: "10px"}}><p>{txt[language].p1}</p><p>{txt[language].p2}</p></div>
        
      <div className='tetris-container'>
      <div className='letter-queue' style={{gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `1fr 1fr`}}>{letterQueue.map((item, idx) => <div  className={`letter-queue-item ${(idx==0) ? "letter-queue-item-first": ''}`} key={idx}>{item}</div>)}</div>  
          <div className='tetris-grid' style={{gridTemplateColumns: `repeat(${cols}, 1fr)`}}>
          {grid.map((row, rown)=> row.map((col, coln)=><div className='grid-cell' onClick={()=>onCellClick(rown, coln)} key={`${rown}${coln}`}> {col} </div>))}
          </div>
          {gameEnd ? <><div className='game-end-text'>And that's it.</div><div className='restart-button' onClick={restart}>Restart</div></> : null}
      </div>
      <div className='score-display'>{score}</div>
          </div> 
    </div>
  );
}

export default App;
