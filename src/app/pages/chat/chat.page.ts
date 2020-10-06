import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import * as firebase from 'firebase';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario, Delivery, Cliente, Order } from '../../interfaces/interfaces';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  currentUser = 'Will';
  newMensaje = '';
  mensajes =[ ];
  usuario: Usuario;
  tokenx;
  entrega: Order;
  cliente: Cliente;
  @ViewChild(IonContent) content: IonContent;
  
  constructor(private route: ActivatedRoute, 
              private usuarioService: UsuarioService,
              private deliveryService: DeliveriesService) {

    this.route.queryParams.subscribe(params => {
      if (params && params.delivery) {
        this.tokenx = params.delivery;
        console.log('DATA:', this.tokenx);
      }
    });
    this.usuario = this.usuarioService.getUsuario();
    console.log('Usuario', this.usuario);
    this.currentUser = this.usuario.nombre ;

    setTimeout(() => {    this.getMensajes();   }, 500);
   }

  ngOnInit() {
    this.getOrder();
  }
  async getOrder() {
    await this.deliveryService.getOrder(this.tokenx).then(response => {
      this.entrega = response['order'];
      console.log('entrega: ', this.entrega);
      this.cliente = this.entrega.cliente;
      // this.cliente = this.entrega.cliente;
    });
  }

  getMensajes(){
    // const mensajesRef = firebase.database().ref().child('conversaciones/' + this.tokenx);
    const mensajesRef = firebase.database().ref().child( this.tokenx);
    mensajesRef.on('value', snap =>{
      const data = snap.val();
      this.mensajes = [];
      // tslint:disable-next-line:forin
      for(const key in data) {
        this.mensajes.push(data[key]);
      }

      setTimeout(() => { this.content.scrollToBottom(200); });

    });
  }
  sendMenssage(){ 
    const mensajesRef = firebase.database().ref().child(this.tokenx);
    mensajesRef.push({
      user: this.currentUser,
      createdAt: new Date().getTime(),
      mensaje: this.newMensaje
    })
 

    this.deliveryService.sendPush(this.tokenx).then( data => { console.log('API Push: ', data); });
    this.newMensaje = '';
    setTimeout(() => {      this.content.scrollToBottom(200);    });
  }

}
