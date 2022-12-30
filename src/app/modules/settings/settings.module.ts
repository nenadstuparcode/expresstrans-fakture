import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from '@app/modules/settings/settings-routing.module';
import { SettingsComponent } from '@app/modules/settings/settings.component';
import { SettingsHomeComponent } from '@app/modules/settings/components/settings-home/settings-home.component';
import { IonicModule } from '@ionic/angular';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [SettingsComponent, SettingsHomeComponent],
  imports: [CommonModule, SettingsRoutingModule, IonicModule, MatDialogModule],
})
export class SettingsModule {}
