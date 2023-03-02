import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ZebraIoTConnectorService } from '../services/zebra-iot-connector-service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  @ViewChild('chatList') chatList!: ElementRef;

  public interfaceMessages :  Map<string, Array<any>> = new Map<string, Array<any>>();

  constructor(public _zebraIoTConnectorService : ZebraIoTConnectorService) {}

  ngOnInit(): void {
    this._zebraIoTConnectorService.newInferfaceEvent.subscribe((message : any) => {
      // e.g. ctr/cmd => main topic is ctr
      let mainTopic = message.topic.split("/")[0];
      // Parse payload
      message.payload = JSON.parse(message.payload.toString())

      message.timestamp = new Date()
      message.isCommand = message.topic.endsWith("cmd") || message.topic.endsWith("cmd/")

      let array = this.interfaceMessages.get(mainTopic);
      if(array != null)
          array?.push(message);
      else{
          let array = new Array<any>();
          array.push(message);
          this.interfaceMessages.set(mainTopic, array);
      }
      this.scrollToBottom()
    })
  }

  scrollToBottom(): void {
    try {
        this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight;
    } catch(err) { 
      console.log(err)
    }
  }
  
  getSelectedList() : Array<any> {
    return this.interfaceMessages.get("ctr") ?? new Array<any>();
  }
  getSelectedListCount(interfaceTopic : string) : number {
    return (this.interfaceMessages.get(interfaceTopic) ?? new Array<any>()).length;
  }
}
