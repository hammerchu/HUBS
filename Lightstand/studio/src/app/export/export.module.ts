import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExportPageRoutingModule } from './export-routing.module';

import { ExportPage } from './export.page';
import { AngularPinturaModule } from '@pqina/angular-pintura';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularPinturaModule,
    ExportPageRoutingModule
  ],
  declarations: [ExportPage]
})
export class ExportPageModule {}
