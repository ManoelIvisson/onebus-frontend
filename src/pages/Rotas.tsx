import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faMapMarkerAlt, faDotCircle, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';

// --- IMPORTAÇÕES PARA DRAG AND DROP ---
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortablePointItem } from '../components/SorteablePontItem';

import styles from './Rotas.module.css';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from '../components/RountingMachine';
import type { PontoTrajeto } from '../types/pontoTrajeto';
import type { Trajeto } from '../types/trajeto';

// --- Ícones Customizados para o Mapa ---
/* const stopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
}); */
const streetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// Componente para interações do mapa
const MapEvents = ({ onMapClick, isEditing }: {onMapClick: (event: any) => void, isEditing: boolean}) => {
  useMapEvents({ click(e) { if (isEditing) { onMapClick(e.latlng); } }, });
  return null;
};
// Componente para ajustar a visão do mapa
const ChangeMapView = ({ pontos }: {pontos: PontoTrajeto[]}) => {
    const map = useMap();
    useEffect(() => { 
        if (pontos && pontos.length > 0) { 
            const bounds = L.latLngBounds(pontos.map(p => [p.latitude, p.longitude])); 
            map.fitBounds(bounds, { padding: [50, 50] }); } 
    }, [pontos, map]);
  return null;
}

function Rotas() {
  const initialTrajeto: Trajeto = {
    id: 0,
    nome: "",
    pontos: [],
    horarioInicio: "",
    horarioFinal: ""
  }
  const [rotas] = useState<Trajeto[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Trajeto | null>(null);
  const [editingRoute, setEditingRoute] = useState<Trajeto | null>(null);
  const [pointType, setPointType] = useState('stop');

  // --- CONFIGURAÇÃO DO DND-KIT ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSelectRoute = (rota: Trajeto) => { setSelectedRoute(rota); setEditingRoute(initialTrajeto); };
  const handleStartNewRoute = () => { setSelectedRoute(null); setEditingRoute(initialTrajeto); };
  const handleEditRoute = (rota: Trajeto) => { setSelectedRoute(rota); setEditingRoute({ ...rota }); };
  const handleCancel = () => { setEditingRoute(null); setSelectedRoute(rotas[0] || null); };
  const handleFormChange = (e: React.ChangeEvent<any>) => { 
  const { name, value } = e.target; 
    setEditingRoute(prev => ({ 
      ...prev!, 
      [name]: value 
    })); 
  };


  const handleMapClick = (latlng: LatLng) => {
    if (editingRoute) {
        console.log(latlng)
      const newPoint: PontoTrajeto = { id: editingRoute.pontos.length + 1, latitude: latlng.lat, longitude: latlng.lng, eOrigem: true, eDestino: false };
      setEditingRoute(prev => ({ ...prev!, pontos: [...prev!.pontos, newPoint] }));
    }
  };

  const handleRemovePoint = (indexToRemove: number) => {
    setEditingRoute(prev => ({
      ...prev!,
      points: prev!.pontos.filter((_, index:number) => index !== indexToRemove)
    }));
  };

  // --- NOVA FUNÇÃO: Lida com o fim do arraste ---
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setEditingRoute(prev => {
        const oldIndex = prev!.pontos.findIndex(p => p.id === active.id);
        const newIndex = prev!.pontos.findIndex(p => p.id === over.id);
        return { ...prev!, points: arrayMove(prev!.pontos, oldIndex, newIndex) };
      });
    }
  };

  const pointsOnMap = editingRoute ? editingRoute.pontos : (selectedRoute ? selectedRoute.pontos : []);

  return (
    <div className={styles.routesPage}>
      <Container fluid>
        <Row>
          {/* COLUNA ESQUERDA - LISTA E FORMULÁRIO */}
          <Col lg={4} className={styles.leftPanel}>
            {!editingRoute ? (
              // ... (Modo de visualização, com os botões de editar/excluir) ...
              <Card className={styles.panelCard}>
                <Card.Header className={styles.panelHeader}>
                  <h5 className={styles.panelTitle}>Rotas Cadastradas</h5>
                  <Button variant="primary" size="sm" onClick={handleStartNewRoute}><FontAwesomeIcon icon={faPlus} className="me-2" />Nova Rota</Button>
                </Card.Header>
                <ListGroup variant="flush" className={styles.routeList}>
                  {rotas.map(rota => (
                    <ListGroup.Item key={rota.id} action onClick={() => handleSelectRoute(rota)} active={selectedRoute?.id === rota.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{rota.nome}</strong>
                        <small className="d-block text-muted">{rota.pontos.length} pontos</small>
                      </div>
                      <div>
                        <Button variant="light" size="sm" className="me-2" onClick={(e) => { e.stopPropagation(); handleEditRoute(rota); }}><FontAwesomeIcon icon={faEdit} /></Button>
                        <Button variant="light" size="sm" className={styles.deleteButton}><FontAwesomeIcon icon={faTrashAlt} /></Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            ) : (
              // --- MODO DE EDIÇÃO ATUALIZADO ---
              <Card className={styles.panelCard}>
                <Card.Header className={styles.panelHeader}>
                  <Button variant="light" size="sm" onClick={handleCancel} className="me-2"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                  <h5 className={styles.panelTitle}>{editingRoute.nome ? 'Editar Rota' : 'Nova Rota'}</h5>
                </Card.Header>
                <Card.Body className={styles.formPanel}>
                  {/* ... (Formulário de nome, serviço, veículo como antes) ... */}
                  <Form>
                    <Form.Group className="mb-3"><Form.Label>Nome da Rota</Form.Label><Form.Control type="text" name="name" value={editingRoute.nome} onChange={handleFormChange} /></Form.Group>
                    <hr />
                    <Form.Group className="mb-3"><Form.Label>Adicionar Pontos</Form.Label><div className={styles.pointTypeSelector}><Form.Check type="radio" id="type-stop" label={<><FontAwesomeIcon icon={faMapMarkerAlt} className="text-danger" /> Parada</>} name="pointType" inline checked={pointType === 'stop'} onChange={() => setPointType('stop')} /><Form.Check type="radio" id="type-street" label={<><FontAwesomeIcon icon={faDotCircle} className="text-secondary" /> Rua</>} name="pointType" inline checked={pointType === 'street'} onChange={() => setPointType('street')} /></div></Form.Group>

                    {/* --- LISTA DE PONTOS REORDENÁVEL --- */}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <ListGroup className={styles.pointList}>
                        <SortableContext items={editingRoute.pontos} strategy={verticalListSortingStrategy}>
                          {editingRoute.pontos.map((point, index) => (
                            <SortablePointItem key={point.id} point={point} index={index} onRemove={handleRemovePoint} />
                          ))}
                        </SortableContext>
                      </ListGroup>
                    </DndContext>
                  </Form>
                </Card.Body>
                <Card.Footer className="text-end">
                  <Button variant="secondary" className="me-2" onClick={handleCancel}>Cancelar</Button>
                  <Button variant="primary"><FontAwesomeIcon icon={faSave} className="me-2" />Salvar Rota</Button>
                </Card.Footer>
              </Card>
            )}
          </Col>

          {/* COLUNA DIREITA - MAPA */}
          <Col lg={8} className={styles.rightPanel}>
            <MapContainer center={[-6.26, -36.52]} zoom={14} className={styles.mapContainer}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              <MapEvents onMapClick={handleMapClick} isEditing={!!editingRoute} />
              <RoutingMachine pontos={pointsOnMap} isEditing={!!editingRoute} />
              {pointsOnMap.map((ponto) => (
                <Marker key={ponto.id} position={[ponto.latitude, ponto.longitude]} icon={streetIcon}  />
              ))}
              <ChangeMapView pontos={pointsOnMap} />
            </MapContainer>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Rotas;