export interface Motorista {
  id: number,
  nomeCompleto: string,
  cnh: string,
  cpf: string,
  senha: string,
  status: 'ativo' | 'inativo'
}