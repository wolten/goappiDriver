import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  private usuario: Usuario = {};

  constructor(private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController) { }

  getUsuario() {

    if (!this.usuario.tokenx) {
      this.validaToken();
    }

    return { ...this.usuario };

  }


  login(celular : string, pass: string) {

    const data = { celular , pass };

    return new Promise(resolve => {

      this.http.post(`${URL}/api/driver/signin`, data)
        .subscribe(async resp => {

          console.log(resp);

          if (resp.status == 'ok') {

            await this.guardarToken(resp.token);
            resolve(true);

          } else {
            this.token = null;
            this.storage.clear();
            resolve(false);
          }

        });

    });

  }

  async guardarToken(token: string) {

    this.token = token;
    await this.storage.set('token', token);
    // await this.validaToken();
  }

  async cargarToken() {

    this.token = await this.storage.get('token') || null;

  }

  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    if (!this.token)
    {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }


    return new Promise<boolean>(resolve => {

      const headers = new HttpHeaders({  'Authorization': "Bearer " + this.token   });

      this.http.get(`${URL}/api/driver/man`, { headers })
        .subscribe(resp => {

          console.log("Validatoken", resp);


          if (resp.status == 'ok') {
            this.usuario = resp.usuario;
            resolve(true);
          } else {

            this.navCtrl.navigateRoot('/login');
            resolve(false);
          }

        });


    });

  }

  logout() {
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', { animated: true });
  }

}
