import api from "../api/api";
import type { Motorista } from "../types/motorista";

export async function getMotoristas(): Promise<Motorista[]>{
  const response = await api.get("/motorista");
  return response.data.data.map((m: any) => ({
    id: m.id,
    nomeCompleto: m.nome_completo,
    cnh: m.cnh,
    cpf: m.cpf,
    status: m.status
  }));
}

export async function createMotoristaService(motorista: Motorista): Promise<Motorista>{
  const response = await api.post("/motorista", {
    nome_completo: motorista.nomeCompleto,
    cnh: motorista.cnh,
    cpf: motorista.cpf,
    senha: motorista.senha,
    status: motorista.status
  });
  return response.data.data.map((m: any) => ({
    id: m.id,
    nomeCompleto: m.nome_completo,
    cnh: m.cnh,
    cpf: m.cpf,
    status: m.status
  }));
}