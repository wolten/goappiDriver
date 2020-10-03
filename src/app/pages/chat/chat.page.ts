import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

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
    },
    {
      user: 'Juan',
      mensaje: 'Hola dude',
      createdAt: 1554090856000
    },
    {
      user: 'Will',
      mensaje: 'Como estas?',
      createdAt: 1554090856000
    },
    {
      user: 'Juan',
      mensaje: 'Bien y tu???',
      createdAt: 1554090856000
    }            
  ];
  @ViewChild(IonContent) content: IonContent;
  constructor() { }

  ngOnInit() {
  }

  sendMenssage(){ 
    this.mensajes.push({
      user:this.currentUser,
      createdAt: new Date().getTime(),
      mensaje: this.newMensaje
    });
    this.newMensaje = '';
    setTimeout(() => {
      this.content.scrollToBottom(200);
    });
  }

}
