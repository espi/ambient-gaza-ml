import { Loader, Pause, Play, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  audioSrc: string
  className?: string
}

const AudioPlayer = ({ audioSrc, className = '' }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return () => {}

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const updateDuration = () => {
      setIsLoading(false)
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    const handleError = () => {
      setIsLoading(false)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadeddata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadeddata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('error', handleError)
    }
  }, [audioRef, audioSrc])

  const togglePlay = (): void => {
    const audio = audioRef.current
    if (!audio || isLoading) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const renderPlayPauseIcon = () => {
    if (isLoading) {
      return <Loader size={16} className="animate-spin" />
    }
    if (isPlaying) {
      return <Pause size={16} />
    }
    return <Play size={16} className="ml-0.5" />
  }

  return (
    <div className={`flex flex-col bg-light/20 rounded-md p-3 ${className}`}>
      <audio ref={audioRef} src={audioSrc} preload="metadata">
        <track kind="captions" />
      </audio>

      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={togglePlay}
          className={`rounded-full p-2 mr-2 flex items-center justify-center w-8 h-8 
                    ${
                      isLoading
                        ? 'bg-gray cursor-wait'
                        : 'bg-brand-primary hover:bg-brand-accent transition-colors cursor-pointer'
                    } text-white`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isLoading}
        >
          {renderPlayPauseIcon()}
        </button>

        <div className="flex items-center flex-1 ml-2">
          <Volume2 size={16} className="text-dark mr-2" />
          <div className="flex text-xs font-semibold justify-between w-full">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className={`w-full h-2 rounded-full cursor-pointer ${
            isLoading ? 'opacity-50 cursor-wait' : ''
          }`}
          style={{
            background: `linear-gradient(to right, 
                            var(--tw-color-brand-primary) 0%, 
                            var(--tw-color-brand-primary) ${
                              (currentTime / (duration || 1)) * 100
                            }%, 
                            var(--tw-color-light) ${(currentTime / (duration || 1)) * 100}%, 
                            var(--tw-color-light) 100%)`,
          }}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default AudioPlayer
