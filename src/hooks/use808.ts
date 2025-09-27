import { create } from 'zustand';
import { useEffect, useRef } from 'react';
import { audioEngine, Instrument, ALL_INSTRUMENTS } from '@/lib/audio';
const STEPS = 16;
type Pattern = Record<Instrument, boolean[]>;
type Volumes = Record<Instrument, number>;
type Muted = Record<Instrument, boolean>;
type CustomInstrumentNames = Record<string, string>;
interface SequencerState {
  pattern: Pattern;
  volumes: Volumes;
  muted: Muted;
  customInstrumentNames: CustomInstrumentNames;
  tempo: number;
  isPlaying: boolean;
  currentStep: number;
  isInitialized: boolean;
  actions: {
    toggleStep: (instrument: Instrument, step: number) => void;
    setTempo: (tempo: number) => void;
    togglePlay: () => void;
    clearPattern: () => void;
    setCurrentStep: (step: number) => void;
    setInitialized: (isInitialized: boolean) => void;
    setVolume: (instrument: Instrument, volume: number) => void;
    toggleMute: (instrument: Instrument) => void;
    loadCustomSample: (instrumentId: string, file: File) => Promise<void>;
  };
}
const createInitialStateFor = <T>(defaultValue: T): Record<Instrument, T> => {
  return ALL_INSTRUMENTS.reduce((acc, instrument) => {
    acc[instrument] = defaultValue;
    return acc;
  }, {} as Record<Instrument, T>);
};
const createInitialPattern = (): Pattern => {
  return ALL_INSTRUMENTS.reduce((acc, instrument) => {
    acc[instrument] = Array(STEPS).fill(false);
    return acc;
  }, {} as Pattern);
};
export const use808Store = create<SequencerState>((set, get) => ({
  pattern: createInitialPattern(),
  volumes: createInitialStateFor<number>(100),
  muted: createInitialStateFor<boolean>(false),
  customInstrumentNames: {
    'custom-1': 'Upload Sample 1',
    'custom-2': 'Upload Sample 2',
    'custom-3': 'Upload Sample 3',
  },
  tempo: 120,
  isPlaying: false,
  currentStep: -1,
  isInitialized: false,
  actions: {
    toggleStep: (instrument, step) =>
      set((state) => {
        const newPattern = { ...state.pattern };
        newPattern[instrument][step] = !newPattern[instrument][step];
        return { pattern: newPattern };
      }),
    setTempo: (tempo) => set({ tempo }),
    togglePlay: () => {
      const isPlaying = get().isPlaying;
      if (!isPlaying) {
        audioEngine.resumeContext();
        set({ isPlaying: true, currentStep: -1 });
      } else {
        set({ isPlaying: false, currentStep: -1 });
      }
    },
    clearPattern: () => set({ pattern: createInitialPattern() }),
    setCurrentStep: (step) => set({ currentStep: step }),
    setInitialized: (isInitialized) => set({ isInitialized }),
    setVolume: (instrument, volume) =>
      set((state) => ({
        volumes: { ...state.volumes, [instrument]: volume },
      })),
    toggleMute: (instrument) =>
      set((state) => ({
        muted: { ...state.muted, [instrument]: !state.muted[instrument] },
      })),
    loadCustomSample: async (instrumentId, file) => {
      try {
        await audioEngine.loadCustomSample(instrumentId, file);
        set((state) => ({
          customInstrumentNames: {
            ...state.customInstrumentNames,
            [instrumentId]: file.name,
          },
        }));
      } catch (error) {
        console.error(`Failed to load custom sample for ${instrumentId}:`, error);
        // Optionally, dispatch a toast notification for the user
      }
    },
  },
}));
export const useSequencer = () => {
  const { isPlaying, tempo, pattern, volumes, muted } = use808Store();
  const { setCurrentStep } = use808Store((s) => s.actions);
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / tempo) * 1000 / 4; // 16th notes
      let lastStep = -1;
      const tick = () => {
        const nextStep = (lastStep + 1) % STEPS;
        setCurrentStep(nextStep);
        ALL_INSTRUMENTS.forEach((instrument) => {
          if (pattern[instrument][nextStep] && !muted[instrument]) {
            audioEngine.play(instrument, volumes[instrument] / 100);
          }
        });
        lastStep = nextStep;
        timerRef.current = window.setTimeout(tick, interval);
      };
      tick();
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setCurrentStep(-1);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, tempo, pattern, volumes, muted, setCurrentStep]);
};
export const use808 = () => use808Store((s) => s);
export const use808Actions = () => use808Store((s) => s.actions);