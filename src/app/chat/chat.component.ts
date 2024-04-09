import { Component, Input, HostListener } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {DataService} from '../service/data.service'
import DailyIframe, {
  DailyCall,
  DailyEventObjectAppMessage,
} from "@daily-co/daily-js";

interface Message {
  name: string;
  message: string;
}

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent {
  @Input() userName?: string;
  callObject?: DailyCall;
  messages: Array<Message> = [];
  chatIsOpen: boolean = false;

  // Listen to keys
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event)
    if (event.key === '1') {
        alert('1')
    }
    if (event.key === '!') {
        alert('shift 1')
    }
    if (event.key === '2') {
        alert('2')
    }
    if (event.key === '@') {
        alert('shift 2')
    }

  }

  constructor(private formBuilder: FormBuilder,
    public dataService: DataService) {}

  chatForm = this.formBuilder.group({
    message: "",
  });

  ngOnInit(): void {
    this.callObject = <DailyCall>DailyIframe.getCallInstance();
    if (!this.callObject) return;
    this.callObject.on("app-message", this.handleNewMessage);
  }

  ngOnDestroy(): void {
    if (!this.callObject) return;
    this.callObject.off("app-message", this.handleNewMessage);
    // Reset local var
    this.messages = [];
  }

  // Show/hide chat in UI
  toggleChatView(): void {
    this.chatIsOpen = !this.chatIsOpen;
  }

  /**
   * Handling new message, including to store it in a message array to be displayed in UI
   **/
  handleNewMessage = (e: DailyEventObjectAppMessage<any> | undefined): void => {
    if (!e) return;
    let msg = e.data
    console.log(' Incoming msg : ', msg );
    if (msg['type'] === 'request'){
      if (msg['name'] === "supervise_request"){
        this.dataService.show_approval_request(msg['from'])
      }
    }
    else if (msg['type'] === 'help'){
      this.dataService.show_help_msg()
    }




  };


  // Submit chat form if user presses Enter key while the textarea has focus
  onKeyDown(event: any): void {
    if (event.key === "Enter") {
      // Prevent a carriage return
      event.preventDefault();
      this.onSubmit();
    }
  }

  onSubmit(): void {
    const message = this.chatForm.value.message?.trim();
    if (!message) return;

    this.callObject?.sendAppMessage({
      message: message,
      name: this.userName,
    });
    // add your message to the chat (the app-message event does not get fired for your own messages, only other participants).
    this.messages.push({ message, name: "Me" });
    // clear the form input for your next message
    this.chatForm.reset();
  }








}
