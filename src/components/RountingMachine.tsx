import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';
import type { PontoTrajeto } from '../types/pontoTrajeto';

const RoutingMachine = ({ pontos, isEditing }: {pontos: PontoTrajeto[], isEditing: boolean}) => {
    const map = useMap();

    useEffect(() => {
        if (!map || pontos.length < 2) return;

        const waypoints = pontos.map(p => L.latLng(p.latitude, p.longitude));
        console.log(waypoints)

        const routingControl = (L as any).Routing.control({
            waypoints: waypoints,
            router: (L as any).Routing.osrmv1({
                serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1'
            }),
            routeWhileDragging: false,
            addWaypoints: false, 
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: false, 
            createMarker: () => null, 
            lineOptions: {
                styles: [{
                    color: isEditing ? 'orange' : '#0d6efd', 
                    opacity: 0.8,
                    weight: 6
                }]
            }
        }).addTo(map);

        // Função de limpeza para remover a rota antiga ao atualizar
        return () => {
            map.removeControl(routingControl)
        };
    }, [map, pontos, isEditing]);

    return null;
};

export default RoutingMachine;