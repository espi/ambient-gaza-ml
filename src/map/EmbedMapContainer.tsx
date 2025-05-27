import type { ViewState } from 'react-map-gl'

import MapContextProvider from '@/src/map/MapContextProvider'
import MapCore from '@/src/map/MapCore'

interface EmbedMapContainerProps {
  initialViewState: ViewState
}

const EmbedMapContainer = ({ initialViewState }: EmbedMapContainerProps) => (
  <MapContextProvider>
    <MapCore
      initialViewState={initialViewState}
      showTopBar={false}
      showSidebar={false}
      showSettingsBox={false}
      showMapControls
      className="absolute overflow-hidden inset-0 bg-mapBg"
    />
  </MapContextProvider>
)

export default EmbedMapContainer
