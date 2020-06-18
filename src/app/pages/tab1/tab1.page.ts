import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Delivery } from '../../interfaces/interfaces';
import { ActionSheetController, NavController, IonList } from '@ionic/angular';
import { DeliveriesService } from '../../services/deliveries.service';
import { UiServiceService } from '../../services/ui-service.service';
import { AlertController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('lista') lista: IonList;
  deliverys = [];
  loading   = false;
  deliveryActiva: Delivery; 

  constructor(private deliveryService: DeliveriesService, 
              private uiService: UiServiceService,
              public actionSheetController: ActionSheetController,
              private navCtrl: NavController,
              public alertCtrl: AlertController ) {}

  ngOnInit(){  
    
    this.loading = false;
    this.deliveryService.getEntregaActiva().then( resp => {
 
      this.deliveryActiva = resp.deliverie; 
      console.log('Activa', this.deliveryActiva);
    });
    this.loadEntregasPendientes();      
  }

  // VER ENTREGA
  verDelivery(delivery: Delivery) {
    console.log('Ver detalle de pedido');
    const params: NavigationExtras = {
      queryParams: { delivery: delivery.tokenx }
    };
    this.navCtrl.navigateRoot('/delivery', params);
  }

  // CARGAR PEDIDOS PENDIENTES
  loadEntregasPendientes(event?) {

    this.loading = false;
    this.deliveryService.getHistory().then( resp => {
      this.deliverys = resp.deliverys;
      console.log('History', this.deliverys);
      this.loading = true;
    });

    if (event)
      event.target.complete();

  }

  // FUNCTION PARA ACEPTAR UN PEDIDO
  async aceptarEntrega(thisDelivery:Delivery ,tokenx: string) {


    const alert = await this.alertCtrl.create({
      header: 'Aceptar entrega',
      subHeader: '¿Quieres comenzar la entrega?',
      message: 'Te llevaremos paso a paso.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { console.log('Cancelar'); this.lista.closeSlidingItems(); }
        },
        {
          text: 'Ok',
          handler: (blah) => {
           
            this.deliveryService.updateDelivery(tokenx, 1)
              .then(resp => {

                this.lista.closeSlidingItems();
                console.log('Tomamos', resp);

                if( resp['status'] == 'success' ){
                  
                  this.deliveryActiva = resp.delivery;
                  const index = this.deliverys.indexOf(thisDelivery);
                  if (index > -1) { this.deliverys.splice(index, 1); }


                }else{
                    if(resp['status_code'] ==='DRIVER-INACTIVE')
                      this.uiService.presentToast('Change your status to available.');
                    else
                      this.uiService.presentToast('You have a delivery in progress.');
                }
                
                

              }).catch(resp => {

              });


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

  // ACTION SHEET PARA VER OPCIONES DE ENTREGA ACTIVA
  async acciones(tokenx: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Order actions',
      buttons: [{
        text: 'View',
        icon: 'eye',
        handler: () => {
          console.log('Vamos a ver el pedido');
          this.navCtrl.navigateRoot('/delivery');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'destructive',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }






}
