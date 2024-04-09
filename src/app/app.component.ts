import { Component, ViewChild, HostListener } from '@angular/core';
import {DailyContainerComponent} from './daily-container/daily-container.component'
import {DataService} from './service/data.service'
import {GoogleMap, MapMarker} from '@angular/google-maps';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  @ViewChild(DailyContainerComponent) dailyContainer?:DailyContainerComponent;
  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap;
  @ViewChild(MapMarker, { static: false }) myMarker!: MapMarker;

  /**
   * Google Map & markers
   * https://timdeschryver.dev/blog/google-maps-as-an-angular-component#mapmarker
   */
  zoom = 17;
  center: google.maps.LatLngLiteral = {lat: 22.3067466710076, lng: 114.16703861169101};
  gMapOptions: google.maps.MapOptions = {
    // mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    // disableDoubleClickZoom: true,
    maxZoom: 18,
    minZoom: 12,
  };

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];


  markers:any[] = [];

  isFlashing = false;

  constructor(
    // public dailyContainer: DailyContainerComponent
    public dataService: DataService
    ) {
      // this.center.lat = 22.3067466710076;
      // this.center.lng = 114.16703861169101;

      this.addMarker()
      const interval = setInterval(() => {

        this.myMarker?.marker?.setPosition({
          lat: this.markers[0].position.lat += ((Math.random() - 0.5) * 2) / 20000,
          lng: this.markers[0].position.lng += ((Math.random() - 0.5) * 2) / 20000

        });
        // console.log(this.markers[0].position.lat, this.markers[0].position.lng)

        // this.markers.forEach(marker => {
        //   marker.position.lat += ((Math.random() - 0.5) * 2) / 10;
        //   marker.position.lng += ((Math.random() - 0.5) * 2) / 10;
        //   console.log(marker.position.lat, marker.position.lng)
        // });
      }, 2000); // Run the code every 2 seconds

    }

  /**
   * Disconnect and reconncet video
   */
  // isConnected = true;
  // toggleConnection(){
  //   if (this.isConnected){
  //     this.dailyContainer.callEnded();
  //     this.isConnected = false;
  //   }
  //   else{
  //     this.dailyContainer.joinCall();
  //     this.isConnected = true;
  //   }
  // }

  /**
   * update screen size (variable stored in dataService)
   */
  // @HostListener('window:resize', ['$event'])
  // onWindowResize() {
  //   this.dataService.screenWidth = window.innerWidth;
  //   this.dataService.screenHeight = window.innerHeight;
  //   console.log('updated ', this.dataService.screenWidth, ':', this.dataService.screenHeight )
  // }

  toggleAnimation() {
    this.isFlashing = !this.isFlashing;
  }

  click(event: google.maps.MapMouseEvent) {
    console.log(event);
  }

  addMarker() {
    this.markers.push({
      position: {
        lat: this.center.lat, //+ ((Math.random() - 0.5) * 2) / 10,
        lng: this.center.lng //+ ((Math.random() - 0.5) * 2) / 10,
      },
      label: {
        color: 'black',
        text: 'Bot ' + (this.markers.length + 1),
        fontWeight: 'bold'
      },
      title: 'Marker title ' + (this.markers.length + 1),
      options: { animation: google.maps.Animation.DROP },
    });
  }

  dev_set_video_res(size:String){
    // this.dataService.sendMessage(`test567-${size}`, 'hubs')
    this.dataService.set_video_res(size, 'test-bot')
  }


}
