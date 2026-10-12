/**
 * Web Audio API synthesizer for celebratory Birthday Music
 */
class PartyAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;

  // Happy birthday melody notes & durations
  // (Frequency in Hz, duration in seconds)
  private melody: { freq: number; dur: number }[] = [
    { freq: 261.63, dur: 0.35 }, // C4
    { freq: 261.63, dur: 0.2 },  // C4
    { freq: 293.66, dur: 0.55 }, // D4
    { freq: 261.63, dur: 0.55 }, // C4
    { freq: 349.23, dur: 0.55 }, // F4
    { freq: 329.63, dur: 0.9 },  // E4

    { freq: 261.63, dur: 0.35 }, // C4
    { freq: 261.63, dur: 0.2 },  // C4
    { freq: 293.66, dur: 0.55 }, // D4
    { freq: 261.63, dur: 0.55 }, // C4
    { freq: 392.00, dur: 0.55 }, // G4
    { freq: 349.23, dur: 0.9 },  // F4

    { freq: 261.63, dur: 0.35 }, // C4
    { freq: 261.63, dur: 0.2 },  // C4
    { freq: 523.25, dur: 0.55 }, // C5
    { freq: 440.00, dur: 0.55 }, // A4
    { freq: 349.23, dur: 0.55 }, // F4
    { freq: 329.63, dur: 0.55 }, // E4
    { freq: 293.66, dur: 0.7 },  // D4

    { freq: 466.16, dur: 0.35 }, // Bb4
    { freq: 466.16, dur: 0.2 },  // Bb4
    { freq: 440.00, dur: 0.55 }, // A4
    { freq: 349.23, dur: 0.55 }, // F4
    { freq: 392.00, dur: 0.55 }, // G4
    { freq: 349.23, dur: 1.1 },  // F4
  ];

  private playTone(freq: number, duration: number, time: number) {
    if (!this.ctx) return;

    // Main melody oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Harmonics for a sweet warm bell / music box tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Warm sub oscillator
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq / 2, time);

    // Envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    subGain.gain.setValueAtTime(0, time);
    subGain.gain.linearRampToValueAtTime(0.08, time + 0.04);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    subOsc.connect(subGain);
    gain.connect(this.ctx.destination);
    subGain.connect(this.ctx.destination);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + duration);
    subOsc.stop(time + duration);
  }

  public toggle(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isPlaying) {
      this.stop();
      onStateChange?.(false);
      return false;
    } else {
      this.start();
      onStateChange?.(true);
      return true;
    }
  }

  public start() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isPlaying = true;
      this.scheduleLoop();
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduleLoop() {
    if (!this.isPlaying || !this.ctx) return;

    let currentTime = this.ctx.currentTime + 0.1;
    let totalDuration = 0;

    for (const note of this.melody) {
      this.playTone(note.freq, note.dur, currentTime);
      currentTime += note.dur + 0.08;
      totalDuration += note.dur + 0.08;
    }

    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleLoop();
      }
    }, totalDuration * 1000);
  }
}

export const partyAudio = new PartyAudioPlayer();
