import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Delivery, Vehicle, Order } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

const URL = environment.url;
declare var window; // BACKGROUND GEOPOSITION


@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {
  
  token: string = null;
  private deliverys: Delivery[] = [];
  private vehicle: Vehicle;

  constructor(private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController) { }

  // ACTIVAR  BACKGROUND-GEOPOSITION
  async enableLocalizacionBackGround(){
    window.app.backgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        console.log('Si la disponibilidad esta encendida, y no esta corriendo el servicio, lo activamos');
        window.app.backgroundGeolocation.start(); // triggers start on start event
      }
    });  
  }

  async disableLocalizacionBackGround() {
    window.app.backgroundGeolocation.checkStatus( status => {
      if (status.isRunning) {
        window.app.backgroundGeolocation.stop();
      }
    }); 
  }


  // UPDATE STATUS DEL DESTINO - ON DEMAND
  async updateStatusDeliveryDestino(token: string, status: number): Promise<any> {

    await this.cargarToken();
    if (!this.token) { this.navCtrl.navigateRoot('/login'); }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    const params = { token, status }
    return await this.http.post(`${URL}/api/destination/update`, params, { headers }).toPromise();

  }


  // GET ENTREGA
  async getOrder(tokenx: string): Promise<any> {

    await this.cargarToken();
    if (!this.token) {      this.navCtrl.navigateRoot('/login');    }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.get<Order>(`${URL}/api/orders/get/` + tokenx, { headers }).toPromise();

  }

  // ACTUALIZAR EL ESTADO DE LA ENTREGA
  async finishOrder(token: string): Promise<any> {

    await this.cargarToken();
    await this.getVehicle();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }

    if (!this.vehicle) {
      this.navCtrl.navigateRoot('/main/tabs/tab2');
    }

    const params = { token }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.post(`${URL}/api/ondemand/update/delivery`, params, { headers }).toPromise();

  }

  // FUNCION PARA TRAER PEDIDOS PENDIENTES
  async getHistory(): Promise<any> {

    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.get<any>(`${URL}/api/orders/history`, { headers }).toPromise();

  }

  // FUNCION PARA TRAER PEDIDOS PENDIENTES
  async getDeliverys(): Promise<any>{
    
    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }
    const headers = new HttpHeaders({Authorization: 'Bearer ' + this.token });
    return await this.http.get<any>(`${URL}/api/orders/pendientes`, { headers }).toPromise();

  }

  // GET ENTREGA ACTIVA
  async getEntregaActiva(): Promise<any> {

    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.get<Delivery>(`${URL}/api/orders/activa`, { headers }).toPromise();
  }

  // GET ENTREGA
  async getDelivery(tokenx: string): Promise<any> {

    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }

    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.get<Delivery>(`${URL}/api/orders/view/` + tokenx, { headers }).toPromise();

  }

  //  GET VEHICLE ACTIVE
  async getVehicle(): Promise<any> {
    this.vehicle = await this.storage.get('vehicle') || null;
  }

  // FUNCION PARA ACTUALIZAR EL ESTADO DE UNA ENTREGA
  async updateStatusDelivery(tokenx:string, statusDelivery:number)
  {
    await this.cargarToken();

    if (!this.token) {
        this.navCtrl.navigateRoot('/login');
    }


    return new Promise(resolve => {
      
      const params = {tokenx, statusDelivery }
      const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
      this.http.post(`${URL}/api/orders/update/delivery`, params ,{ headers })
            .subscribe(resp => {
              console.log(resp);
              
              if (resp['status'] === 'ok') {
                resolve(true);

              } else {
                resolve(false);
              }

            });
    });
  }

  // ACTUALIZAR EL ESTADO DE LA ENTREGA
    async updateDelivery(tokenx: string, status_delivery:number): Promise<any> {

    await this.cargarToken();
    await this.getVehicle();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }

    if (!this.vehicle) {
      this.navCtrl.navigateRoot('/main/tabs/tab3');
    }

    const vehicle_id = this.vehicle.vehicle_id;
    const params = {tokenx, status_delivery, vehicle_id  }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.post(`${URL}/api/orders/update/delivery`, params, { headers }).toPromise();

  }

  // CANCELAR LA ENTREGA
  async cancel(tokenx: string): Promise<any> {

    await this.cargarToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }

    const params = {tokenx}
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.post(`${URL}/api/orders/cancel`, params, { headers }).toPromise();

  }

  // CALIFICAR LA ENTREGA
  async calificaEntrega(tokenx: string, ranking: number, actor: string, evalua: string): Promise<any> {

    await this.cargarToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }

    const params = { tokenx, ranking, actor, evalua }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.post(`${URL}/api/orders/ranking`, params, { headers }).toPromise();

  }

  // FUNCION PARA CARGAR Y VALIDAR TOKEN
  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  // SEND PUSH
  async sendPush(tokenx: string): Promise<any> {

    await this.cargarToken();
    if (!this.token) { this.navCtrl.navigateRoot('/login'); }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.post(`${URL}/api/orders/push/` + tokenx, null, { headers }).toPromise();

  }

}
