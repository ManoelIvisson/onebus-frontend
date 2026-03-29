import api from "../api/api";
import type { Veiculo } from "../types/veiculo";

export async function getVeiculos(): Promise<Veiculo[]>{
  const response = await api.get("/veiculo");
  return response.data.data;
}

export async function postVeiculoService(veiculo: Veiculo): Promise<Veiculo>{
  const response = await api.post("/veiculo", veiculo);

  return response.data.data;
}

export async function putVeiculoService(veiculo: Veiculo): Promise<Veiculo>{
  const response = await api.put(`/veiculo/${veiculo.id}`, veiculo);

  return response.data.data;
}