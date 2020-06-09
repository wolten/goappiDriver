import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';

declare var window:any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  imgLoading = false;
  uploadingDocument = false;
  usuario: Usuario = {};
  documentos = [];
  catalogo   = [];
  documento  = [];
  constructor(private usuarioService: UsuarioService, 
              public actionSheetController: ActionSheetController,
              private camera: Camera,
              public alertCtrl: AlertController ) { }
  
  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    this.getCatalogoDocumentos();

    console.log('TAB 3: ', this.usuario);
  }


  // VER documento que subimos
  verDocumento(documento: any) {

  }
  
  // SUBIR FOTO DE DOCUMENTO
  async uploadPhotoDocumento(documentoId: any) {

    this.uploadingDocument = true;
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    await this.camera.getPicture(options).then((imageData) => {
      // const img = window.Ionic.WebView.convertFileSrc(imageData);

      this.usuarioService.uploadPhotoDocument(imageData, documentoId).then(resp => {
        
        console.log('uploadPhotoDocument Promise dice: ', resp);
        // this.usuario = this.usuarioService.getUsuario();
        this.getCatalogoDocumentos();
        

      }); // END OF SERVICE UPLOAD DOCUMENT


    }, (err) => {});

  }

  // API PARA TRAER DOCUMENTOS
  async getCatalogoDocumentos() {

    // SI SE SUBIO CORRECTAMENTE LA IMAGEN
    await this.usuarioService.getCatalogoDocumentos().then(response => {
      console.log('Response [documentos]: ', response);
      this.catalogo = response['catalogo'];
      this.documentos = response['documentos'];

      // OBTENEMOS LAS IMAGENES NUEVAMENTE
      for (let i = 1; i <= this.catalogo.length; i++) {
        this.documento[i] = this.documentos.filter(responsor => { return responsor.documento_id === i; })[0];
        console.log('Document ', i, this.documento[i]);
      }
      this.uploadingDocument = false;
    }); // GET DOCUMENTS    

  }

  // FUNCTION PARA ACEPTAR UN PEDIDO
  async confirmarDocumento(documento: any) {


    const alert = await this.alertCtrl.create({
      header: 'Confirm document',
      subHeader: 'You will not be able to make any changes',
      message: 'Te llevaremos paso a paso.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { console.log('Cancelar');  }
        },
        {
          text: 'Confirm',
          handler: (blah) => {
            
            this.uploadingDocument = false;
            console.log('Confirmar documento: ', documento.tokenx);
            this.usuarioService.confirmPhotoDocumento(documento.tokenx).then( response => {


              console.log('Response [documentos]: ', response);
              this.catalogo = response['catalogo'];
              this.documentos = response['documentos'];

              // OBTENEMOS LAS IMAGENES NUEVAMENTE
              for (let i = 1; i <= this.catalogo.length; i++) {
                this.documento[i] = this.documentos.filter(responsor => { return responsor.documento_id === i; })[0];
                console.log('Document ', i, this.documento[i]);
              }
              this.uploadingDocument = false;

            });

          } // END OF BTN ACEPTAR
        } // END BOTTONS
      ] // END OF ARRAY BUTTONS
    });

    await alert.present();
  }

  // SUBIR FOTO DE PERFIL
  async uploadPhoto() {

    
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:this.camera.PictureSourceType.CAMERA
    }

    await this.camera.getPicture(options).then((imageData) => {
      this.imgLoading = true;
      // const img = window.Ionic.WebView.convertFileSrc(imageData);
      
      this.usuarioService.uploadPhoto(imageData).then( resp => {
        console.log('uploadPhoto Promise dice: ', resp);
        this.usuario = this.usuarioService.getUsuario();
        this.imgLoading = false;
      });
      

    }, (err) => {});    
        
  }

  // CONFIRMAR LOGOUT 
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
      }, {
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
