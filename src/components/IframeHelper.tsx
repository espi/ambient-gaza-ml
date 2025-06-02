import { Copy, ExternalLink, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ViewState } from 'react-map-gl'

interface IframeHelperProps {
  viewState?: ViewState
  isOpen: boolean
  onClose: () => void
}

const IframeHelper = ({ viewState, isOpen, onClose }: IframeHelperProps) => {
  const [copied, setCopied] = useState(false)

  // Generate square responsive iframe code
  const generateEmbedCode = useCallback(() => {
    if (!viewState) return ''

    const { longitude, latitude, zoom } = viewState
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const embedUrl = `${baseUrl}/map/embed?lng=${longitude.toFixed(6)}&lat=${latitude.toFixed(
      6,
    )}&z=${zoom.toFixed(2)}`

    return `<!-- Square responsive map embed -->
<div style="position: relative; width: 100%; max-width: 600px; margin: 0 auto;">
  <div style="position: relative; width: 100%; height: 0; padding-bottom: 100%; /* 1:1 square ratio */">
    <iframe 
      src="${embedUrl}" 
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 8px;" 
      allowfullscreen="" 
      allow="geolocation; fullscreen"
      loading="lazy"
      title="Ambient Gaza Interactive Map">
    </iframe>
  </div>
</div>`
  }, [viewState])

  const handleCopy = useCallback(async () => {
    const embedCode = generateEmbedCode()
    if (!embedCode) return

    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = embedCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [generateEmbedCode])

  const handlePreview = useCallback(() => {
    if (!viewState) return

    const { longitude, latitude, zoom } = viewState
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const embedUrl = `${baseUrl}/map/embed?lng=${longitude.toFixed(6)}&lat=${latitude.toFixed(
      6,
    )}&z=${zoom.toFixed(2)}`

    window.open(embedUrl, '_blank', 'width=600,height=600')
  }, [viewState])

  if (!isOpen) return null

  const embedCode = generateEmbedCode()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-dark">Embed Map</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              📐 Square Embed (Recommended)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Responsive square format optimized for popups and mobile devices:
            </p>

            <div className="relative">
              <pre className="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{embedCode}</code>
              </pre>

              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                title="Copy embed code"
              >
                <Copy size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={16} />
              Preview
            </button>
          </div>

          {copied && <p className="text-sm text-green-600 mt-2">✅ Copied to clipboard!</p>}

          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-blue-800">✨ Features</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                📐 <strong>Square format</strong> provides optimal popup visibility
              </p>
              <p>
                📱 <strong>Mobile-optimized</strong> with responsive design
              </p>
              <p>
                🎯 <strong>Interactive</strong> with zoom, pan, and audio playback
              </p>
              <p>
                ⚡ <strong>Fast loading</strong> with lazy loading and performance optimization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IframeHelper
