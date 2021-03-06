import { Component } from '@angular/core';

import { Platform, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './services/usuario.service';
import { BackgroundGeolocationError } from '../../plugins/cordova-plugin-background-geolocation/www/BackgroundGeolocation';
import { Mensaje } from './interfaces/interfaces';
import * as firebase from 'firebase/app';
import { NavigationExtras, Router } from '@angular/router';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAIbWHNt-biJm_Da2tfWjtfG25Il1RfDd0',
  authDomain: 'goppaidriverspush.firebaseapp.com',
  databaseURL: 'https://goppaidriverspush.firebaseio.com',
  projectId: 'goppaidriverspush',
  storageBucket: 'goppaidriverspush.appspot.com',
  messagingSenderId: '291524709736',
  appId: '1:291524709736:web:3161d805c437e5f8e19ad'
};
declare var window;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  arr:any;  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private storage: Storage,
    private alertCtrl: AlertController,
    private backgroundGeolocation: BackgroundGeolocation,
    private usuarioService: UsuarioService,
    private navCtrl: NavController
  ) {
    this.initializeApp();
    this.arr = [];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {
        this.setupPush();

        // BACKGROUND GEOLOCATION
        const config: BackgroundGeolocationConfig = {
          notificationTitle: 'Goppai Delivery',
          notificationText: 'Tracking enabled',
          desiredAccuracy: 10,
          stationaryRadius: 20,
          distanceFilter: 30,
          debug: true, //  enable this hear sounds for background-geolocation life-cycle.
          stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        };

        this.backgroundGeolocation.configure(config).then(() => {

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.location)
            .subscribe((location: BackgroundGeolocationResponse) => {
              console.log('Background Geolocation: ',location);
              this.usuarioService.sendPosition(location.latitude, location.longitude);

              // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
              this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

          this.backgroundGeolocation.on(BackgroundGeolocationEvents.error)
            .subscribe((error)  => {
            console.log('[ERROR] BackgroundGeolocation error:', error);
          });

          }); // END OF CONFIGURE BACKGROUND - GEOLOCATION

      } // END OF VALIDACION DE PLATAFORMA CORRIENDO
      window.app = this;
      firebase.initializeApp(firebaseConfig); 
    });
  }

  setupPush(){
    this.oneSignal.startInit('30d5c362-2725-4a58-a737-b6d14af6a3af', '291524709736');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      // do something when notification is received
      
      // CON LA APLICACION ABIERTA
      const msg: string  = data.payload.body;
      const title:string = data.payload.title;
      const datax: any   = data.payload.additionalData;
      const mensaje: Mensaje = {
        mensaje : msg,
        titulo : title,
        task : datax.task,
        fecha : new Date().toString()
      };
      console.log('Datax: ', datax);
      this.guardarMensaje(mensaje);
      this.showAlert(title, msg, datax.task, datax.tokenx);


    }); 

    
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // do something when a notification is opened

      // CON LA APLICACION CERRADA
      // const additionalData = data.notification.payload.additionalData;
      // this.showAlert('Notification opened', 'You already read this before', additionalData.task);

    });

    this.oneSignal.endInit();     

    // GET DE PUSHTOKEN, DEVICE_ID
    this.oneSignal.getIds().then(identity => {
      this.storage.set('playerID', identity.userId);
     });    
  }

  async guardarMensaje(mensaje: Mensaje) {

    // TRAEMOS TODOS LOS MENSAJES
    await this.storage.get('mensajes').then( resp => {
            
      if (resp == null){
        this.arr.push(mensaje);
      }else{
        const arrMensajes = JSON.parse(resp);
        this.arr = arrMensajes;
        this.arr.push(mensaje);
      }
      // Volver a guardar todo el arreglo
      this.storage.set('mensajes', JSON.stringify(this.arr));
    }) 
    

  }

  async showAlert(title, msg, task, tokenx) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `OK`,
          handler: () => {
            this.doAccion(task, tokenx);
          }
        }
      ]
    })
    alert.present();
  }

  async doAccion(task, tokenx) {
    console.log('PUSH: ', task, tokenx);
    switch (task) {
      // MENSAJE
      case 'mensaje':
        let paramx: NavigationExtras;
        paramx = { queryParams: { delivery: tokenx } };
        this.navCtrl.navigateRoot('/chat', paramx);
        break;

      // Default
      default: console.log('Accion Default: ', task);  break;
    }
  }




} // END OF CLASS COMPONENT
