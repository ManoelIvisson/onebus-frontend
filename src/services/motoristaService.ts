import api from "../api/api";
import type { Motorista } from "../types/motorista";

export async function getMotoristas(): Promise<Motorista[]>{
  const response = await api.get("/motorista");
  return response.data.data;
}

export async function postMotoristaService(motorista: Motorista): Promise<Motorista>{
  const response = await api.post("/motorista", motorista);

  return response.data.data;
}

export async function putMotoristaService(motorista: Motorista): Promise<Motorista>{
  const response = await api.put(`/motorista/${motorista.id}`, motorista);

  return response.data.data;
}