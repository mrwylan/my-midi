import React, { useState } from 'react';
import logo from './logo.svg';
import note from './note.svg';
import './App.css';
import Box from './Box';
import WebMidi, {Input, Output, InputEventNoteon, IEventNote} from 'webmidi';

type AppState = {
  midiIn: Input[],
  midiOut: Output[],
  noteOn: InputEventNoteon | null
}

function App() {

  const printerify = (note : IEventNote | null | undefined) => (note && note != null)?"#"+note.number + " " + note.name + note.octave:"" ;
  const initialState : AppState= {
    midiIn: [],
    midiOut: [],
    noteOn: null
  };

  const [ourState, ourSetState] = useState(initialState);
  const { midiIn, midiOut } = ourState;
  const noteOnListener = (e : InputEventNoteon) => { ourSetState({ ...ourState, noteOn: e})};

  WebMidi.enable(function (err) {

    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
      console.log(WebMidi.inputs);
      console.log(WebMidi.outputs);
      ourSetState({ ...ourState, midiIn: WebMidi.inputs, midiOut: WebMidi.outputs});
    }
    
  });


  return (<div className="App" >
    
    <header className="App-header" >
      <Box title="MIDI in your browser" isVerified={undefined !== navigator.requestMIDIAccess}>

        { Array.from(midiIn.values(), (value, key) => {
           const name : string = value.name;
           return       <div key={key + "x" + value.id} className="tooltip"><img id={value.id}
           src={note}
           className="Note"
           alt="note"
           onClick={ (e) => { console.log((e.target as HTMLElement).classList);
             (e.target as HTMLElement).classList.toggle("Note-Selected"); 
             var input = WebMidi.getInputByName(name) as Input;
             if(!input.hasListener("noteon","all", noteOnListener)) 
               input.addListener("noteon", "all", noteOnListener )
             else 
               input.removeListener("noteon","all", undefined);
             
             } } /><span className="tooltiptext">{name}</span></div>
         })}

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
        
    </header>
    <main>
      </main>
      <footer>
      <Box title="Debug">
        <p><small>{ourState.noteOn? "[" + ourState.noteOn.channel + "] " + printerify(ourState.noteOn?.note):null}</small></p>
      </Box>
      </footer>
        </div>
    );
}

export default App;