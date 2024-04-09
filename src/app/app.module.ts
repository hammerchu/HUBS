import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DailyContainerComponent } from "./daily-container/daily-container.component";
import { VideoTileComponent } from "./video-tile/video-tile.component";
import { CallComponent } from "./call/call.component";
import { ChatComponent } from "./chat/chat.component";
import { JoinFormComponent } from "./join-form/join-form.component";
import { ReactiveFormsModule} from '@angular/forms';

import { GoogleMapsModule } from '@angular/google-maps'
@NgModule({
  declarations: [AppComponent,
     VideoTileComponent,
     DailyContainerComponent,
     CallComponent,
     ChatComponent,
     JoinFormComponent,

    ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, GoogleMapsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
