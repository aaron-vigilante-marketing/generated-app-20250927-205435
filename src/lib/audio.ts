export type Instrument = string;
export const BASE_INSTRUMENTS: Instrument[] = ['kick', 'snare', 'clap', 'tom-low', 'hihat-closed', 'hihat-open'];
export const CUSTOM_INSTRUMENTS: Instrument[] = ['custom-1', 'custom-2', 'custom-3'];
export const ALL_INSTRUMENTS: Instrument[] = [...BASE_INSTRUMENTS, ...CUSTOM_INSTRUMENTS];
const SAMPLE_URLS: Record<string, string> = {
  'kick': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1147877/kick.wav',
  'snare': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1147877/snare.wav',
  'clap': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1147877/clap.wav',
  'tom-low': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1147877/tom-low.wav',
  'hihat-closed': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1147877/hihat-closed.wav',
  'hihat-open': 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1147877/hihat-open.wav',
};
class AudioEngine {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<Instrument, AudioBuffer> = new Map();
  private isInitialized = false;
  private async initAudioContext() {
    if (this.isInitialized) return;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    await this.loadSamples();
    this.isInitialized = true;
  }
  public async initialize() {
    if (typeof window !== 'undefined') {
      await this.initAudioContext();
    }
  }
  private async loadSample(instrument: Instrument): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }
    const url = SAMPLE_URLS[instrument];
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load sound from ${url} (${response.status} ${response.statusText})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return this.audioContext.decodeAudioData(arrayBuffer);
  }
  public async loadCustomSample(instrumentId: Instrument, file: File): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.audioBuffers.set(instrumentId, audioBuffer);
    return audioBuffer;
  }
  private async loadSamples() {
    try {
      const loadPromises = BASE_INSTRUMENTS.map(async (instrument) => {
        try {
          const buffer = await this.loadSample(instrument);
          this.audioBuffers.set(instrument, buffer);
        } catch (error) {
          console.error(`Failed to load or decode sample for instrument: ${instrument}`, error);
          throw error;
        }
      });
      await Promise.all(loadPromises);
      console.log('All base audio samples loaded successfully.');
    } catch (error) {
      console.error('Error loading audio samples. One or more samples failed to load.', error);
    }
  }
  public play(instrument: Instrument, volume: number) {
    if (!this.audioContext || !this.isInitialized || volume === 0) {
      return;
    }
    const buffer = this.audioBuffers.get(instrument);
    if (buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);
    }
  }
  public getIsInitialized(): boolean {
    return this.isInitialized;
  }
  public resumeContext(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}
export const audioEngine = new AudioEngine();