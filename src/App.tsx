import React from 'react';
import logo from './logo.svg';
import note from './note.svg';
import './App.css';
import Box from './Box';

function App() {

  return (<div className="App" >
    <header className="App-header" >
      <Box title="MIDI in your browser" isVerified={undefined !== navigator.requestMIDIAccess}>
      <img id="clickable"
        src={note}
        className="Note"
        alt="note"
        onClick={ (e) => { console.log((e.target as HTMLElement).classList);
          (e.target as HTMLElement).classList.toggle("Note-Selected"); } } />
      </Box>
      <img src={logo}
        className="App-logo"
        alt="logo"
         />
      <p>
        Edit 
        <code> src / App.js </code> and save to reload. </p> 
        <a className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer" >
            Learn React </a> 
            <Box title="Debug"></Box>
    </header>    
        </div>
    );
}

export default App;