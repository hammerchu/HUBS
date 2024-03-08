import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotsPage } from './bots.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { BotsPageRoutingModule } from './bots-routing.module';

// import { VideoTileComponent } from "../video-tile/video-tile.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    BotsPageRoutingModule
  ],
  declarations: [BotsPage,
    // VideoTileComponent
  ]
})
export class BotsPageModule {}
