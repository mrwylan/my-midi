export enum NoteName {
    C = 0,
    Db,
    D,
    Eb,
    E,
    F,
    Gb,
    G,
    Ab,
    A,
    Bb,
    B    
}

export class ChannelNote {
    constructor(readonly midiNote: number){}

    static semitones = 12;
    static rootA4midiNote = 69;
    static rootA4frequency = 440;
    static blackKeys = [1,3,6,8,10];

    public octave(): number { return  Math.floor(this.midiNote / ChannelNote.semitones) -1 } // starting with -1
    public semitone(): number { return this.midiNote % ChannelNote.semitones } // 0 to 11
    public name(): string { return NoteName[this.semitone()] } // Ex. 'D'
    public qualifiedName(): string { return this.name() + this.octave() } // Ex. 'Ab5'
    public frequency(): number { return Math.pow(2,((this.midiNote - ChannelNote.rootA4midiNote)/ ChannelNote.semitones)) * ChannelNote.rootA4frequency } // Unit Hz
    public period(): number { return 1000 / this.frequency() } // Unit ms
    public isBlackKey(): boolean { return ChannelNote.blackKeys.includes(this.semitone()) } 
}

export class SemitoneSteps {
    // Music modes
    static Ionian = [2,2,1,2,2,2,1];
    static Dorian = [2,1,2,2,2,1,2];
    static Phrygian = [1,2,2,2,1,2,2];
    static Lydian = [2,2,2,1,2,2,1];
    static Mixolydian = [2,2,1,2,2,1,2];
    static Aeolian = [2,1,2,2,1,2,2];
    static Locrian = [1,2,2,1,2,2,2];
    // Familiar
    static Major = [2,2,1,2,2,2,1];
    static Minor = [2,1,2,2,1,2,2]; // natural
    static MinorHarmonic = [2,1,2,2,1,3,1];
    static MinorMelodic = [2,1,2,2,2,2,1];
    // Other
    static Chromatic = [1,1,1,1,1,1,1,1,1,1,1,1];
    static Pentatonic = [2,2,3,2,3];
    static WholeTone = [2,2,2,2,2,2]
}

export class ChannelScale {
    constructor(readonly rootNote: ChannelNote, readonly steps: number[]){}

    public noteForStep(step: number): ChannelNote { 
        if(0 == step){
            return new ChannelNote(this.rootNote.midiNote);
        }
        return new ChannelNote( this.rootNote.midiNote + this.steps.slice(0, step).reduce((x, y) => x+y))        
    }

    public notes(): ChannelNote[] { return Array.from(Array(this.steps.length).keys()).map(step => this.noteForStep(step))  }

}

export class ChannelBox {
    public notes: ChannelNote[] = [];

    // TODO : function noteOn()

    // TODO : function noteOff()

}