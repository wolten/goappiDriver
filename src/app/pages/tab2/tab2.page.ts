import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  
  usuario: Usuario = {};

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {

    this.usuario = this.usuarioService.getUsuario();
    console.log('TAB2: ', this.usuario);
  }

  changeDisponibilidad(){

    console.log(this.usuario.status_drive);

  }

}
