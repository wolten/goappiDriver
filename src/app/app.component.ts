import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './services/usuario.service';
import { BackgroundGeolocationError } from '../../plugins/cordova-plugin-background-geolocation/www/BackgroundGeolocation';


declare var window;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private storage: Storage,
    private alertCtrl: AlertController,
    private backgroundGeolocation: BackgroundGeolocation,
    private usuarioService: UsuarioService
  ) {
    this.initializeApp();
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
       
    });
  }

  setupPush(){
    this.oneSignal.startInit('30d5c362-2725-4a58-a737-b6d14af6a3af', '291524709736');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    this.oneSignal.handleNotificationReceived().subscribe(data => {
      // do something when notification is received
      
      // CON LA APLICACION ABIERTA
      const msg = data.payload.body;
      const title = data.payload.title;
      const additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
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
       // console.log('PushToken:',identity.pushToken);
       console.log('PlayerID',identity.userId);
      this.storage.set('playerID', identity.userId);
     });    
  }


  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
            console.log('Action', task)
          }
        }
      ]
    })
    alert.present();
  }



} // END OF CLASS COMPONENT
