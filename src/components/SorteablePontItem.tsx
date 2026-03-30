import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListGroup, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faDotCircle, faTimes, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import styles from '../pages/Rotas.module.css'; // Reutilizando os estilos
import type { PontoTrajeto } from '../types/pontoTrajeto';

export function SortablePointItem({ point, index, onRemove }: {point: PontoTrajeto, index: number, onRemove: (i: number) => void}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, 
  } = useSortable({ id: point.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Adiciona uma opacidade menor e um z-index maior quando arrastando
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <ListGroup.Item ref={setNodeRef} style={style} className={styles.pointListItem}>
      {/* Ícone para "agarrar" o item */}
      <span {...attributes} {...listeners} className={styles.dragHandle}>
        <FontAwesomeIcon icon={faGripVertical} />
      </span>

      {/* Ícone do tipo de ponto */}
     {/*  {point.type === 'stop' ? 
        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-danger me-2"/> : 
        <FontAwesomeIcon icon={faDotCircle} className="text-secondary me-2"/>
      } */}

      {/* Nome e Coordenadas */}
      <span>Ponto {index + 1}</span>
      <Badge bg="light" text="dark" className="ms-auto">{point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}</Badge>

      {/* Botão de Remover */}
      <Button variant="light" size="sm" className="py-0 px-1" onClick={() => onRemove(index)}>
        <FontAwesomeIcon icon={faTimes}/>
      </Button>
    </ListGroup.Item>
  );
}