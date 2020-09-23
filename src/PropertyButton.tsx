import React, { useState }  from 'react';
import './PropertyButton.css';

enum ControlState {
    ReadOnly,
    Edit,
    Recording
}

type PropertyButtonState = {
    controlState : ControlState,
    midiControl : number,
    midiControlValue : number   
}

type PropertyButtonProps = {
    ccsend : (controlState : PropertyButtonState ) => void
}

function PropertyButton({ ccsend } : PropertyButtonProps ) {

    const initialState : PropertyButtonState = {
        controlState: ControlState.ReadOnly,
        midiControl: 0,
        midiControlValue: 10
    }
    const [ourState, ourSetState] = useState(() => initialState);

    const handleControlState = (newState: ControlState) => 
    {
        ourSetState({ ...ourState, controlState: newState});        
    };

    const formPresentationReadOnly =
        <div className={'compact'}>
            <label>Action
                <input type="button" name="send" value="send" onClick={(e) => {ccsend(ourState); e.preventDefault(); }} />
                <input type="button" name="record" value="record" onClick={(e) => { handleControlState(ControlState.Recording); e.preventDefault();} } />
                <input type="button" name="edit" value="edit" onClick={(e) => { handleControlState(ControlState.Edit); e.preventDefault(); }} />
            </label>
        </div>;

    const formPresentationEditAndRecord =
        <div className={'expanded'}>
            <label>Accept
                <input type="button" name="submit" value="submit" onClick={(e) => {handleControlState(ControlState.ReadOnly); e.preventDefault();}}  />
            </label>                
            <label>Control
                <input type="number" id="controlNumber" min="0" max= "127" value={ ourState.midiControl } onChange={(e)=> ourSetState({ ...ourState, midiControl: e.target.valueAsNumber}) }  />
            </label>
            <label>Value
                <input type="range" id="controlValue" min="0" max= "127" value={ ourState.midiControlValue } onChange={(e)=> ourSetState({ ...ourState, midiControlValue: e.target.valueAsNumber})} />
            </label>                
        </div>;
   
    return (
        <form onSubmit={(event) => { event.preventDefault()}}>                        
             {(ourState.controlState === ControlState.ReadOnly)?
             formPresentationReadOnly:formPresentationEditAndRecord}                          
        </form>
    );
}

export default PropertyButton;
