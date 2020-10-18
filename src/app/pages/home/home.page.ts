import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { CreditosService } from '../../services/creditos.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Credito } from '../../models/credito';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  contenidoScan: string;
  scanSubscription: any;
  creditoActual: number = 0;
  spinner: boolean = true;
  idUsuarioActual: number;
  creditosUsuario: Credito[];
  perfilUsuarioActual: string;
  codigos = {
    'cien': '2786f4877b9091dcad7f35751bfcf5d5ea712b2f',
    'diez': '8c95def646b6127282ed50454b73240300dccabc',
    'cincuenta': 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 '
  }

  constructor(
    private qrScanner: QRScanner, 
    private alertCtlr: AlertController,
    private plt: Platform,
    public creditosSvc: CreditosService,
    private authSvc: AuthService,
    private router: Router
  ) { 
    this.plt.backButton.subscribeWithPriority(0, () => {
      document.getElementsByTagName('body')[0].style.opacity = '1';
      this.scanSubscription.unsubscribe();
    });

    const userS$ = this.authSvc.user$.subscribe(
      user => {
        this.idUsuarioActual = user.id;
        this.perfilUsuarioActual = user.perfil;

        this.creditosSvc.creditosUsuario(this.idUsuarioActual).subscribe(
          crdArr => {
            this.creditosUsuario = crdArr;

            this.creditoActual = crdArr.reduce((acc, el) => {
              acc += el.creditoCargado;
              return acc;
            },0);

            this.spinner = false;
          },
          err => {
            console.log(err);
          },
        );

        userS$.unsubscribe();
      },
      err => {
        console.log(err);
      }
    );
  }

  escanear() {

    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if(status.denied) {
        this.alerta('Permiso Denegado', 'Debe permitir que la aplicación acceda a su cámara para su funcionamiento');
      }

      if(status.authorized) {
        this.qrScanner.show();
        document.getElementsByTagName('body')[0].style.opacity = "0";

        this.scanSubscription = this.qrScanner.scan().subscribe(
          contenido => {
            document.getElementsByTagName('body')[0].style.opacity = "1";
            console.log(contenido);
            this.agregarCredito(contenido);          
            this.scanSubscription.unsubscribe();
          },
          err => {
            this.alerta('Error', JSON.stringify(err));
          }
        );
      }
    });
  }

  agregarCredito(qrContenido) {
    let creditoCargado = 0;
    let creditoCargadoNombre = '';

    if(qrContenido === this.codigos['diez']) {
      creditoCargado += 10;
      creditoCargadoNombre = 'diez';
    }
    else if(qrContenido === this.codigos['cincuenta']) {
      creditoCargado += 50;
      creditoCargadoNombre = 'cincuenta';
    }
    else if(qrContenido === this.codigos['cien']){
      creditoCargado += 100;
      creditoCargadoNombre = 'cien';
    }

    const arr = this.creditosUsuario.filter(el => el.codigoQr === qrContenido);

    if(this.perfilUsuarioActual === 'admin') {
      if(arr.length < 2) {
        this.creditosSvc.addCredito({
          codigoQr: qrContenido,
          creditoCargado,
          idUsuario: this.idUsuarioActual
        });
      } else {
        this.alerta('Excedio recarga', 'Usted ha excedido la cantidad de recargas');
      }
    } else {
      if(arr.length < 1) {
        this.creditosSvc.addCredito({
          codigoQr: qrContenido,
          creditoCargado,
          idUsuario: this.idUsuarioActual
        });
      } else {
        this.alerta('Excedio recarga', 'Usted ha excedido la cantidad de recargas');
      }
    }
    
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  limpiarCredito() {
    let auxArr = this.creditosUsuario.map(a => Object.assign({}, a));
    auxArr.forEach(el => this.creditosSvc.deleteCredito(el));
  }

  private alerta(header?: string, msj?: string) {
    this.alertCtlr.create({
      header: header,
      message: msj,
      buttons: ['Ok']
    })
    .then(alert => {
      alert.present();
    });
  }
}
