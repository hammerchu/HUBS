import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefinePageRoutingModule } from './refine-routing.module';

import { RefinePage } from './refine.page';

// import AngularPinturaModule
import { AngularPinturaModule } from '@pqina/angular-pintura';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefinePageRoutingModule,
    AngularPinturaModule
  ],
  declarations: [RefinePage]
})
export class RefinePageModule {}
