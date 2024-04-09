import { Injectable, HostListener } from '@angular/core';
import DailyIframe, {
  DailyCall,
  DailyEventObjectAppMessage,
} from "@daily-co/daily-js";
import {ToastService} from './toast-service.service'


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

  show_supervise_request = false
  request_from_bot_id = ''

  // house all the communication record
  incoming_log_list = []
  outgoing_log_list = []

  // flag if bot is in the meeting
  public hasBotParticipant = false;

  constructor(public toastService:ToastService) {
    console.log('DS ', this.screenWidth, ':', this.screenHeight )
    this.callObject = <DailyCall>DailyIframe.getCallInstance();
    console.log(' this.callObject  : ', this.callObject  );
    if (!this.callObject) return;
  }

  sendMessage(msg:object, target:String){
    console.log(' msg : ', msg );
    this.callObject.sendAppMessage({
      msg: msg,
      target: target,
      from: 'HUBS',
    });
  }


  /**
   * IN - from BRAIN
   */

  show_approval_request(from_bot_id:string){
    this.show_supervise_request = true
    this.request_from_bot_id = from_bot_id
  }

  show_help_msg(){

  }



  /**
   * OUT - To BRAIN
   */

  grant_supervise_approval(bot_id:string):void {
    const msg = {
      "type": "approval",
      "name": "grant_supervise_approval",
      "timestamp": ""
    }
    this.sendMessage(msg, bot_id)
    this.toastService.simpleToast('Approval granted', 2000)
    this.show_supervise_request = false
    this.request_from_bot_id = ''

  }

  start_driver_mode(bot_id:string):void{
    const msg = {
      "type": "command",
      "name": "start_driver_mode",
      "timestamp": ""
    }
    this.sendMessage(msg, bot_id)
  }

  end_driver_mode(bot_id:string):void{
    const msg = {
      "type": "command",
      "name": "end_driver_mode",
      "params" : {
        position : "" // position of the bot to restart NAV
      },
      "timestamp": ""
    }
    this.sendMessage(msg, bot_id)
  }

  set_video_res(size:String, bot_id:string){
    const msg = {
      "type": "command",
      "name": "set_video_res",
      "params" : {
        size : size // l or m or s
      },
      "timestamp": ""
    }
    this.sendMessage(msg, bot_id)
  }



}
