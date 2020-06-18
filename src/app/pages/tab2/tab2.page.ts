import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { Usuario } from 'src/app/interfaces/interfaces';
import { Vehicle } from '../../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { NavController, IonToggle, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Delivery } from '../../interfaces/interfaces';
import { DeliveriesService } from '../../services/deliveries.service';
import { NavigationExtras } from '@angular/router';


declare var window;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  deliverys = [];
  loading = false;
  deliveryActiva: Delivery; 
  @ViewChild('toggleDisponibilidad') toggleStatus: IonToggle;
  usuario: Usuario = {};
  vehicle: Vehicle;
  cargandoGeo = false;
  viewMapa = false;
  loadingUsuario = false;  // CARGANDO INFO DE USER
  watch: Subscription;
  watching = false;
  

  constructor(private usuarioService: UsuarioService,
              private storage: Storage,
              private navCtrl: NavController,
              private deliveryService: DeliveriesService, 
              private uiService: UiServiceService,
              public alertCtrl: AlertController) { }

  ngOnInit(){ 
  
    this.loadingUsuario = false;
    
    this.loading = false;
    // CARGANDO ENTREGA ACTIVA
    this.deliveryService.getEntregaActiva().then(resp => {

      this.deliveryActiva = resp.deliverie;
      console.log('Activa', this.deliveryActiva);
    });

    // ENTREGAS PENDIENTES
    this.loadEntregasPendientes();    

    // GET USUARIO ALMACENADO this.usuario = this.usuarioService.getUsuario();
    this.storage.get('usuario').then(resp => {
      
      console.log('Usuario[storage]', resp);
      this.usuario  = resp;
      this.loadingUsuario = true;

      // NOS ASEGURAMOS DE QUE SIGA LOCALIZANDO AL REPARTIDOR
      if(this.usuario.status_drive === 1){
        window.app.backgroundGeolocation.checkStatus((status) => {
          console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
          console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
          console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

          // you don't need to check status before start (this is just the example)
          if (!status.isRunning){
            console.log('Si la disponibilidad esta encendida, y no esta corriendo el servicio, lo activamos');
            window.app.backgroundGeolocation.start(); // triggers start on start event
          }
        });   
      }
    });
    


  }

  verMapa() {
    this.viewMapa = !this.viewMapa;
  }

  verDelivery(delivery: Delivery){
    console.log('Ver detalle de pedido')
    const params :NavigationExtras = {
        queryParams:{ delivery : delivery.tokenx  }
    };
    this.navCtrl.navigateRoot('/delivery', params);    
  }


  async changeDisponibilidad(event: any) {

    // SI NO ESTA ACTIVO
    this.cargandoGeo = true;
    console.log('Toggle: ', event.checked);

    if(event.checked)
      this.usuario.status_drive = 1;
    else
      this.usuario.status_drive = 0;
    
    console.log('Disponibilidad: ', this.usuario.status_drive);

    await this.usuarioService.setDisponibilidad(this.usuario.status_drive).then(resp => {

          if(resp['status'] === 'success') {
            
            if(this.usuario.status_drive === 1) {

              this.uiService.presentToast('To work!!');
              
              window.app.backgroundGeolocation.start();
              // WITH GEOLOCATION PLUGIN
              // this.watch = this.geolocation.watchPosition().pipe( filter((p) => p.coords !== undefined))
              //             .subscribe((data) => {
              //               // data can be a set of coordinates, or an error (if an error occurred).
              //               // data.coords.latitude
              //               // data.coords.longitude
              //               this.latitud  = data.coords.latitude;
              //               this.longitud = data.coords.longitude;
              //               console.log('WATCH: ', data.coords.latitude, data.coords.longitude);
              //             }); 
            
            }else{
              
              // this.watch.unsubscribe(); // WITH GEOLOCATION PLUGIN
              window.app.backgroundGeolocation.stop();
              this.uiService.presentToast('We wait for you soon.');
            }

          }else {
              if(resp['status_code'] === 'STATUS-NO') {

                this.uiService.presentToast('You are not authorized to start');
                this.usuario.status_drive=0;


              } else
                this.uiService.presentToast('An error occurred, try later');
          }
      });
    
    this.cargandoGeo = false;

  }

  async chooseVehicle(vehicle: Vehicle) {
    
    console.log('Choose: ', vehicle);
    await this.usuarioService.setVehicle(vehicle);
    this.vehicle = vehicle;

  }

  // FUNCTION PARA ACEPTAR UN PEDIDO
  async aceptarEntrega(thisDelivery: Delivery) {


    const alert = await this.alertCtrl.create({
      header: 'Pending order',
      subHeader: 'Do you want to start this order?',
      message: 'We will take you step by step. ;)',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { console.log('Cancelar'); }
        },
        {
          text: 'Ok',
          handler: (blah) => {

            this.deliveryService.updateDelivery(thisDelivery.tokenx, 1)
              .then(resp => {

                // this.lista.closeSlidingItems();
                if (resp['status'] === 'success') {

                  this.deliveryActiva = resp.delivery;
                  const index = this.deliverys.indexOf(thisDelivery);
                  if (index > -1) { this.deliverys.splice(index, 1); }


                } else {

                  if (resp['status_code'] === 'DRIVER-INACTIVE')
                    this.uiService.presentToast('Change your status to available.');
                  else
                    this.uiService.presentToast('You have a delivery in progress.');
                }



              }).catch(resp => {});


          }
        }
      ]
    });

    await alert.present();
  }


  // FUNCION DE RECARGAR
  recargar(event) {
    this.deliverys = [];
    this.loadEntregasPendientes(event);
  }

  // CARGAR PEDIDOS PENDIENTES
  loadEntregasPendientes(event?) {

    this.loading = false;
    this.deliveryService.getDeliverys().then(resp => {
      this.deliverys = resp.deliverys;
      console.log('Entregas pendientes', this.deliverys);
      this.loading = true;
    });

    if (event)
      event.target.complete();

  }

}
