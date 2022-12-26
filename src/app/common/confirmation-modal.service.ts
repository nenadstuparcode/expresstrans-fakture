import {Injectable} from "@angular/core";
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'any',
})
export class ConfirmationModalService {
  constructor(private alertController: AlertController) {}
}
