//import { Doughnut } from "react-chartjs-2";
import CardStatus from "../components/CardStatus";
import MapaVeiculos from "../components/MapaVeiculos";
//import styles from '../components/CardStatus.module.css'
import styles from './Dashboard.module.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from "react";
import axios from "axios";
import type { Veiculo } from "../types/veiculo";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [veiculoSelecionado] = useState<Veiculo | undefined>(undefined);
  const [veiculos, setVeiculos] = useState([]); 

  //const onlineVehicles = veiculos.filter(v => v.status !== 'Offline');
  //const statusCounts = veiculos.reduce((acc: any, vehicle) => {
  //  acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
  //  return acc;
  //}, {});

  //const chartData = {
  //  labels: ['Em Rota', 'Parado', 'Offline'],
  //  datasets: [{
  //    label: 'Status da Frota',
  //    //data: [statusCounts['Em Rota'] || 0, statusCounts['Parado'] || 0, statusCounts['Offline'] || 0],
  //    backgroundColor: ['#106F4C', '#636A73', '#d0d4da'],
  //    borderColor: '#FFFFFF',
  //    borderWidth: 3,
  //    hoverOffset: 4,
  //  }],
  //};

  //const chartOptions = {
  //  responsive: true,
  //  maintainAspectRatio: false,
  //  cutout: '70%',
  //  plugins: {
  //    legend: {
  //      display: true,
  //      position: 'bottom',
  //      labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' },
  //    },
  //  },
  //};

  //const handleVehicleSelect = (veiculo: any) => {
  //  setVeiculoSelecionado(veiculo);
  //}

  useEffect(() => {
    async function getVeiculosComPosicao() {
      const response = await axios.get('https://onebus-backend.onrender.com/veiculo/get-all/coord-atual');
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
                <CardStatus icone="fa-bus-side" titulo="Frota Total" valor={0} cor="total"/>
                <CardStatus icone="fa-satellite-dish" titulo="Ativos" valor={0} cor="online"/>
              </div>
              <div className={`card ${styles.mainCard} mt-4 flex-grow-1 d-flex flex-column`}>
                <div className="card-header">
                  Status dos veículos
                </div>
                <div className="card-body">
                  {/*<Doughnut data={chartData} options={chartOptions} />*/}
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
              <div className="card-body">
                <div className="table table-responsive">
                  <thead>
                    <tr>
                      <th>Veículo</th>
                      <th>Motorista</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*{onlineVehicles.map(v => (
                      <tr
                        key={v.id}
                        onClick={() => handleVehicleSelect(v)}
                        className={veiculoSelecionado?.id === v.id ? styles.selectedRow : ''}
                      >
                        <td><b>{v.id}</b><br /><small className={styles.vehicleName}>{v.name}</small></td>
                        <td>{v.driver}</td>
                        <td>
                          <div className={`${styles.statusBadge} bg-${v.status === 'Em Rota' ? 'success' : 'secondary'} rounded-pill`}>
                            {v.status}
                          </div>
                        </td>
                      </tr>
                    ))}*/}
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