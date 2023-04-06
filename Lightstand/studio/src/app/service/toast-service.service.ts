import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {

  constructor(public toastController: ToastController, public alertController: AlertController) { }

  /** CMS - Alert with confirm + cancel button
   *
   * @param headerMessage - header message string
   * @param bodyMessage - body message string
   * @returns
   */
   async confirmAlert(headerMessage:string, bodyMessage = "This action can't be undo"){
    return new Promise(async (resolve) =>  {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: headerMessage,
      // subHeader: 'Subtitle',
      message: bodyMessage,
      buttons: [{
        text: 'Cancel',
        handler: () => {
          resolve('cancel');
        }
        }, {
        text: 'Confirm',
        handler: () => {
          resolve('confirm');
        }
        }]
    });
    alert.present();
  });
  }

  // Simple toast with customer timer
  async simpleToast(message:string, timer:any) {
    const toast = await this.toastController.create({
      cssClass: 'toast-custom-class',
      message: message,
      duration: timer
    });
    toast.present();
  }

  // custom toast with OK button, custom messager and position
  async customToast(_message:string, _position:any) {
    const toast = await this.toastController.create({
      message: _message,
      cssClass: 'toast-custom-class',
      // icon: 'information-circle',
      position: _position, //'top' | 'bottom' | 'middle';
      buttons: [
        {
          text: 'OK',
          role: 'ok',
          handler: () => {
            console.log('OK clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  // // custom toast with OK button, custom messager and position
  // async progressToast(_message:string, _position:any, _progress:Number) {
  //   const toast = await this.toastController.create({
  //     message: _message,
  //     cssClass: 'toast-custom-class',
  //     // icon: 'information-circle',
  //     position: _position, //'top' | 'bottom' | 'middle';
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancelled');
  //         }
  //       }
  //     ]
  //   });
  //   await toast.present();

  //   const { role } = await toast.onDidDismiss();
  //   console.log('onDidDismiss resolved with role', role);
  // }

}
