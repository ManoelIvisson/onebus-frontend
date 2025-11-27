import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet'; 
import type { Veiculo } from '../types/veiculo';

function MudarVisaoMapa({ centro, zoom }: {centro: LatLngExpression | null, zoom: number}) {
    const mapa = useMap();
    useEffect(() => {
        if (centro) {
            mapa.flyTo(centro, zoom, {
                animate: true,
                duration: 1.5
            });
        }
    }, [centro, zoom, mapa]);
    return null;
}

const iconeVeiculo = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});

const iconeInicio = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const iconeFinal = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


function MapaVeiculos({ veiculos, veiculoSelecionado }: {veiculos: any, veiculoSelecionado: Veiculo | undefined}) {
    // Posição inicial do mapa (Centro de Currais Novos, RN)
    const posicaoInicial: LatLngExpression = [-6.2605, -36.52];
    const [centroMapa, setCentroMapa] = useState<LatLngExpression | null>(null);

    useEffect(() => {
      if (veiculoSelecionado) {
        setCentroMapa(veiculoSelecionado?.position)
      }
    }, [veiculoSelecionado])

    return (
        <MapContainer center={posicaoInicial} zoom={13} style={{height: "100%", width: "100%"}}>
            <MudarVisaoMapa centro={centroMapa} zoom={veiculoSelecionado ? 16 : 13} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {veiculos.map((veiculo: any) => (
                veiculo.coordenada_atual &&
                <Marker key={veiculo.id} position={[veiculo.coordenada_atual.latitude, veiculo.coordenada_atual.longitude]} icon={iconeVeiculo}>
                    <Popup>
                        <b>{veiculo.modelo} ({veiculo.id})</b><br />
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export { iconeVeiculo, iconeInicio, iconeFinal };
export default MapaVeiculos;