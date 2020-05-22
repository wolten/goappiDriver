import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  usuario: Usuario = {};
  constructor(private usuarioService: UsuarioService, 
              public actionSheetController: ActionSheetController) { }
  
  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    console.log('TAB 3: ', this.usuario);
  }

  async acciones() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{
        text: 'Log Out',
        icon: 'exit-outline',
        role: 'destructive',
        handler: () => {
          console.log('BYE BYE');
          this.usuarioService.logout();
        }
      },{
        text: 'Cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


}
