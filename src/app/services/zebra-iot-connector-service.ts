import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { ReadTagEventModel } from '../models/read-tag-event-model';
import { SendCommandModel } from '../models/send-command-model';

@Injectable({
  providedIn: 'root',
})
export class ZebraIoTConnectorService implements OnInit { 

    public newTagDataReadEvent: EventEmitter<ReadTagEventModel> = new EventEmitter<ReadTagEventModel>(); 
    public newInferfaceEvent: EventEmitter<any> = new EventEmitter<any>();

    public newControlEvent: EventEmitter<IMqttMessage> = new EventEmitter<IMqttMessage>();
    public newManagementEvent: EventEmitter<IMqttMessage> = new EventEmitter<IMqttMessage>();

    private dataInterface : string = "data"
    private controlInterface : string = "ctr/#"
    private controlInterfaceCmd : string = "ctr/cmd"
    
    constructor(private _mqttService: MqttService) { 
      this.subscribeToTopicData()
      this.subscribeToAllTopic()
    }

    ngOnInit(): void {
        //this.subscribeToTopic("control")
        //this.subscribeToTopic("management")
    }
  
    ngOnDestroy(): void {
        this.newTagDataReadEvent.unsubscribe();
        this.newInferfaceEvent.unsubscribe();
        //this.newManagementEvent.unsubscribe();
    }
  
    subscribeToTopicData(): void {
      this._mqttService.observe(this.dataInterface).subscribe((message: IMqttMessage) => {
        let item : ReadTagEventModel = JSON.parse(message.payload.toString());
        
        this.newTagDataReadEvent.emit(item)
        console.log('New TagReadData event - Message: ' + message.payload.toString() + '<br> for topic: ' + message.topic);
      });

      console.log('subscribed to topic DATA')
    }
    
    subscribeToAllTopic(): void {
      this._mqttService.observe("#").subscribe((message: IMqttMessage) => {
        let item = JSON.parse(message.payload.toString());
        
        this.newInferfaceEvent.emit(message)
        console.log('New event - Message: ' + message.payload.toString() + '<br> for topic: ' + message.topic);
      });

      console.log('subscribed to all topics')
    }

    startReading(){
      this._mqttService.unsafePublish(this.controlInterfaceCmd, new SendCommandModel("start").toJson(), { qos: 0, retain: false });
    }
    stopReading(){
      this._mqttService.unsafePublish(this.controlInterfaceCmd, new SendCommandModel("stop").toJson(), { qos: 0, retain: false });
    }
}