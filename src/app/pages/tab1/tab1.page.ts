import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Delivery } from '../../interfaces/interfaces';
import { ActionSheetController, NavController, IonList } from '@ionic/angular';
import { DeliveriesService } from '../../services/deliveries.service';
import { UiServiceService } from '../../services/ui-service.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('lista') lista: IonList;
  deliverys = [];

  deliveryActiva: Delivery; 

  constructor(private deliveryService: DeliveriesService, 
              private uiService: UiServiceService,
              public actionSheetController: ActionSheetController,
              private navCtrl: NavController,
              public alertCtrl: AlertController ) {}

  ngOnInit(){  
    
    this.deliveryService.getEntrega().then( resp => {
 
      this.deliveryActiva = resp.deliverie; 
      console.log('Activa', this.deliveryActiva);

    });

    

    this.loadEntregasPendientes();      
  }

  // CARGAR PEDIDOS PENDIENTES
  loadEntregasPendientes(event?) {

    this.deliveryService.getDeliverys().then( resp => {
      this.deliverys = resp.deliverys;
      console.log('Entregas pendientes', this.deliverys);
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

                if( resp['status'] == 'success' ){

                  console.log('Tomamos', resp);
                  this.deliveryActiva = resp.delivery;

                  const index = this.deliverys.indexOf(thisDelivery);

                  if (index > -1) {
                    this.deliverys.splice(index, 1);
                  }

                }else{
                    this.uiService.presentToast('Tienes una entrega en curso...');
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
