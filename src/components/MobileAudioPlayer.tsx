import { useCallback, useEffect, useRef, useState } from 'react'

interface MobileAudioPlayerProps {
  audioSrc: string
  className?: string
}

// Whether to enable debug logging
const DEBUG = process.env.NODE_ENV === 'development'

const MobileAudioPlayer = ({ audioSrc, className = '' }: MobileAudioPlayerProps) => {
  // Device detection
  const isIOS = useRef<boolean>(
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: unknown }).MSStream,
  )

  // Player state
  const [error, setError] = useState<string | null>(null)
  const [fileVerified, setFileVerified] = useState(false)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasStartedPlayingRef = useRef(false)
  const audioSrcRef = useRef(audioSrc)

  // Update audioSrcRef when audioSrc changes
  useEffect(() => {
    audioSrcRef.current = audioSrc
  }, [audioSrc])

  // Debug logging
  const debugLog = useCallback((message: string, data?: unknown) => {
    if (DEBUG) {
      // Using a conditional to avoid the no-console error in production
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`[MobileAudioPlayer] ${message}`, data || '')
      }
    }
  }, [])

  // Verify that the audio file exists
  useEffect(() => {
    // Reset state when audio source changes
    setFileVerified(false)
    setError(null)
    hasStartedPlayingRef.current = false

    debugLog('Verifying audio file', { audioSrc })

    // Check if the file exists - but don't block audio playback on this
    fetch(audioSrc)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        debugLog('File exists', {
          status: response.status,
          contentType: response.headers.get('content-type') || 'unknown',
        })

        // If we got here, the file exists
        setFileVerified(true)
        setError(null)
      })
      .catch(err => {
        debugLog('File verification failed', err)
        if (err instanceof Error) {
          setError(`Cannot access audio file: ${err.message}`)
        } else {
          setError('Cannot access audio file: unknown error')
        }
      })
  }, [audioSrc, debugLog])

  // Initialize iOS audio on mount
  useEffect(() => {
    debugLog('Component mounted', {
      audioSrc,
      isIOS: isIOS.current,
      userAgent: navigator.userAgent,
    })

    // Capture the value in a local variable to fix the exhaustive-deps warning
    const isIOSDevice = isIOS.current

    // Only for iOS, set up audio unlocking on first user interaction
    if (isIOSDevice) {
      const unlockAudio = () => {
        debugLog('User interaction detected - unlocking audio')

        // Create and play silent audio - works on iOS
        const silentAudio = new Audio(
          'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV',
        )
        silentAudio.volume = 0.1

        // Play synchronously within user interaction - critical for iOS
        silentAudio
          .play()
          .then(() => {
            debugLog('Silent audio played successfully - audio unlocked')
            document.removeEventListener('touchstart', unlockAudio)
            document.removeEventListener('click', unlockAudio)
          })
          .catch(err => {
            debugLog('Failed to play silent audio', err)
          })
      }

      // Add event listeners for user interaction
      document.addEventListener('touchstart', unlockAudio, { once: true })
      document.addEventListener('click', unlockAudio, { once: true })

      // Use the local variable in the cleanup function
      return () => {
        if (isIOSDevice) {
          document.removeEventListener('touchstart', unlockAudio)
          document.removeEventListener('click', unlockAudio)
        }
      }
    }

    return undefined
  }, [audioSrc, debugLog])

  // Handle native audio element events
  const handleAudioRef = useCallback(
    (audio: HTMLAudioElement | null) => {
      if (!audio) return

      audioRef.current = audio

      debugLog('Native audio element mounted')

      // For iOS, we need special handling
      if (isIOS.current) {
        // iOS requires play() to be called from a user gesture
        // The native controls will handle this for us
        debugLog('iOS detected - using native controls')
      }
    },
    [debugLog],
  )

  // Handle audio errors
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement>) => {
      const audio = e.currentTarget

      // Only show error if we haven't successfully started playing yet
      if (hasStartedPlayingRef.current) {
        debugLog('Ignoring error - audio already playing')
        return
      }

      let errorMessage = 'Unknown error'
      if (audio.error) {
        switch (audio.error.code) {
          case 1:
            errorMessage = 'Audio fetching aborted'
            break
          case 2:
            errorMessage = `Network error - file may not exist at: ${audioSrc}`
            break
          case 3:
            errorMessage = 'Audio decoding failed - file may be corrupt'
            break
          case 4:
            errorMessage = `Audio format not supported - check file at: ${audioSrc}`
            break
          default:
            errorMessage = `Unknown error (${audio.error.code})`
        }
      }

      debugLog('Audio error', {
        code: audio.error?.code,
        message: errorMessage,
        src: audioSrc,
      })

      setError(errorMessage)
    },
    [audioSrc, debugLog],
  )

  // Handle successful play event
  const handlePlay = useCallback(() => {
    debugLog('Audio playing')
    hasStartedPlayingRef.current = true
    setError(null) // Clear any errors when playback works
  }, [debugLog])

  return (
    <div className={`flex flex-col bg-light/20 rounded-md p-2 ${className}`}>
      {/* iOS notice */}
      {isIOS.current && (
        <div className="text-xs text-amber-700 bg-amber-50 p-1 rounded mb-2">
          Tap play to start audio on iOS devices
        </div>
      )}

      {/* Error display */}
      {error && !hasStartedPlayingRef.current && !fileVerified && (
        <div className="text-sm text-red-500 mb-2">{error}</div>
      )}

      {/* Native audio player - always shown */}
      <audio
        ref={handleAudioRef}
        src={audioSrc}
        controls
        preload="metadata"
        onPlay={handlePlay}
        onError={handleError}
        className="w-full h-10"
      >
        <source src={audioSrc} type="audio/mpeg" />
        {/* Add track element for accessibility */}
        <track kind="captions" src="" label="English" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default MobileAudioPlayer
