import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickerController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  spinner: boolean

  usuarios = [
    [
      'invitado',
      'usuario',
      'tester',
      'anonimo',
      'administrador'
    ]
  ]

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private toastController: ToastController,
    private pickerCtlr: PickerController
  ) { }

  ngOnInit() {
  }

  onLogin() {
    this.spinner = true;
    
    this.authSvc.login(this.email, this.password)
    .then(() => this.router.navigate(['/home']))
    .catch(() => this.displayErrorToast('No se ha podido iniciar sesión, verifique que el usuario y la clave esten ingresado correctamente'))
    .finally(() => this.spinner = false);    
  }

  async openPicker(numColumns = 1, numOptions = 5, columnOptions = this.usuarios) {
    const picker = await this.pickerCtlr.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            
            switch(value['col-0'].text) {
              case 'tester':
                this.email = 'tester@tester.com';
                this.password = '555555';
              break;

              case 'administrador':
                this.email = 'admin@admin.com';
                this.password = '111111';
              break;

              case 'invitado':
                this.email = 'invitado@invitado.com';
                this.password = '222222';
              break;

              case 'anonimo':
                this.email = 'anonimo@anonimo.com';
                this.password = '444444';
              break;

              case 'usuario':
                this.email = 'usuario@usuario.com';
                this.password = '333333';
              break;
            }

            (document.querySelector('#submitBtn') as HTMLButtonElement).click();
          }
        }
      ]
    });

    await picker.present();
  }

  private getColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

  private getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }
    return options;
  }

  private async displayErrorToast(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
