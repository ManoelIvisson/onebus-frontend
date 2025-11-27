export interface Veiculo {
  id: number | null,
  modelo: string,
  tipo: string,
  placa: string,
  status: string,
  position: [number, number]
}