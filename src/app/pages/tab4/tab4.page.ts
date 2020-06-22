import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Mensaje } from '../../interfaces/interfaces';
import { IonList } from '@ionic/angular';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit {

  @ViewChild('lista') lista: IonList;
  mensajes: Mensaje[];
  loading = false;


  constructor(private storage: Storage,) { }

  ngOnInit() {
    this.getMensajes();
  }

  async delete(item){
    this.lista.closeSlidingItems();  
    const index = this.mensajes.indexOf(item);
    console.log('Index: ', index);
    if (index > -1) { this.mensajes.splice(index, 1); }

    // CLEAR AND SET STORAGE
    await this.storage.clear()
    await this.storage.set('mensajes', JSON.stringify(this.mensajes));

    
  }

  async getMensajes(event?){
    this.loading=false;
    await this.storage.get('mensajes').then( resp=>{
      this.mensajes = JSON.parse(resp);      
      if (this.mensajes != null)
        console.log('# Mensajes: ', this.mensajes);

      if (event)
        event.target.complete();    
      this.loading=true;
    });
  }

  doRefresh(event){
    this.getMensajes(event);
  }



}
