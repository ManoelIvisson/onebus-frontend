import axios from "axios";
import type { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";

function EventosMapa({ onClickMap }: {onClickMap: (coordenadas: LatLng) => void}) {
  useMapEvents({
    click(e) {
      onClickMap(e.latlng);
    } 
  })

  return null;
}

function Trajetos() {
  const [coordenadas, setCoordenadas] = useState<LatLng[]>([]);
  const [rota, setRota] = useState<LatLng[]>([]);

  function adicionarCoordenada(coordenada: LatLng) {
    setCoordenadas(prev => [...prev, coordenada])
  }

  useEffect(() => {
    if (coordenadas.length < 2) return;
    calcularRota(coordenadas);
  }, [coordenadas])

  async function calcularRota(coordenadas: LatLng[]) {
    const conjuntoCoordenadas = coordenadas.map(p => `${p.lng},${p.lat}`).join(";");
    const url = `http://localhost:5000/route/v1/driving/${conjuntoCoordenadas}?geometries=geojson&overview=full`;
    const resposta = await axios.get(url);
    const data = await resposta.data; 

    const coordsLatLng = data.routes[0].geometry.coordinates
      .map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);

    setRota(coordsLatLng);
  }

  return (
    <MapContainer center={[-6, -36]} zoom={13} style={{height: "600px", width: "800px"}}>
      <TileLayer attribution='&copy; 
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />
      <EventosMapa onClickMap={adicionarCoordenada} />

      {coordenadas.map((position, i) => (
        <Marker key={i} position={position} />
      ))}

      {rota.length > 0 && (
        <Polyline positions={rota} color="blue" />
      )}

    </MapContainer>
  )
}

export default Trajetos;