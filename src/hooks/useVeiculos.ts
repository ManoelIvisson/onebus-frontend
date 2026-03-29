import { useState, useEffect } from 'react';
import type { Veiculo } from '../types/veiculo';
import { getVeiculos, postVeiculoService, putVeiculoService } from '../services/veiculoService';

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchVeiculos() {
    try {
      setLoading(true);
      const data = await getVeiculos();
      setVeiculos(data);
    } catch (err) {
      setError('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  }

  async function createVeiculo(veiculo: Veiculo) {
    try {
      await postVeiculoService(veiculo);
      await fetchVeiculos();
    } catch {
      setError('Erro ao criar motorista');
    }
  }

  async function editVeiculo(motorista: Veiculo) {
    try {
      await putVeiculoService(motorista);
      await fetchVeiculos();
    } catch {
      setError('Erro ao criar motorista');
    }
  }
    
  useEffect(() => {
    fetchVeiculos();
  }, []);

  useEffect(() => {
    console.log(veiculos)
  }, [veiculos])

  return { veiculos, loading, error, refresh: fetchVeiculos, createVeiculo, editVeiculo };
}