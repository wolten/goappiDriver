import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { Usuario } from 'src/app/interfaces/interfaces';
import { Vehicle } from '../../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { NavController, IonToggle } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild('toggleDisponibilidad') toggleStatus: IonToggle;
  usuario: Usuario = {};
  vehicle: Vehicle;

  cargandoGeo = false;
  viewMapa = false;
  loadingUsuario = false;  // CARGANDO INFO DE USER

  constructor(private usuarioService: UsuarioService,
              private storage: Storage,
              private navCtrl: NavController,
    private uiService: UiServiceService, ) { }

  ngOnInit(){ 
 
    this.loadingUsuario = false;
    
    // this.usuario = this.usuarioService.getUsuario();
    this.storage.get('usuario').then(resp => {
      
      console.log('Usuario[storage]', resp);
      this.usuario  = resp;
      this.loadingUsuario = true;



      this.storage.get('vehicle').then( respo => {
        console.log('Vehicle[storage]', respo);
        this.vehicle = respo;
      });


    });
    
  }

  verMapa()
  {
    this.viewMapa = !this.viewMapa;
  }
  changeStatus() {
    this.toggleStatus.checked = !this.toggleStatus.checked;
  }
  
  async changeDisponibilidad(event: any) {

    // SI NO ESTA ACTIVO
    this.cargandoGeo = true;
    console.log('Toggle: ', event.checked);

    if(event.checked)
      this.usuario.status_drive = 1;
    else
      this.usuario.status_drive = 0;
    
    console.log('Disponibilidad: ', this.usuario.status_drive);

    await this.usuarioService.setDisponibilidad(this.usuario.status_drive).then(resp => {

          if(resp['status'] === 'success') {
            
            if(this.usuario.status_drive === 1)
              this.uiService.presentToast('To work!!');
            else
              this.uiService.presentToast('We wait for you soon.');

          }else {
              if(resp['status_code'] === 'STATUS-NO') {

                this.uiService.presentToast('You are not authorized to start');
                this.usuario.status_drive=0;


              } else
                this.uiService.presentToast('An error occurred, try later');
          }
      });
    
    this.cargandoGeo = false;

  }

  async chooseVehicle(vehicle: Vehicle) {
    
    console.log('Choose: ', vehicle);
    await this.usuarioService.setVehicle(vehicle);
    this.vehicle = vehicle;

  }

  verEntrega() {
    console.log('Vamos a ver el pedido');
    this.navCtrl.navigateRoot('/delivery');
  }

}
