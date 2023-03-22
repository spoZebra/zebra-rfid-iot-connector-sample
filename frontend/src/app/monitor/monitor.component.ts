import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ZebraIoTConnectorService } from '../services/zebra-iot-connector-service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  public selectedInterface : string = "ctr"
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
      // TODO ADD AUTOSCROLL
    })
  }

  newInterfaceSelected(newInt : string){
    this.selectedInterface = newInt
  }

  
  getSelectedList() : Array<any> {
    return this.interfaceMessages.get(this.selectedInterface) ?? new Array<any>();
  }
  getSelectedListCount(interfaceTopic : string) : number {
    return (this.interfaceMessages.get(interfaceTopic) ?? new Array<any>()).length;
  }
}
