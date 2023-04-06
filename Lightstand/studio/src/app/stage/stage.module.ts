import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StagePageRoutingModule } from './stage-routing.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { StagePage } from './stage.page';

// import { BrowserModule } from '@angular/platform-browser';


// import AngularPinturaModule
import { AngularPinturaModule } from '@pqina/angular-pintura';

@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    NgxFileDropModule,
    FormsModule,
    IonicModule,
    StagePageRoutingModule,
    AngularPinturaModule
  ],
  declarations: [StagePage]
})
export class StagePageModule {}
