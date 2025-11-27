import { Doughnut } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { Veiculo } from "../types/veiculo";

function GraficoDoughnut({veiculos}: {veiculos: Veiculo[]}) {
  const statusCounts = veiculos.reduce((acc: any, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ['Ativo', 'Inativo', 'Offline'],
    datasets: [{
      label: 'Status da Frota',
      data: [statusCounts['ativo'] || 0, statusCounts['inativo'] || 0, statusCounts['Offline'] || 0],
      backgroundColor: ['#106F4C', '#636A73', '#d0d4da'],
      borderColor: '#FFFFFF',
      borderWidth: 3,
      hoverOffset: 4,
    }],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' },
      },
    },
  };

  return (
    <Doughnut data={chartData} options={chartOptions} />
  )
}

export default GraficoDoughnut;