import axios from "axios";
import type { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

function EventosMapa({ onClickMap }: {onClickMap: (coordenadas: LatLng) => void}) {
  useMapEvents({
    click(e) {
      onClickMap(e.latlng);
    } 
  })

  return null;
}

function Viagens() {
  const [coordenadas, setCoordenadas] = useState<LatLng[]>([]);

  function adicionarCoordenada(coordenada: LatLng) {
    setCoordenadas(prev => [...prev, coordenada])
  }

  useEffect(() => {
    async function getViagemComCoordenadas() {
      const response = await axios.get('https://onebus-backend.onrender.com/viagem/get/coord/1');
      const data = response.data;

      if (data.coordenadas.length > 0) {
        const coordenadas = data.coordenadas.map((c: any) => ({
          "lat": c.latitude,
          "lng": c.longitude
        }))

        setCoordenadas(coordenadas);
      }   
    }
    
    const interval = setInterval(getViagemComCoordenadas, 10000);
    return () => {
      clearInterval(interval);
    }
  }, [])



  return (
    <MapContainer center={[-6.26, -36.52]} zoom={13} style={{height: "600px", width: "800px"}}>
      <TileLayer attribution='&copy; 
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />
      <EventosMapa onClickMap={adicionarCoordenada} />

      {coordenadas.map((position, i) => (
        <Marker key={i} position={position} />
      ))}

    </MapContainer>
  )
}

export default Viagens;