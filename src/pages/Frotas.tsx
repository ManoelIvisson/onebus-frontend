import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, OverlayTrigger, Tooltip, type FormControlProps } from 'react-bootstrap';
import { faTruck, faSearch, faEdit, faTrashAlt, faPlus, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import styles from './Frotas.module.css';
import CardStatus from '../components/CardStatus';
import type { Motorista } from '../types/motorista';
import { useMotoristas } from '../hooks/useMotoristas';
import { putMotoristaService } from '../services/motoristaService';

const mockVehicles = [
  { plate: 'ONB-001', name: 'Ônibus 01', type: 'Ônibus', driverId: 1, status: 'Em Rota' },
  { plate: 'ONB-002', name: 'Ônibus 02', type: 'Ônibus', driverId: 2, status: 'Parado' },
  { plate: 'ONB-003', name: 'Ônibus 03', type: 'Ônibus', driverId: 3, status: 'Em Rota' },
  { plate: 'VAN-001', name: 'Van 01', type: 'Van', driverId: 5, status: 'Manutenção' },
  { plate: 'VAN-002', name: 'Van 02', type: 'Van', driverId: null, status: 'Disponível' },
];

function Frotas() {
  //const activeDrivers = mockDrivers.filter(d => d.status === 'Ativo').length;
  const initialMotorista: Motorista = {
    id: 0,
    nomeCompleto: "",
    cnh: "",
    cpf: "",
    senha: "",
    status: "ativo"
  };

  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewVehicleModal, setShowNewVehicleModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Motorista | null>(null);
  const [novoMotorista, setNovoMotorista] = useState<Motorista>(initialMotorista);
  const { motoristas, loading, error, refresh, createMotorista, editMotorista } = useMotoristas();

  const handleShowNewModal = () => {
    setNovoMotorista(initialMotorista);
    setShowNewModal(true)
  };
  const handleCloseNewModal = () => setShowNewModal(false);

  const handleShowEditModal = (driver: Motorista) => {
    setSelectedDriver(driver);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedDriver(null);
  };

  const handleShowDeleteModal = (driver: Motorista) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDriver(null);
  };

  const handleShowNewVehicleModal = () => setShowNewVehicleModal(true);
  const handleCloseNewVehicleModal = () => setShowNewVehicleModal(false);

  const handleSaveChanges = async () => {
    editMotorista(selectedDriver!);
    handleCloseEditModal();
  };

  const handleCreateDriver = () => {
    createMotorista(novoMotorista);
    handleCloseNewModal();
  };

  const handleDeleteDriver = () => {
    console.log("Deletando motorista:", selectedDriver);
    handleCloseDeleteModal();
  };

  const handleCreateVehicle = () => {
    console.log("Criando novo veículo...");
    handleCloseNewVehicleModal();
  }

  function handleChange(
    e: React.ChangeEvent<any>
  ) {
    const { name, value } = e.target;

    if (selectedDriver != null) {
      setSelectedDriver(prev => ({
        ...prev!,
        [name]: value
      }));
    } else {
      setNovoMotorista(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  useEffect(() => {
    console.log(selectedDriver)
  }, [selectedDriver])

  return (
    <div className={styles.driversPage}>
      <Container fluid>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Motoristas e Frota</h1>
          <p className={styles.pageSubtitle}>Gerencie seus motoristas e a alocação de veículos.</p>
        </header>

        <Row className="g-4 mb-4">
          <Col xl={4}><CardStatus icone={'fa-users'} titulo="Total de Motoristas" valor={motoristas.length} cor="total" /></Col>
          {/*<Col xl={4}><CardStatus icone={'fa-user-check'} titulo="Motoristas Ativos" valor={activeDrivers} cor="online" /></Col>*/}
          <Col xl={4}><CardStatus icone="fa-bus-side" titulo="Total de Veículos" valor={mockVehicles.length} cor="vehicles" /></Col>
        </Row>

        <Row>
          <Col lg={8} className="mb-4 mb-lg-0">
            <Card className={`${styles.mainCard} h-100`}>
              <Card.Header className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Motoristas Cadastrados</h5>
                <div className={styles.cardHeaderActions}>
                  <div className={styles.searchInputWrapper}>
                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                    <Form.Control type="text" placeholder="Buscar motorista..." className={styles.searchInput} />
                  </div>
                  <Button variant="primary" onClick={handleShowNewModal}><FontAwesomeIcon icon={faPlus} className="me-2" />Novo Motorista</Button>
                </div>
              </Card.Header>
              <div className={styles.tableWrapper}>
                <Table hover responsive className={styles.customTable}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Veículo Alocado</th>
                      <th>Status</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {motoristas.map(driver => (
                      <tr key={driver.id}>
                        <td><b>{driver.nomeCompleto}</b><br /><small className="text-muted">CNH: {driver.cnh}</small></td>
                        <td>
                          Placa do veiculo
                          {/*{driver.vehiclePlate
                            ? <Badge className={styles.plateBadge}>{driver.vehiclePlate}</Badge>
                            : <Badge bg="secondary">Nenhum</Badge>
                          }*/}
                        </td>
                        <td>
                          <Badge pill bg={driver.status === 'ativo' ? 'success' : 'secondary'}>
                            {driver.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}>
                            <Button variant="light" className={`${styles.actionButton} ${styles.actionButtonEdit}`} onClick={() => handleShowEditModal(driver)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger overlay={<Tooltip>Excluir</Tooltip>}>
                            <Button variant="light" className={`${styles.actionButton} ${styles.actionButtonDelete}`} onClick={() => handleShowDeleteModal(driver)}>
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className={`${styles.mainCard} h-100`}>
              <Card.Header className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Frota de Veículos</h5>
                <Button variant="outline-primary" size="sm" onClick={handleShowNewVehicleModal}><FontAwesomeIcon icon={faPlus} className="me-1" /> Novo</Button>
              </Card.Header>
              <div className={styles.tableWrapper}>
                <Table hover responsive className={styles.customTable}>
                  <thead>
                    <tr>
                      <th>Veículo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockVehicles.map(vehicle => (
                      <tr key={vehicle.plate}>
                        <td><b>{vehicle.plate}</b></td>
                        <td>
                          <Badge pill bg={vehicle.driverId ? 'success' : 'light'} text={vehicle.driverId ? 'white' : 'dark'}>
                            <FontAwesomeIcon icon={vehicle.driverId ? faCircleCheck : faCircleXmark} className="me-1" />
                            {vehicle.driverId ? 'Em Uso' : 'Livre'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* --- MODAIS --- */}
      <Modal show={showNewModal} onHide={handleCloseNewModal} centered>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title><FontAwesomeIcon icon={faPlus} className="me-2" />Cadastrar Novo Motorista</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNewDriverName">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control 
                type="text" 
                name="nomeCompleto"
                placeholder="Digite o nome do motorista" 
                value={novoMotorista?.nomeCompleto} 
                onChange={handleChange}
                autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewDriverCpf">
              <Form.Label>CPF</Form.Label>
              <Form.Control 
                type="text" 
                name="cpf"
                placeholder="Digite o cpf" 
                value={novoMotorista.cpf} 
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewDriverCNH">
              <Form.Label>CNH</Form.Label>
              <Form.Control 
                type="text" 
                name="cnh"
                placeholder="Digite a CNH" 
                value={novoMotorista.cnh} 
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewDriverPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control 
                type="password" 
                name="senha"
                placeholder="Digite uma senha" 
                value={novoMotorista?.senha} 
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleCloseNewModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleCreateDriver}>Salvar</Button>
        </Modal.Footer>
      </Modal>

      {selectedDriver && (
        <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title><FontAwesomeIcon icon={faEdit} className="me-2" />Editar Motorista</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formEditDriverName">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control 
                  type="text"
                  name='nomeCompleto' 
                  value={selectedDriver.nomeCompleto} 
                  onChange={handleChange}
                  autoFocus 
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEditDriverCNH">
                <Form.Label>CNH</Form.Label>
                <Form.Control 
                  type="text"
                  name='cnh' 
                  onChange={handleChange} 
                  value={selectedDriver.cnh} 
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEditDriverStatus">
                <Form.Label>Status</Form.Label>
                <Form.Select value={selectedDriver.status}>
                  <option value={"ativo"}>Ativo</option>
                  <option value={"inativo"}>Inativo</option>
                </Form.Select>
              </Form.Group>
            </Form>
            <Modal.Footer className={styles.modalFooter}>
              <Button variant="secondary" onClick={handleCloseEditModal}>Cancelar</Button>
              <Button variant="primary" onClick={handleSaveChanges}>Salvar Alterações</Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}

      {selectedDriver && (
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title><FontAwesomeIcon icon={faTrashAlt} className="me-2" />Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Você tem certeza que deseja excluir o motorista <strong>{selectedDriver.nomeCompleto}</strong>?
            <br />
            <small className="text-danger">Esta ação não poderá ser desfeita.</small>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancelar</Button>
            <Button variant="danger" onClick={handleDeleteDriver}>Confirmar Exclusão</Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={showNewVehicleModal} onHide={handleCloseNewVehicleModal} centered>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title><FontAwesomeIcon icon={faTruck} className="me-2" />Cadastrar Novo Veículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNewVehiclePlate">
              <Form.Label>Placa do Veículo</Form.Label>
              <Form.Control type="text" placeholder="Ex: ABC-1234" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewVehicleName">
              <Form.Label>Nome/Modelo do Veículo</Form.Label>
              <Form.Control type="text" placeholder="Ex: Ônibus 04" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewVehicleType">
              <Form.Label>Tipo</Form.Label>
              <Form.Select>
                <option>Ônibus</option>
                <option>Van</option>
                <option>Carro</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleCloseNewVehicleModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleCreateVehicle}>Salvar</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Frotas;