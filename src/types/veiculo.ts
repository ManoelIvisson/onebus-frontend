export interface Veiculo {
  id: number,
  modelo: string,
  tipo: string,
  placa: string,
  status: string,
  macEmbarcado: string,
  position: [number, number] | null
}