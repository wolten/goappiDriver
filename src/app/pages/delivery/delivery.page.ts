import { Component, OnInit, ViewChild } from '@angular/core';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { NavController, AlertController, IonSlides } from '@ionic/angular';
import { Delivery } from 'src/app/interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {

  deliveryActiva: Delivery = {}; 
  tokenx: any = null;
  horror = false;

  rankNegocio = null;
  rankCliente = null;
  
  @ViewChild('slideDetail') slides: IonSlides;

  constructor(private deliveryService: DeliveriesService,
              private uiService: UiServiceService,
              private navCtrl: NavController,
              public alertCtrl: AlertController,
              private route: ActivatedRoute,
              private launchNavigator: LaunchNavigator) { 

              this.horror = false;
                this.route.queryParams.subscribe( params =>{
                  if(params && params.delivery){
                    this.tokenx = params.delivery;
                    console.log('DATA:', this.tokenx);
                  }
                });
              }

  ngOnInit(){
   
    if (this.tokenx === null){

          this.deliveryService.getEntregaActiva().then(  resp => {
          
            if(resp['status'] === 'error'){  
              this.navCtrl.navigateRoot('/main');
            }else{
                      this.deliveryActiva = resp.deliverie;
                      if(this.deliveryActiva.status_delivery === 7){

                        this.navCtrl.navigateRoot('/main');
                      
                      }else{
                        
                        this.deliveryActiva.productos = resp.productos;
                        console.log('Activa', this.deliveryActiva);
                      }
            }
          });

    }else{

      this.deliveryService.getDelivery(this.tokenx).then(resp => {  
        this.deliveryActiva = resp.deliverie;
        this.deliveryActiva.productos = resp.productos;
        console.log('Activa', this.deliveryActiva);
      }).catch( error =>{
        console.log('Ocurrio un horror');
        this.horror=true;
        this.deliveryActiva={};
      });  
    }

  }

  async cancel(delivery: Delivery){


    const alert = await this.alertCtrl.create({
      header: 'Cancel delivery',
      subHeader: 'Do you want to cancel the delivery?',
      message: 'You can no longer reverse this action and it will affect your ranking.',
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


            this.deliveryService.cancel(delivery.tokenx).then(response => {
              console.log('Cancel delivery: ', response);
              this.navCtrl.navigateRoot('/main/tabs/tab2');
            });


          }
        } // END BUTTON 2
      ] // END ARREGLO DE BOTONES
    }); // END OF ALERTCTRL

    await alert.present(); // PRESENTA EL ALERT


  }

  driveService(delivery: Delivery){

    let origen ; // = delivery.repartidor.lat + ',' + delivery.repartidor.lng;
    let destino; // = delivery.comercio.coords;

    if(delivery.status_delivery === 3){
      origen  = delivery.comercio.coords;
      destino = delivery.entrega_direccion; 
    }else{
      origen = delivery.repartidor.lat + ',' + delivery.repartidor.lng;
      destino = delivery.comercio.coords;
    }

    console.log('Desde: ', origen, 'Hacia: ', destino)
    const options: LaunchNavigatorOptions = {
      start: origen
    }

    this.launchNavigator.navigate(destino, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  viewPage(page: number){
    this.slides.lockSwipes(false);
    this.slides.slideTo(page);
    this.slides.lockSwipes(true);
  }

  async updateOrder(tokenx: string, statusDelivery:number) {

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
      message: 'Changes cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { console.log('Actualizacion cancenlada');  }
        
        },  // END BUTTON 1
        {
          text: 'Ok',
          handler: (blah) => {

            // this.uiService.presentToast('Tienes una entrega en curso...');
            this.deliveryService.updateDelivery(tokenx, statusDelivery).then( resp => {

              console.log('SERVICE RESPONSE: ', resp);
              if(resp['status'] === 'success' )
              {
                if(statusDelivery === 7){
                  this.uiService.presentToast('Gracias por terminar la entrega.');
                  this.navCtrl.navigateRoot('/main/tabs/tab1');
                }

                // CONTINUAMOS
                this.deliveryActiva= resp.delivery;
                this.deliveryActiva.productos = resp.productos;

                console.log('DELIVERY STATUS: ', this.deliveryActiva.status_delivery);
              }else{
                
                if(resp['status_code'] === 'NO-AUTH'){
                  this.uiService.presentToast('La sesion terminó');
                }
                
                if (resp['status_code'] === 'DRIVER-INACTIVE'){
                  this.uiService.presentToast('Quita el modo OFFLINE para continuar');
                }
              }



            });

          }
        } // END BUTTON 2
      ] // END ARREGLO DE BOTONES
    }); // END OF ALERTCTRL

    await alert.present(); // PRESENTA EL ALERT
  }

  async calificaNegocio(tokenx, ranking){
     this.deliveryService.calificaEntrega(tokenx, ranking, 'driver', 'comercio').then( response => {

      console.log('Calificacion de comercio', response);
       this.deliveryActiva.rank_driver_comercio = ranking;


     });    
  }

  async calificaCliente(tokenx, ranking){
     this.deliveryService.calificaEntrega(tokenx, ranking, 'driver', 'cliente').then( response => {

      console.log('Calificacion de cliente', response);
       this.deliveryActiva.rank_driver_cliente  = ranking;

     });
  }




} // END OF CLASS
