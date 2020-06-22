import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;
  loading = false;
  loadingsignup = false;

  loginUser = {
    celular: '5563524923',
    pass: 'bypass$$'
  };

  registerUser: Usuario = {
    celular: '5563524923',
    pass: 'password',
    nombre: 'John Doe',
    confirm: 'password'
  };


  constructor(private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private uiService: UiServiceService) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
  }


  async login(fLogin: NgForm) {

    if (fLogin.invalid) { return; }

    this.loading=true;

    const valido = await this.usuarioService.login(this.loginUser.celular, this.loginUser.pass);

    if (valido) {
      this.loading = false;
      // navegar al tabs
      this.navCtrl.navigateRoot('/main/tabs/tab2', { animated: true });
      
    } else {
      // mostrar alerta de usuario y contraseña no correctos
      this.loading = false;
      this.uiService.alertaInformativa('Usuario y contraseña no son correctos.');
    }


  }

  async registro(fRegistro: NgForm) {
    this.loadingsignup=true;
    if(fRegistro.invalid){ return; }

    if(this.registerUser.pass !== this.registerUser.confirm){ return; }

    await this.usuarioService.register(this.registerUser.celular, this.registerUser.nombre, this.registerUser.pass)
    .then( response =>{
      this.loadingsignup = false;
      console.log('Registro dijo: ', response);

      if(response['status'] === 'ok'){
        
        this.usuarioService.guardarToken(response['token']);
        // navegar al tabs
        this.navCtrl.navigateRoot('/main/tabs/tab2', { animated: true });

      }else{
        this.uiService.alertaInformativa(response['message']);
      }


    });

  }

  mostrarRegistro() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  mostrarLogin() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }




}
