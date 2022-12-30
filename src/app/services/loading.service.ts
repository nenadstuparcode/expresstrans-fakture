import {Injectable} from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {MessageType} from "@app/services/loading.interface";

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController) {}

  public async start(msg: string): Promise<void> {
    const loading: HTMLIonLoadingElement = await this.loadingCtrl.create({
      message: msg,
    });

    await loading.present();
  }

  public async end(): Promise<void> {
    await this.loadingCtrl.dismiss();
  }

  public async showToast(msg: MessageType): Promise<void> {
    const toast: HTMLIonToastElement = await this.toastCtrl.create({
      message: msg,
      duration: 3500,
      color: msg === MessageType.success || msg === MessageType.printSuccess ? null : 'danger',
      icon: msg === MessageType.success ? 'checkmark' : 'alert-circle',
      buttons: [
        {
          text: 'Zatvori',
          role: 'cancel'
        }
      ],
    })

    await toast.present();
  }
}
