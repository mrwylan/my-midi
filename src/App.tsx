import React, { useState } from 'react';
import logo from './logo.svg';
import note from './note.svg';
import './App.css';
import Box from './Box';
import WebMidi, {Input, Output, InputEventNoteon, IEventNote} from 'webmidi';
import { ChannelNote, ChannelScale, SemitoneSteps } from './ChannelBox';

type AppState = {
  midiIn: Input[],
  midiOut: Output[],
  noteOn: InputEventNoteon | null,
  output: Output | null
}

function App() {

  const printerify = (note : IEventNote | null | undefined) => (note && note != null)?"#"+note.number + " " + note.name + note.octave:"" ;
  const initialState : AppState= {
    midiIn: [],
    midiOut: [],
    noteOn: null,
    output: null
  };

  const [ourState, ourSetState] = useState(initialState);
  const { midiIn, midiOut } = ourState;
  const noteOnListener = (e : InputEventNoteon) => { ourSetState({ ...ourState, noteOn: e})};
  const outputSelection = (e: Output | null) => { ourSetState({ ...ourState, output: e})};

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
      <Box title="MIDI IN" isVerified={undefined !== navigator.requestMIDIAccess}>

        { Array.from(midiIn.values(), (value, key) => {
           const name : string = value.name;
           return       <div key={key + "x" + value.id} className="tooltip"><img id={value.id}
           src={note}
           className="Note"
           alt="note"
           onClick={ (e) => { 
             (e.target as HTMLElement).classList.toggle("Note-Selected"); 
             var input = WebMidi.getInputByName(name) as Input;             
             if(!input.hasListener("noteon","all", noteOnListener)) 
               input.addListener("noteon", "all", noteOnListener )
             else 
               input.removeListener("noteon","all", undefined);
             
             } } /><span className="tooltiptext">{name}</span></div>
         })}

      </Box>

      <Box title="MIDI OUT" isVerified={undefined !== navigator.requestMIDIAccess}>

        { Array.from(midiOut.values(), (value, key) => {
           const name : string = value.name;
           return       <div key={key + "x" + value.id} className="tooltip"><img id={value.id}
           src={note}
           className="Note"
           alt="note"
           onClick={ (e) => { 
             (e.target as HTMLElement).classList.toggle("Note-Selected"); 
             let out = WebMidi.getOutputByName(name) as Output
             if(ourState.output?.id === out?.id){
               outputSelection(null);
             }
             else {
              outputSelection(out); 
             }
 
             } } /><span className="tooltiptext">{name}</span></div>
         })}

      </Box>
   
        
    </header>
    <main className="App-header">
      <Box title="CC Control">        
        <button disabled={ ourState.output === null} onClick={ (e) => { ourState.output?.sendControlChange(0, 1, "all")          
          .sendProgramChange(0,"all")
          }}>Bank 2 Programm 1</button>
      </Box>
      <Box title="Piano">
        <div className='pianorole'>
         { new ChannelScale(new ChannelNote(60),SemitoneSteps.Chromatic).notes().map((x,i) => (
         <div key={i} className={x.isBlackKey()?'blackkey':'whitekey'}
          onMouseDown={ (e) => { ourState.output?.playNote( x.midiNote, "all", { duration: 10000 }) }}
          onMouseUp={ (e) => { ourState.output?.stopNote( x.midiNote, "all") }} 
         >
           {x.name()}
        </div>
         )) }
        </div>
      </Box>
      </main>
      <footer className="App-header">
      <Box title="Debug">
        <small>{ourState.noteOn !== null? "[" + ourState.noteOn.channel + "] " + printerify(ourState.noteOn?.note):"missing note"}</small>
      </Box>
      </footer>
        </div>
    );
}

export default App;