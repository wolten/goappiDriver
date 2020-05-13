import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  usuario: Usuario = {};

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(){

    this.usuario = this.usuarioService.getUsuario();
    console.log('TAB1: ', this.usuario);
  }

}
