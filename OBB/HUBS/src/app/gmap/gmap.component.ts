import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
})
export class GmapComponent  implements OnInit {

  public apiLoaded: any = false;
  public markers: Array<any> = [];
  public period = 10000;
  public iconStr = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

  public options: google.maps.MapOptions = {
    center: {lat: -33.853759, lng: 151.212803}, // Sydney Harbour center
    zoom: 14,
  };

  

  constructor() { }

  ngOnInit() {}



}
