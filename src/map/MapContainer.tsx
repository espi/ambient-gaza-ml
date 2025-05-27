import MapContextProvider from '@/src/map/MapContextProvider'
import MapCore from '@/src/map/MapCore'

const MapInner = () => <MapCore />

// context pass through
const MapContainer = () => (
  <MapContextProvider>
    <MapInner />
  </MapContextProvider>
)

export default MapContainer
