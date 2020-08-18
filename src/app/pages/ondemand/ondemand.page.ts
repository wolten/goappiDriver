import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { Order, Delivery, Destino, Usuario } from 'src/app/interfaces/interfaces';
import { LaunchNavigatorOptions, LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController, NavController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-ondemand',
  templateUrl: './ondemand.page.html',
  styleUrls: ['./ondemand.page.scss'],
})
export class OndemandPage implements OnInit {

  tokenx:string;
  order: Order;
  destino: Destino;
  usuario: Usuario;
  finalizar=false;
  calificando = false;
  
  constructor(private route: ActivatedRoute,
              private deliveryService: DeliveriesService,
              private usuarioService: UsuarioService,
              private launchNavigator: LaunchNavigator,
              private ui: UiServiceService,
              private navCtrl: NavController,
              private alertCtrl: AlertController) { 

    this.route.queryParams.subscribe(params => {
      if (params && params.delivery) {
        this.tokenx = params.delivery;
      }
    });
  
  }

  ngOnInit() {
    this.getOrder();
    this.usuario = this.usuarioService.getUsuario();
  }

  // OBTENEMOS LA ORDEN ACTIVA
  async getOrder(){
    
    await this.deliveryService.getOrder(this.tokenx).then(resp => {
      console.log(resp);
      this.order = resp.order;
      this.destino = this.order.destinations.filter(x => x.status === 0)[0]; 
      console.log('Destino actual: ',this.destino);
      
      if(this.order.status === 3 && this.order.delivery.status === 1 && !this.destino){
        this.finalizar = true;
      }

    }).catch(error => {
      this.order = {};
    });     
  }

  // LANZA EL SERVICIO DE NAVIGATION GPS
  async driveService(origen: string, destino: string) {

    if(this.destino.status_delivery === 0){
      origen  = this.usuario.lat + ',' + this.usuario.lng;
      destino = this.destino.origen; 
    }

    console.log('Desde: ', origen, 'Hacia: ', destino);
    const options: LaunchNavigatorOptions = { start: origen };
    await this.launchNavigator.navigate(destino, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  // ACTUALIZAMOS EL DESTINO
  async updateStatusDestination(){
    // STATUS DELIVERY DEL DESTINO
    // 0, CONSULTA DE PEDIDO
    // 1. Entrega recien aceptada
    // 2. Estoy en la tienda
    // 3. Vamos a entregarlo
    // 4. Estoy en la direccion
    // 5. Orden entregada.
    // 7. ORDEN COMPLETADA
    let status = 0;
    if (this.destino.status_delivery === 0) { status = 1; } 
    if (this.destino.status_delivery === 1) { status = 2; }
    if (this.destino.status_delivery === 2) { status = 3; }




    const alert = await this.alertCtrl.create({
      header: 'Delivery On Demand',
      subHeader: 'Do you want to continue with this action?',
      // message: 'You can no longer reverse this action and it will affect your ranking.',
      buttons: [{

          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { console.log('Actualizacion cancelada'); }

        },  // END BUTTON 1
        {
          text: 'Ok',
          cssClass: 'success',
          handler: (blah) => {

            // ACTUALIZAR EL STATUS DEL DESTINO
            this.deliveryService.updateStatusDeliveryDestino(this.destino.tokenx, status).then(response => {
            
              console.log('Response status: ',response);
              if(response['status'] === 'success'){
                this.destino = response['destino'];
                this.ui.presentToast('Let s move on');

                // SI EL DESTINO
                if (this.destino.status_delivery === 3) {
                  this.order = null;
                  this.getOrder();
                }



              }else{
                this.ui.presentToast('Oops, A problem occurred, contact us.')
              }
            
            
            }).catch(error => { });





          } // END FUNCTION DEL 2 BOTON
        }] // END ARREGLO DE BOTONES
    }); // END OF ALERTCTRL

    await alert.present(); // PRESENTA EL ALERT            
  }

  // DRIVER CALIFICA AL NEGOCIO
  async calificaNegocio(tokenx, ranking) {

    this.calificando = true;
    this.deliveryService.calificaEntrega(tokenx, ranking, 'driver', 'comercio').then(response => {

      console.log('Calificacion de comercio', response);
      this.order.delivery.rank_driver_comercio = ranking;
      this.calificando = false;

    });
  }

  // FINALIZAMOS LA ORDEN
  async finishOrder(tokenx: string) {

    /* 
      STATUS
      1. ACEPTTED     | PEDIDO RECIEN ACEPTADO
      2. COLLECTING   | LLEGUE A LA TIENDA
      3. COLLECTED    | TENGO LOS PRODUCTOS
      4. IN TRANSIT   | EN RUTA DE ENTREGA
      5. DELIVERED    | ENTREGADO
      6. PROBLEMS     | TUVE UN PROBLEMA EN TRANSITO
      7. FINISH       | REPARTIDOR FINALIZA LA ENTREGA
    */

    const alert = await this.alertCtrl.create({
      header: 'Delivery',
      subHeader: 'Do you want to update the order?',
      // message: 'Changes cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { console.log('Actualizacion cancelada'); }

        },  // END BUTTON 1
        {
          text: 'Ok',
          handler: (blah) => {

            this.deliveryService.finishOrder(tokenx).then(resp => {

              console.log('SERVICE RESPONSE: ', resp);
              if (resp['status'] === 'success') {
                
                this.deliveryService.disableLocalizacionBackGround();
                this.ui.presentToast('Gracias por tus servicios.');
                this.navCtrl.navigateRoot('/main/tabs/tab2');

              } else {
                this.ui.presentToast('Oops try later!!');
              }



            });

          }
        } // END BUTTON 2
      ] // END ARREGLO DE BOTONES
    }); // END OF ALERTCTRL

    await alert.present(); // PRESENTA EL ALERT
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

                if (resp['status'] === 'success') {

                  this.deliveryService.enableLocalizacionBackGround();
                  this.navCtrl.navigateRoot('/main/tabs/tab2');    

                } else {

                  if (resp['status_code'] === 'DRIVER-INACTIVE')
                    this.ui.presentToast('Change your status to available.');
                  else
                    this.ui.presentToast('You have a delivery in progress.');
                }



              }).catch(resp => { this.ui.presentToast('Sorry, we are undergoing maintenance.'); });


          }
        }
      ]
    });

    await alert.present();
  }


} // END OF CLASS
