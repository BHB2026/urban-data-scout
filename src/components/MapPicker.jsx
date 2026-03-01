/**
 * Interactive map for the resident submission form.
 * Click anywhere to drop/move a pin. The project boundary is shown
 * as a dashed blue circle.
 */
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Custom red pin icon for the selected location
const redPin = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 32" fill="none">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 6 8 16 8 16s8-10 8-16c0-4.42-3.58-8-8-8z"
            fill="#EF4444" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="8" r="3" fill="white"/>
    </svg>`,
  className: '',
  iconSize:   [28, 36],
  iconAnchor: [14, 36],
  popupAnchor:[0, -36],
})

function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function MapPicker({ project, location, onLocationSelect }) {
  return (
    <div
      className="map-picker rounded-xl overflow-hidden border border-gray-200 shadow-sm"
      style={{ height: '340px' }}
    >
      <MapContainer
        center={[project.latitude, project.longitude]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Project boundary circle */}
        <Circle
          center={[project.latitude, project.longitude]}
          radius={project.radius_meters}
          pathOptions={{
            color:       '#1D4ED8',
            fillColor:   '#1D4ED8',
            fillOpacity: 0.06,
            weight:      2,
            dashArray:   '8 5',
          }}
        />

        <ClickHandler onLocationSelect={onLocationSelect} />

        {/* Dropped pin */}
        {location && (
          <Marker position={[location.lat, location.lng]} icon={redPin} />
        )}
      </MapContainer>
    </div>
  )
}
