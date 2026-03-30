import type { PontoTrajeto } from "./pontoTrajeto";

export interface Trajeto {
    id: number,
    nome: string,
    pontos: PontoTrajeto[],
    horarioInicio: string,
    horarioFinal: string
}