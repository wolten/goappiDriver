import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Usuario, Vehicle } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { UiServiceService } from './ui-service.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  private vehicle: Vehicle;
  private usuario: Usuario = {};
  playerID: string = null;

  constructor(private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController,
    private uiService: UiServiceService,
    private fileTransfer: FileTransfer) { }


  async login(celular : string, pass: string) {

    await this.getPlayerID();
    const data = { celular , pass, playerID: this.playerID };

    return await new Promise(resolve => {

      this.http.post(`${URL}/api/driver/signin`, data)
        .subscribe(async resp => {

          console.log(resp);

          if (resp['status'] === 'ok') {

            await this.guardarToken(resp['token']);
            resolve(true); 

          } else {
            this.token = null;
            this.storage.clear();
            resolve(false);
          }

        }, err => {  console.log('ERRRRORSOTE: ', err);  resolve(false)  });
    });

  }
  async register(celular: string, nombre: string, pass: string): Promise<any>{
    await this.getPlayerID();
    
    const data = { celular, pass, nombre, playerID: this.playerID };
    return this.http.post(`${URL}/api/driver/signup`, data).toPromise();
  }
  async setDisponibilidad(status: number): Promise<any>{
    
    await this.cargarToken();

    if (!this.token) {   this.navCtrl.navigateRoot('/login');    }

    const params  = { 'status_drive': status }
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return await this.http.post<any>(`${URL}/api/driver/status`, params, { headers }).toPromise();

    
  }
  async sendPosition(lat: number, lng: number): Promise<any> {

    await this.cargarToken();

    if (!this.token) { this.navCtrl.navigateRoot('/login'); }

    const params = { lat, lng }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.post<any>(`${URL}/api/driver/refresh/coords`, params, { headers }).toPromise();
  }
  async guardarToken(token: string) {

    this.token = token;
    await this.storage.set('token', token);
    await this.validaToken();
  }
  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }
  async getPlayerID(){
    this.playerID = await this.storage.get('playerID') || null;
  }
  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    if (!this.token){ 
      console.log('NO HAY TOKEN [function validaToken]', this.token);
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }


    // SI TENEMOS UN TOKEN EN STORAGE, OBTENEMOS EL USUARIO, LO GUARDAMOS EN STORAGE
    return new Promise<boolean>(resolve => {
      console.log('GET USUARIO (HTTP)', this.token);
      
      const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token   });
      this.http.get(`${URL}/api/driver/man`, { headers })
        .subscribe(resp => {
          
          if (resp['status'] === 'ok') {
             
            this.usuario = resp['usuario'];
            this.setUsuario(this.usuario);
            resolve(true);

          } else {

            this.navCtrl.navigateRoot('/login');
            resolve(false);
          }

        }, error => { 
          this.uiService.alertaInformativa('Necesitas una conexión a internet.');
          console.log(error);
        });


    });

  }
  async logout() {
    
    this.token = null;
    this.usuario = null;
    this.vehicle = null;
    await this.storage.clear();
    this.navCtrl.navigateRoot('/login', { animated: true });
  }
  async setVehicle(vehicle: Vehicle): Promise<any> {
    this.vehicle = vehicle;
    await this.storage.set('vehicle', vehicle);
  }
  async getVehicle(): Promise<any>{
    return await this.storage.get('vehicle') || null;
  }
  async setUsuario(usuario: Usuario){
    await this.storage.set('usuario', usuario);
  }
  async getCatalogoDocumentos(): Promise<any> {

    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
    }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.get<any>(`${URL}/api/documentos/catalogo`, { headers }).toPromise();
  }
  async uploadPhotoDocument(img: string, documentoId: any) {

    const options: FileUploadOptions = {
      fileKey: 'inpt-file-upload',
      params: {
        'documento_id': documentoId
      },
      headers: { Authorization: 'Bearer ' + this.token }
    };
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    return new Promise(resolve => {
      // Upload 
      fileTransfer.upload(img, `${URL}/api/driver/upload/docto`, options)
        .then(data => {

          console.log('UPLOAD SERVER RESPONDIO: ', data);
          if (data.responseCode === 200) {
            const response = JSON.parse(data.response);
            console.log('Response', response);

            if (response.status === 'ok') {
              this.uiService.presentToast('Updated document');
              this.usuario = response.usuario;
              return resolve(true);

            } else {
              this.uiService.presentToast('Try later!');
              return resolve(false);
            }


          } else {
            this.uiService.presentToast('We could not contact the cloud');
            return resolve(false);
          }




        }).catch(err => { this.uiService.presentToast('Ooops, try again more later!.'); return resolve(false); });
    });

  }
  async confirmPhotoDocumento(tokenx: string): Promise<any> {
    await this.cargarToken();

    if (!this.token) { this.navCtrl.navigateRoot('/login'); }

    const params = { tokenx }
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return await this.http.post<any>(`${URL}/api/documento/confirm`, params, { headers }).toPromise();

  }
  async uploadPhoto(img: string) {

    const options: FileUploadOptions = {
      fileKey: 'pic_profile',
      headers: { Authorization: 'Bearer ' + this.token }
    };
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    return new Promise(resolve => {
      // Upload
      fileTransfer.upload(img, `${URL}/api/driver/upload/photo`, options)
        .then(data => {

          console.log('UPLOAD SERVER RESPONDIO: ', data);


          if (data.responseCode === 200) {
            const response = JSON.parse(data.response);
            console.log('Response', response);

            if (response.status === 'ok') {
              this.uiService.presentToast('Updated profile photo');
              this.usuario = response.usuario;
              return resolve(true);
            } else {
              this.uiService.presentToast('Try later!');
              return resolve(false);
            }


          } else {
            this.uiService.presentToast('We could not contact the cloud');
            return resolve(false);
          }

        }).catch(err => { this.uiService.presentToast('Ooops, try again more later!.'); return resolve(false); });
    });

  }
  getUsuario() {

    if (!this.usuario.tokenx) {
      this.validaToken();
    }

    return { ...this.usuario };

  }



} // END OF CLASS