/**
 * Read-only map for the county dashboard.
 * Shows all reports as colored dots clustered by proximity.
 * The project boundary is shown as a dashed blue circle.
 */
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'react-leaflet-cluster/lib/assets/MarkerCluster.css'
import 'react-leaflet-cluster/lib/assets/MarkerCluster.Default.css'
import IssueTypeBadge from './IssueTypeBadge'
import { ISSUE_MAP }  from '../lib/constants'
import { formatDateTime } from '../lib/utils'

/** Create a small colored circle marker icon for each issue type */
function makeIcon(color) {
  return L.divIcon({
    html: `<div style="
      width:14px;height:14px;
      border-radius:50%;
      background:${color};
      border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,0.35);
    "></div>`,
    className: '',
    iconSize:   [14, 14],
    iconAnchor: [7, 7],
  })
}

const ICONS = Object.fromEntries(
  Object.entries(ISSUE_MAP).map(([key, cfg]) => [key, makeIcon(cfg.color)])
)

export default function ReportsMap({ project, reports }) {
  if (!project) return null

  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
      style={{ height: '440px' }}
    >
      <MapContainer
        center={[project.latitude, project.longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Project boundary */}
        <Circle
          center={[project.latitude, project.longitude]}
          radius={project.radius_meters}
          pathOptions={{
            color:       '#1D4ED8',
            fillColor:   '#1D4ED8',
            fillOpacity: 0.05,
            weight:      2,
            dashArray:   '8 5',
          }}
        />

        {/* Clustered report markers */}
        <MarkerClusterGroup chunkedLoading>
          {reports.map(report => {
            const icon = ICONS[report.issue_type] ?? ICONS['other']
            return (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={icon}
              >
                <Popup>
                  <div className="text-sm space-y-1 min-w-[160px]">
                    <IssueTypeBadge type={report.issue_type} size="md" />
                    {report.comment && (
                      <p className="text-gray-700 leading-snug">{report.comment}</p>
                    )}
                    <p className="text-gray-400 text-xs">{formatDateTime(report.created_at)}</p>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
