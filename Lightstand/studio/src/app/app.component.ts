import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastServiceService } from './service/toast-service.service'
import { AlertController } from '@ionic/angular';
// import {AuthenticationService} from './service/auth/authentication.service'
import { DatabaseService } from './service/database.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Asset', url: '/asset', icon: 'mail' },
    { title: 'Stage', url: '/stage', icon: 'paper-plane' },
    { title: 'Refine', url: '/refine', icon: 'heart' },
    { title: 'Export', url: '/export', icon: 'heart' },

  ];


  constructor(public modal: ModalController,
    public toastService: ToastServiceService,
    public databaseService: DatabaseService,
    // public authService: AuthenticationService,
    ) {}



}
