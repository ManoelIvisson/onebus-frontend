import { useState, useEffect } from 'react';
import { createMotoristaService, getMotoristas } from '../services/motoristaService';
import type { Motorista } from '../types/motorista';

export function useMotoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMotoristas() {
    try {
      setLoading(true);
      const data = await getMotoristas();
      setMotoristas(data);
    } catch (err) {
      setError('Erro ao carregar motoristas');
    } finally {
      setLoading(false);
    }
  }

  async function createMotorista(motorista: Motorista) {
  try {
    await createMotoristaService(motorista);
    await fetchMotoristas();
  } catch {
    setError('Erro ao criar motorista');
  }
}
    
  useEffect(() => {
    fetchMotoristas();
  }, []);

  return { motoristas, loading, error, refresh: fetchMotoristas, createMotorista };
}