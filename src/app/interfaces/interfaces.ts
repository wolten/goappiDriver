export interface Usuario {
    nombre?: string;
    celular?: string;
    pass?:string;
    confirm ?: string;
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
    ranking ?: string;
    canceladas ?:number;
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
    created_at ?: Date;
    comercio ?: Comercio;
    date_recolectado?: string;
    date_entregado?: string;
    date_aceptado?: string;
    direccion ?: Direccion;
    order ?: Order;
    rank_driver_cliente?: number;
    rank_driver_comercio?: number;
    status?: number;
    status_delivery?: number;
    tokenx?: string;
    total?: number;

    repartidor ?: Usuario;
    cliente ?: Cliente;
    telefono?: string;
    bussiness_coords?: string;
    bussiness_name?: string;
    bussiness_direccion?: string;
    entrega_nombre?: string;
    entrega_nombre2?: string;
    entrega_direccion?: string;
    entrega_short_direccion?: string;
    driver_name?: string;
    driver_coords?: string;
    driver_placa?: string;
    productos?: Producto[];
}

export interface Mensaje{
    titulo ?: string;
    mensaje ?: string;
    task ?: any;
    fecha ?: string;
}

export interface Direccion {
    status?: number;
    nombre?: string;
    tokenx?: string;
    calle?: string;
    colonia?: string;
    ciudad?: string;
    estado?: string;
    codigopostal?: string;

}

export interface Cliente {
    nombre?: string;
    apellido ?: string;
    email ?: string;
    telefono ?: string;
    url_profile ?: string;
    tokenx ?: string;
    created_at ?: Date;

}

export interface Comercio {
    nombre?: string;
    status?: number;
    web?: string;
    img_logo?: string;
    img_banner?: string;
    horario?: string;
    description?: string;
    calle?: string;
    no_exterior?: string;
    no_interior?: string;
    colonia?: string;
    ciudad?: string;
    estado?: string;
    codigo_postal?: string;
    coords?: string;
    telefono?: string;
    movil?: string;
    email?: string;
    nivel?: string;
    tokenx?: string;
}

export interface Destino{
    origen ?: string;
    destino ?: string;
    distance ?: number;
    duration ?: number;
    tokenx ?: string;
    fee_base ?: number;
    fee_distance ?: number;
    fee_duration ?: number;
    status ?: number;
    status_delivery ?: number;
}

export interface Order {
    created_at?: Date;
    programated_at ?: Date;
    fee_goppai?: number;     // 12%     (% / 100)
    fee_delivery?: number;   // 10%     (% / 100)
    fee_propina?: number;    // 15% 18% 20% 30% Others     (% / 100)
    fee_tax?: number;        // 11.5%     (% / 100)
    fee_payment?: number;    // 2.5% + 0.30
    fee_processing?: number;
    status?: number;
    status_pay?: number;
    tokenx?: string;
    total?: number;
    delivery?: Delivery;
    productos?: any;
    descripcion ?: string;
    destinations ?: Destino[];
    type ?: number;
}