import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  public shouldSave: BehaviorSubject<Action> = new BehaviorSubject<Action>(null);
}
