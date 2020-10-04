import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import * as firebase from 'firebase';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  currentUser = 'Will';
  newMensaje = '';
  mensajes =[
    {
      user: 'Will',
      mensaje: 'Hola',
      createdAt:1554090856000
    }         
  ];
  tokenx;
  @ViewChild(IonContent) content: IonContent;
  
  constructor(private route: ActivatedRoute, 
              private deliveryService: DeliveriesService,
              private uiService: UiServiceService) {

    this.route.queryParams.subscribe(params => {
      if (params && params.delivery) {
        this.tokenx = params.delivery;
        console.log('DATA:', this.tokenx);
      }
    });
    
    setTimeout(() => {
      this.getMensajes();
      
    }, 500);
   }

  ngOnInit() {
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
