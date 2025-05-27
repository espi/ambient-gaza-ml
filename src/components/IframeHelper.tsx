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

  // Generate iframe code with current viewport
  const generateIframeCode = useCallback(() => {
    if (!viewState) return ''

    const { longitude, latitude, zoom } = viewState
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const embedUrl = `${baseUrl}/map/embed?lng=${longitude.toFixed(6)}&lat=${latitude.toFixed(
      6,
    )}&z=${zoom.toFixed(2)}`

    return `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="400" 
  frameborder="0" 
  style="border:0;" 
  allowfullscreen="" 
  aria-hidden="false" 
  tabindex="0">
</iframe>`
  }, [viewState])

  const handleCopy = useCallback(async () => {
    const iframeCode = generateIframeCode()
    if (!iframeCode) return

    try {
      await navigator.clipboard.writeText(iframeCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = iframeCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [generateIframeCode])

  const handlePreview = useCallback(() => {
    if (!viewState) return

    const { longitude, latitude, zoom } = viewState
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const embedUrl = `${baseUrl}/map/embed?lng=${longitude.toFixed(6)}&lat=${latitude.toFixed(
      6,
    )}&z=${zoom.toFixed(2)}`

    window.open(embedUrl, '_blank', 'width=800,height=600')
  }, [viewState])

  if (!isOpen) return null

  const iframeCode = generateIframeCode()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            <p className="text-sm text-gray-600 mb-2">
              Copy this code to embed the current map view in your website:
            </p>

            <div className="relative">
              <pre className="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{iframeCode}</code>
              </pre>

              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={16} className="text-gray-600" />
              </button>
            </div>

            {copied && <p className="text-sm text-green-600 mt-2">✓ Copied to clipboard!</p>}
          </div>

          <div className="flex gap-2">
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

          <div className="text-xs text-gray-500 space-y-1">
            <p>• The embed will show the map at the current location and zoom level</p>
            <p>• Users can interact with the embedded map (zoom, pan)</p>
            <p>• The embed excludes navigation and settings UI for a clean appearance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IframeHelper
