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

  // Generate mobile-optimized iframe code with current viewport
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
  style="border:0; min-height: 300px; border-radius: 8px;" 
  allowfullscreen="" 
  aria-hidden="false" 
  tabindex="0"
  allow="geolocation; fullscreen"
  loading="lazy"
  title="Ambient Gaza Interactive Map">
</iframe>`
  }, [viewState])

  // Generate responsive iframe container code
  const generateResponsiveCode = useCallback(() => {
    if (!viewState) return ''

    const { longitude, latitude, zoom } = viewState
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const embedUrl = `${baseUrl}/map/embed?lng=${longitude.toFixed(6)}&lat=${latitude.toFixed(
      6,
    )}&z=${zoom.toFixed(2)}`

    return `<!-- Responsive iframe container for mobile-first design -->
<div style="position: relative; width: 100%; max-width: 1200px; margin: 0 auto;">
  <div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; /* 16:9 aspect ratio */">
    <iframe 
      src="${embedUrl}" 
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 8px;" 
      allowfullscreen="" 
      aria-hidden="false" 
      tabindex="0"
      allow="geolocation; fullscreen"
      loading="lazy"
      title="Ambient Gaza Interactive Map">
    </iframe>
  </div>
  <!-- Optional: Add a fallback link for accessibility -->
  <p style="margin-top: 8px; font-size: 12px; color: #666;">
    <a href="${embedUrl}" target="_blank" rel="noopener noreferrer">
      View full map in new window
    </a>
  </p>
</div>`
  }, [viewState])

  const handleCopy = useCallback(async (code: string) => {
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

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

  const basicIframeCode = generateIframeCode()
  const responsiveCode = generateResponsiveCode()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

        <div className="p-4 space-y-6">
          {/* Basic Embed */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              📱 Basic Embed (Mobile-Optimized)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Simple iframe with mobile optimizations. Works great on all devices:
            </p>

            <div className="relative">
              <pre className="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{basicIframeCode}</code>
              </pre>

              <button
                type="button"
                onClick={() => handleCopy(basicIframeCode)}
                className="absolute top-2 right-2 p-2 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                title="Copy basic embed code"
              >
                <Copy size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Responsive Embed */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              🎯 Responsive Embed (Recommended)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Responsive container that maintains aspect ratio and scales perfectly on all devices:
            </p>

            <div className="relative">
              <pre className="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{responsiveCode}</code>
              </pre>

              <button
                type="button"
                onClick={() => handleCopy(responsiveCode)}
                className="absolute top-2 right-2 p-2 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                title="Copy responsive embed code"
              >
                <Copy size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleCopy(basicIframeCode)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy Basic'}
            </button>

            <button
              type="button"
              onClick={() => handleCopy(responsiveCode)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Copy size={16} />
              Copy Responsive
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

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-blue-800">📋 Embed Instructions</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                ✅ <strong>Mobile-Optimized:</strong> Works perfectly on phones, tablets, and
                desktop
              </p>
              <p>
                ✅ <strong>Interactive:</strong> Users can zoom, pan, and explore the map
              </p>
              <p>
                ✅ <strong>Accessible:</strong> Includes proper ARIA labels and keyboard navigation
              </p>
              <p>
                ✅ <strong>Performance:</strong> Lazy loading and optimized for fast loading
              </p>
              <p>
                📍 <strong>Location:</strong> Shows the current map view and zoom level
              </p>
              <p>
                🎨 <strong>Clean UI:</strong> No navigation clutter, just the map
              </p>
            </div>
          </div>

          {/* Technical Notes */}
          <details className="text-xs text-gray-500 border-t pt-4">
            <summary className="cursor-pointer font-medium mb-2">🔧 Technical Details</summary>
            <div className="space-y-1 ml-4">
              <p>• Uses secure HTTPS embedding with proper CSP headers</p>
              <p>• Supports geolocation API for location-based features</p>
              <p>• Responsive design works on screens from 320px to 4K</p>
              <p>• Compatible with all modern browsers including mobile Safari</p>
              <p>• Lazy loading reduces initial page load time</p>
              <p>• No tracking cookies or third-party dependencies</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

export default IframeHelper
