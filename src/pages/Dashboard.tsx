//import { Doughnut } from "react-chartjs-2";
import CardStatus from "../components/CardStatus";
import MapaVeiculos from "../components/MapaVeiculos";
//import styles from '../components/CardStatus.module.css'
import styles from './Dashboard.module.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from "react";
import type { Veiculo } from "../types/veiculo";
import api from "../api/api";
import GraficoDoughnut from "../components/GraficoDoughnut";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | undefined>(undefined);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]); 
  const [veiculosAtivos, setVeiculosAtivos] = useState<Veiculo[]>([]);

  const handleVehicleSelect = (veiculo: any) => {
    setVeiculoSelecionado(veiculo);
  }

  useEffect(() => {
    async function getVeiculosComPosicao() {
      const response = await api.get('/veiculo/get-all/coord-atual');
      const veiculos = response.data.data;

      if (veiculos.length > 0) {
        console.log(veiculos)
        setVeiculos(veiculos);
      }   
    }
    
    const interval = setInterval(getVeiculosComPosicao, 10000);
    return () => {
      clearInterval(interval);
    }
  }, [])

  useEffect(() => {
    setVeiculosAtivos(veiculos.filter(v => v.status == 'ativo'));
    console.log(veiculos)
  }, [veiculos])

  return (
    <div className="p-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className={`card ${styles.mainCard} shadow-sm border-0 rounded-4 h-100 d-flex flex-column overflow-hidden`}>
              <div className="card-header border-0 p-3 bg-white rounded-4">
                Localização da frota em tempo real
              </div>
              <div className="card-body flex-grow-1 p-0 overflow-hidden" style={{height: "400px"}}>
                <MapaVeiculos veiculos={veiculos} veiculoSelecionado={veiculoSelecionado} />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="h-100 d-flex-flex-column">
              <div className="row gap-2 flex-row justify-content-between">
                <CardStatus icone="fa-bus-side" titulo="Frota Total" valor={veiculos.length} cor="total"/>
                <CardStatus icone="fa-satellite-dish" titulo="Ativos" valor={veiculosAtivos.length} cor="online"/>
              </div>
              <div className={`card ${styles.mainCard} mt-4 flex-grow-1 d-flex flex-column`}>
                <div className="card-header">
                  Status dos veículos
                </div>
                <div className="card-body">
                  <GraficoDoughnut veiculos={veiculos} />
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <div className={`card ${styles.mainCard}`}>
              <div className="card-header">
                Veículos Ativos
              </div>
              <div className={`card-body ${styles.tableWrapper}`}>
                <div className={`table table-responsive ${styles.vehicleTable}`}>
                  <thead>
                    <tr>
                      <th>Veículo</th>
                      <th>Motorista</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {veiculosAtivos.map(v => (
                      <tr
                        key={v.id}
                        onClick={() => handleVehicleSelect(v)}
                        className={veiculoSelecionado?.id === v.id ? styles.selectedRow : ''}
                      >
                        <td><b>{v.id}</b><br /><small className={styles.vehicleName}>{v.modelo}</small></td>
                        {/*<td>{v.driver}</td>*/}
                        <td>
                          <div className={`${styles.statusBadge} bg-${v.status === 'Em Rota' ? 'success' : 'secondary'} rounded-pill`}>
                            {v.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;