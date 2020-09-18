import { ChannelBox, ChannelChord, ChannelNote, ChannelScale, SemitoneSteps } from "./ChannelBox";

describe('channelNote', function(){
    it('midiNote', function() {
        let note = new ChannelNote(59);
        expect(note.midiNote).toBe(59);
        expect(note.octave()).toBe(3);
        expect(note.semitone()).toBe(11);
        expect(note.qualifiedName()).toBe('B3');
    })
    it('midi0Note', function() {
        let note = new ChannelNote(0);
        expect(note.midiNote).toBe(0);
        expect(note.octave()).toBe(-1);
        expect(note.semitone()).toBe(0);
        expect(note.qualifiedName()).toBe('C-1');
    })
    it('freq440', function() {
        let note = new ChannelNote(69);
        expect(note.frequency()).toBe(440);
    })
    it('freq880', function() {
        let note = new ChannelNote(81);
        expect(note.frequency()).toBe(880);
    })
    it('freq261', function() {
        let note = new ChannelNote(60);
        expect(Math.round(note.frequency())).toBe(262);
    })
    it('period1', function() {
        let note = new ChannelNote(83);
        expect(Math.round(note.period())).toBe(1);
    })
    it('whiteKey', function() {
        let note = new ChannelNote(83);
        expect(note.isBlackKey()).toBe(false);
    })
    it('blackKey', function() {
        let note = new ChannelNote(70);
        expect(note.isBlackKey()).toBe(true);
    })
    
});

describe('channelScale', function(){
    it('notesMajor', function() {        
        let note = new ChannelNote(60);
        let scale = new ChannelScale(note, SemitoneSteps.Major);
        expect(scale.notes()).toContainEqual(note);
        expect(scale.notes().length).toBe(7);
        expect(scale.notes().map(x => x.midiNote)).toContain(71);
    })
    it('notesMinor', function() {        
        let note = new ChannelNote(69);
        let scale = new ChannelScale(note, SemitoneSteps.Minor);
        expect(scale.notes()).toContainEqual(note);
        expect(scale.notes().length).toBe(7);
        expect(scale.notes().map(x => x.isBlackKey())).not.toContain(true);
    })
    it('notesChromatic', function() {        
        let note = new ChannelNote(60);
        let scale = new ChannelScale(note, SemitoneSteps.Chromatic);
        expect(scale.notes()).toContainEqual(note);
        expect(scale.notes().length).toBe(12);
        expect([...scale.notes()].pop()?.midiNote).toBe(71)
    })
});

describe('channelChord', function(){
    it('chordMajor', function() {        
        let note = new ChannelNote(36);
        let scale = new ChannelChord(note, ChannelChord.Major);    
        expect(scale.notes().length).toBe(3);
        expect(scale.notes().map(x => x.midiNote)).toContain(36);
        expect(scale.notes().map(x => x.midiNote)).toContain(40);
        expect(scale.notes().map(x => x.midiNote)).toContain(43);
    })
    it('chordMinor', function() {        
        let note = new ChannelNote(36);
        let scale = new ChannelChord(note, ChannelChord.Minor);    
        expect(scale.notes().length).toBe(3);
        expect(scale.notes().map(x => x.midiNote)).toContain(36);
        expect(scale.notes().map(x => x.midiNote)).toContain(39);
        expect(scale.notes().map(x => x.midiNote)).toContain(43);
    })
});

describe('channelBox', function(){
    it('noteOn', function() {    
        let channel = new ChannelBox();    
        channel.noteOn(36);             
        expect(channel.notes[0].midiNote).toBe(36);
    })
    it('notesOn', function() {        
        let note = new ChannelNote(36);
        let chord = new ChannelChord(note, ChannelChord.Major);    
        let channel = new ChannelBox();

        channel.notesOn(chord.notes().map(midi => midi.midiNote));

        expect(channel.notes.length).toBe(3);
        expect(channel.notes.map(x => x.midiNote)).toContain(40);
    })
    it('noteOff', function() {    
        let channel = new ChannelBox().noteOn(36);    
        
        channel.noteOff(36);
        channel.noteOff(69);
       
        expect(channel.notes.length).toBe(0);
    })
});