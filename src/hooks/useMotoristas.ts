import { useState, useEffect } from 'react';
import { postMotoristaService, getMotoristas, putMotoristaService, deleteMotoristaService } from '../services/motoristaService';
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
      await postMotoristaService(motorista);
      await fetchMotoristas();
    } catch {
      setError('Erro ao criar motorista');
    }
  }

  async function editMotorista(motorista: Motorista) {
    try {
      await putMotoristaService(motorista);
      await fetchMotoristas();
    } catch {
      setError('Erro ao criar motorista');
    }
  }

  async function deleteMotorista(motoristaId: number) {
    try {
      await deleteMotoristaService(motoristaId);
      await fetchMotoristas();
    } catch {
      setError('Erro ao criar motorista');
    }
  }
    
  useEffect(() => {
    fetchMotoristas();
  }, []);

  return { 
    motoristas, 
    loading, 
    error, 
    refresh: fetchMotoristas, 
    createMotorista, 
    editMotorista,
    deleteMotorista
  };
}