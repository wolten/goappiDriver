export interface Usuario {
    nombre?: string;
    celular?: string;
    pass?:string;
    status?:number;
    status_drive?:number;
    tokenx?:string;
    url_profile?: string;
    pushtoken?:string;
    lat?:number;
    lng?:number;
    today?: Delivery[];
    todas ?: number;
    date_nacimiento?:string;
    vehicles ?: Vehicle[];
    entregaEnCurso ?: Delivery;
}
export interface Vehicle {
    placa ?: string;
    marca ?:string;
    modelo ?: string;
    color ?: string;
    status ?: string;
    tokenx ?: string;
    year ?: string;
    vehicle_id ?:number;

}

export interface Producto {
    cantidad ?:string;
    nombre ?: string;
    valorUnitario ?: string;
    detalle ?:string;
    tokenp ?: string;
    url_pic ?:string;
}

export interface Delivery
{
    tokenx?:string;
    telefono ?: string;
    bussiness_name ?: string;
    bussiness_direccion ?: string;
    entrega_nombre ?: string;
    entrega_nombre2 ?:string;
    entrega_direccion ?: string;
    entrega_short_direccion?: string;
    total ?:number;
    comision ?:number;
    status ?: number;
    status_delivery ?:number;
    ranking ?:number;
    driver_id ?: number;
    driver_name ?: string;
    driver_coords ?: string;
    driver_placa ?: string;
    fecha ?:string;
    hora ?: string;
    productos ?: Producto[];
    date_recolectado ?: string;
    date_entregado ?: string;
    date_aceptado?: string;
    date_delivery ?:string;

}