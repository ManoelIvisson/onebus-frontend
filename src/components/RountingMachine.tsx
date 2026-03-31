import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import type { PontoTrajeto } from '../types/pontoTrajeto';

const RoutingMachine = ({ pontos, isEditing }: { pontos: PontoTrajeto[], isEditing: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || pontos.length < 2) return;

    let polyline: L.Polyline | null = null;

    const getRoute = async () => {
      try {
        const response = await fetch("http://localhost:5000/route", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                coordinates: pontos.map(p => [p.longitude, p.latitude])
            })
            });

        const data = await response.json();
        console.log(data)

        const geometry = data.routes[0].geometry;

        const decoded: L.LatLngExpression[] = decodePolyline(geometry) as [number, number][];

        if (polyline) {
          map.removeLayer(polyline);
        }

        // desenha nova rota
        polyline = L.polyline(decoded, {
          color: isEditing ? 'orange' : '#0d6efd',
          weight: 6,
          opacity: 0.8
        }).addTo(map);

        map.fitBounds(polyline.getBounds());

      } catch (error) {
        console.error("Erro ao buscar rota:", error);
      }
    };

    getRoute();

    return () => {
      if (polyline) {
        map.removeLayer(polyline);
      }
    };
  }, [map, pontos, isEditing]);

  return null;
};

export default RoutingMachine;


/// 🔧 Função pra decodificar polyline (OpenRouteService usa encoded polyline)
function decodePolyline(encoded: string) {
  let points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}