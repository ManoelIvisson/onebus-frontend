import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, OverlayTrigger, Tooltip, type FormControlProps } from 'react-bootstrap';
import { faTruck, faSearch, faEdit, faTrashAlt, faPlus, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import styles from './Frotas.module.css';
import CardStatus from '../components/CardStatus';
import type { Motorista } from '../types/motorista';
import { useMotoristas } from '../hooks/useMotoristas';
import { useVeiculos } from '../hooks/useVeiculos';
import type { Veiculo } from '../types/veiculo';

function Frotas() {
  //const activeDrivers = mockDrivers.filter(d => d.status === 'Ativo').length;
  const initialMotorista: Motorista = {
    id: 0,
    nomeCompleto: "",
    cnh: "",
    cpf: "",
    senha: "",
    status: "ativo",
    veiculoId: 0
  };

  const initialVeiculo: Veiculo = {
    id: 0,
    modelo: "",
    tipo: "",
    placa: "",
    status: "ativo",
    position: null,
    macEmbarcado: ""
  };

  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewVehicleModal, setShowNewVehicleModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Motorista | null>(null);
  const [novoMotorista, setNovoMotorista] = useState<Motorista>(initialMotorista);
  const [novoVeiculo, setNovoVeiculo] = useState<Veiculo>(initialVeiculo);
  const { motoristas, createMotorista, editMotorista } = useMotoristas();
  const { veiculos, createVeiculo } = useVeiculos();

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
    createVeiculo(novoVeiculo);
    handleCloseNewVehicleModal();
  }

  function handleChangeMotorista(
    e: React.ChangeEvent<any>
  ) {
    const { name, value } = e.target;
    console.log(name, value)

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

  function handleChangeVeiculo(
    e: React.ChangeEvent<any>
  ) {
    const { name, value } = e.target;
    setNovoVeiculo(prev => ({
      ...prev,
      [name]: value
    }));
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
          <Col xl={4}><CardStatus icone="fa-bus-side" titulo="Total de Veículos" valor={veiculos.length} cor="vehicles" /></Col>
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
                    {veiculos.map(veiculo => (
                      <tr key={veiculo.placa}>
                        <td><b>{veiculo.placa}</b></td>
                        <td>
                         {/* * <Badge pill bg={veiculo.driverId ? 'success' : 'light'} text={veiculo.driverId ? 'white' : 'dark'}>
                            <FontAwesomeIcon icon={veiculo.driverId ? faCircleCheck : faCircleXmark} className="me-1" />
                            {veiculo.driverId ? 'Em Uso' : 'Livre'}
                          </Badge> */}
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
                onChange={handleChangeMotorista}
                autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewDriverCpf">
              <Form.Label>CPF</Form.Label>
              <Form.Control 
                type="text" 
                name="cpf"
                placeholder="Digite o cpf" 
                value={novoMotorista.cpf} 
                onChange={handleChangeMotorista}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewDriverCNH">
              <Form.Label>CNH</Form.Label>
              <Form.Control 
                type="text" 
                name="cnh"
                placeholder="Digite a CNH" 
                value={novoMotorista.cnh} 
                onChange={handleChangeMotorista}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewDriverPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control 
                type="password" 
                name="senha"
                placeholder="Digite uma senha" 
                value={novoMotorista?.senha} 
                onChange={handleChangeMotorista}
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
                  onChange={handleChangeMotorista}
                  autoFocus 
                />
              </Form.Group>
              <div className='d-flex justify-content-between'>
                <Form.Group className="mb-3 col-5" controlId="formEditDriverCNH">
                  <Form.Label>CNH</Form.Label>
                  <Form.Control
                    type="text"
                    name='cnh'
                    onChange={handleChangeMotorista}
                    value={selectedDriver.cnh}
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-6" controlId="formEditDriverVeiculo">
                  <Form.Label>Vincular veículo</Form.Label>
                  <Form.Select 
                    name='veiculoId'
                    onChange={handleChangeMotorista}
                    value={selectedDriver.veiculoId ?? ""}   
                  >
                    <option value="">Selecionar motorista</option>
                    {veiculos.map(veiculo => {
                       console.log("veiculo.id:", veiculo.id);
                       return (
                        <option key={veiculo.id} value={veiculo.id}>
                          fdsfsdfs
                        </option>
                    )})}
                  </Form.Select>
                </Form.Group>
              </div>
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
              <Form.Control 
                type="text" 
                name='placa'
                placeholder="Ex: ABC-1234" 
                value={novoVeiculo.placa}
                onChange={handleChangeVeiculo}
                autoFocus 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewVehicleName">
              <Form.Label>Nome/Modelo do Veículo</Form.Label>
              <Form.Control 
                type="text"   
                name='modelo'
                placeholder="Ex: Ônibus 04" 
                value={novoVeiculo.modelo}
                onChange={handleChangeVeiculo}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewVehicleMac">
              <Form.Label>MAC do embarcado</Form.Label>
              <Form.Control 
                type="text" 
                name='macEmbarcado'
                placeholder="" 
                value={novoVeiculo.macEmbarcado}
                onChange={handleChangeVeiculo}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewVehicleType">
              <Form.Label>Tipo</Form.Label>
              <Form.Select name='tipo' value={novoVeiculo.tipo} onChange={handleChangeVeiculo}>
                <option value={"Ônibus"}>Ônibus</option>
                <option value={"Van"}>Van</option>
                <option value={"Carro"}>Carro</option>
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