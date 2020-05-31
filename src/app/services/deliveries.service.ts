import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Delivery } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {
  
  token: string = null;
  private deliverys: Delivery[] = [];

  constructor(private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController) { }






  // FUNCION PARA TRAER PEDIDOS PENDIENTES
  async getDeliverys(): Promise<any>{
    
    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.token });
    return await this.http.get<any>(`${URL}/api/orders/pendientes`, { headers }).toPromise();

  }

  // GET ENTREGA
  async getEntrega(): Promise<any> {

    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return await this.http.get<Delivery>(`${URL}/api/orders/activa`, { headers }).toPromise();

  }

  // FUNCION PARA ACTUALIZAR EL ESTADO DE UNA ENTREGA
  async updateStatusDelivery(tokenx:string, statusDelivery:number)
  {
    await this.cargarToken();

    if (!this.token) {
        this.navCtrl.navigateRoot('/login');
    }


    return new Promise(resolve => {
      
      const params = {'tokenx': tokenx,
                      'status_delivery': statusDelivery  }

      const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
      this.http.post(`${URL}/api/orders/update/delivery`, params ,{ headers })
            .subscribe(resp => {
              console.log(resp);
              
              if (resp['status'] == 'ok') {
                resolve(true);

              } else {
                resolve(false);
              }

            });
    });
  }

  async updateDelivery(tokenx: string, statusDelivery:number): Promise<any> {

    await this.cargarToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }

    const params = {
      'tokenx': tokenx,
      'status_delivery': statusDelivery
    }
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return await this.http.post(`${URL}/api/orders/update/delivery`, params, { headers }).toPromise();

  }








  // FUNCION PARA CARGAR Y VALIDAR TOKEN
  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }


}
