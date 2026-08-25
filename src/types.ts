export type YesNo = 'SI' | 'NO'

export interface VehicleData {
  id: string
  vhc: string
  mma: string
  cargado: YesNo
  matricula: string
  averia: string
  origen: string
  destino: string
  base: string
}

export interface ServiceData {
  id: string
  createdAt: string
  cia: string
  expediente: string
  cliente: string
  telefono: string
  vehicles: VehicleData[]
  solicita: string
  autorizado: string
}
