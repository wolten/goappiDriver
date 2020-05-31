import { Component, OnInit } from '@angular/core';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { NavController, AlertController } from '@ionic/angular';
import { Delivery } from 'src/app/interfaces/interfaces';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {

  deliveryActiva: Delivery; 
  
  titulo = "Let's start";
  
  constructor(private deliveryService: DeliveriesService,
              private uiService: UiServiceService,
              private navCtrl: NavController,
              public alertCtrl: AlertController ) { }


  ngOnInit(){

    this.deliveryService.getEntrega().then(  resp => {
      
      
      if(resp['status'] == 'error')
      {  
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
              if(resp['status'] == 'success' )
              {
                if(statusDelivery == 7)
                {
                  this.navCtrl.navigateRoot('/main/tabs/tab1');
                }

                //CONTINUAMOS
                this.deliveryActiva= resp.delivery;
                this.deliveryActiva.productos = resp.productos;

                console.log('DELIVERY STATUS: ', this.deliveryActiva.status_delivery);
              }else{
                
                if(resp['status_code']=='NO-AUTH')
                    this.uiService.presentToast('La sesion terminó');
              }



            });

          }
        } // END BUTTON 2
      ] // END ARREGLO DE BOTONES
    }); // END OF ALERTCTRL

    await alert.present(); // PRESENTA EL ALERT
  }


}
