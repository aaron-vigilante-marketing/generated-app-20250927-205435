import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Play, StopCircle, Trash2, Loader, Volume2, VolumeX, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { audioEngine, ALL_INSTRUMENTS, Instrument, CUSTOM_INSTRUMENTS, BASE_INSTRUMENTS } from '@/lib/audio';
import { use808, use808Actions, useSequencer } from '@/hooks/use808';
const InstrumentRow = ({ instrument }: { instrument: Instrument }) => {
  const { pattern, volumes, muted, customInstrumentNames } = use808();
  const { toggleStep, setVolume, toggleMute, loadCustomSample } = use808Actions();
  const { currentStep, isPlaying } = use808();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCustom = CUSTOM_INSTRUMENTS.includes(instrument);
  const displayName = isCustom ? customInstrumentNames[instrument] : instrument.replace('-', ' ');
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'audio/wav') {
      loadCustomSample(instrument, file);
    } else if (file) {
      alert('Please upload a valid .wav file.');
    }
  };
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="grid grid-cols-[6rem_3rem_6rem_repeat(16,minmax(0,1fr))] items-center gap-x-2 md:gap-x-4">
      {isCustom ? (
        <>
          <input type="file" accept=".wav" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="h-12 text-xs sm:text-sm text-neon-magenta capitalize rounded-md bg-black/50 border-neon-magenta/50 truncate px-1 hover:bg-neon-magenta/20 hover:text-white"
          >
            <Upload className="w-4 h-4 mr-2 hidden sm:inline-block" />
            <span className="truncate">{displayName}</span>
          </Button>
        </>
      ) : (
        <div className="h-12 flex items-center justify-center text-sm sm:text-base text-neon-magenta capitalize rounded-md bg-black/50 border border-neon-magenta/50 truncate px-1">
          {displayName}
        </div>
      )}
      <Button onClick={() => toggleMute(instrument)} variant="ghost" size="icon" className={cn("h-10 w-10", muted[instrument] ? "text-neon-magenta" : "text-neon-cyan")}>
        {muted[instrument] ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
      <Slider
        value={[volumes[instrument]]}
        onValueChange={(value) => setVolume(instrument, value[0])}
        min={0}
        max={100}
        step={1}
        className="w-full"
        aria-label={`${instrument} Volume`}
        disabled={muted[instrument]}
      />
      {pattern[instrument].map((isActive, stepIndex) => (
        <button
          key={stepIndex}
          onClick={() => toggleStep(instrument, stepIndex)}
          className={cn(
            "h-12 w-full rounded-md border-2 transition-all duration-150 relative",
            "border-neon-cyan/30 hover:border-neon-cyan",
            isActive ? "bg-neon-cyan shadow-glow-cyan" : "bg-gray-800/50",
            stepIndex === currentStep && isPlaying && "border-neon-magenta shadow-glow-magenta scale-105",
            stepIndex > 0 && stepIndex % 4 === 0 && "ml-1 md:ml-2"
          )}
          aria-label={`Instrument ${instrument} Step ${stepIndex + 1}`}
        />
      ))}
    </div>
  );
};
export function HomePage() {
  const { tempo, isPlaying, isInitialized } = use808();
  const { setTempo, togglePlay, clearPattern, setInitialized } = use808Actions();
  const [isLoading, setIsLoading] = useState(true);
  useSequencer();
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await audioEngine.initialize();
      setInitialized(true);
      setIsLoading(false);
    };
    init();
  }, [setInitialized]);
  const handleUserInteraction = () => {
    if (audioEngine.getIsInitialized()) {
      audioEngine.resumeContext();
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dark-charcoal font-pixel text-neon-cyan p-4">
        <Loader className="w-16 h-16 animate-spin text-neon-cyan mb-4" />
        <p className="text-2xl" style={{ textShadow: '0 0 5px' }}>LOADING RHYTHM-808...</p>
      </div>
    );
  }
  if (!isInitialized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dark-charcoal font-pixel text-neon-cyan p-4">
        <h1 className="text-6xl mb-8 text-neon-magenta" style={{ textShadow: '0 0 8px' }}>Rhythm-808</h1>
        <Button
          onClick={handleUserInteraction}
          className="font-pixel text-2xl p-8 bg-neon-cyan text-dark-charcoal hover:bg-white hover:shadow-glow-cyan"
        >
          CLICK TO START
        </Button>
        <p className="mt-4 text-lg">Please interact to enable audio</p>
      </div>
    );
  }
  return (
    <main onClick={handleUserInteraction} className="min-h-screen w-full flex items-center justify-center bg-dark-charcoal font-pixel p-2 sm:p-4 md:p-8 crt-container">
      <div className="w-full max-w-7xl border-2 border-neon-magenta/50 bg-black/30 p-4 md:p-8 rounded-md shadow-glow-magenta space-y-8 backdrop-blur-sm">
        <header>
          <h1 className="text-5xl md:text-6xl font-bold text-neon-magenta text-center" style={{ textShadow: '0 0 8px rgb(255,0,255)' }}>
            Rhythm-808
          </h1>
        </header>
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 bg-black/50 p-4 rounded-md border border-neon-cyan/30">
          <div className="flex items-center gap-4">
            <Button onClick={togglePlay} variant="ghost" size="icon" className="w-16 h-16 text-neon-cyan hover:bg-neon-cyan/20 hover:text-white transition-all">
              {isPlaying ? <StopCircle className="w-10 h-10" /> : <Play className="w-10 h-10" />}
            </Button>
            <Button onClick={clearPattern} variant="ghost" size="icon" className="w-16 h-16 text-neon-magenta hover:bg-neon-magenta/20 hover:text-white transition-all">
              <Trash2 className="w-8 h-8" />
            </Button>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-2xl text-neon-cyan">BPM: <span className="font-mono">{tempo}</span></span>
            <Slider
              value={[tempo]}
              onValueChange={(value) => setTempo(value[0])}
              min={40}
              max={240}
              step={1}
              className="w-full md:w-64"
              aria-label="Tempo"
            />
          </div>
        </section>
        <section className="grid gap-y-2 bg-black/50 p-4 rounded-md border border-neon-cyan/30 overflow-x-auto">
          {BASE_INSTRUMENTS.map((instrument) => <InstrumentRow key={instrument} instrument={instrument} />)}
          <div className="h-4"></div>
          {CUSTOM_INSTRUMENTS.map((instrument) => <InstrumentRow key={instrument} instrument={instrument} />)}
        </section>
        <footer className="text-center text-neon-cyan/50 text-sm">
          Built with ❤️ at Cloudflare
        </footer>
      </div>
    </main>
  );
}