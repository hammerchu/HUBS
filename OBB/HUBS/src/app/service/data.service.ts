import { Injectable, HostListener } from '@angular/core';
import DailyIframe, {
  DailyCall,
  DailyEventObjectAppMessage,
} from "@daily-co/daily-js";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  /**
   *  This service contain most of the key variables
   */
  callObject: DailyCall;

  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  connection_speed = 0;
  connection_quality = 0;
  bandwidth = 0;
  latency = 0;

  latest_bot_messgae = ''
  latest_bot_messgae_timestamp = ''

  // flag if bot is in the meeting
  public hasBotParticipant = false;

  constructor() {
    console.log('DS ', this.screenWidth, ':', this.screenHeight )
    this.callObject = <DailyCall>DailyIframe.getCallInstance();
    console.log(' this.callObject  : ', this.callObject  );
    if (!this.callObject) return;
  }

  sendMessage(msg:String, name:String){
    console.log(' msg : ', msg );
    this.callObject.sendAppMessage({
      message: msg,
      name: name,
    });
  }



}
