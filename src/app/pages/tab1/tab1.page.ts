import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  usuario: Usuario = {};

  pedidos = [1,1,1,1,1];

  constructor(private usuarioService: UsuarioService, 
              public actionSheetController: ActionSheetController) {}

  ngOnInit(){

    this.usuario = this.usuarioService.getUsuario();
    console.log('TAB1: ', this.usuario);
  }

  async acciones() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Order actions',
      buttons: [{
        text: 'View',
        icon: 'eye',
        handler: () => {
          console.log('Vamos a ver el pedido');
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
