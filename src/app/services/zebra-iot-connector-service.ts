import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { ReadTagEventModel } from '../models/read-tag-event-model';

@Injectable({
  providedIn: 'root',
})
export class ZebraIoTConnectorService implements OnInit { 

    public newTagDataReadEvent: EventEmitter<ReadTagEventModel> = new EventEmitter<ReadTagEventModel>(); 
    public newControlEvent: EventEmitter<IMqttMessage> = new EventEmitter<IMqttMessage>();
    public newManagementEvent: EventEmitter<IMqttMessage> = new EventEmitter<IMqttMessage>();

    
    constructor(private _mqttService: MqttService) { 
      this.subscribeToTopicData()}

    ngOnInit(): void {
        //this.subscribeToTopic("control")
        //this.subscribeToTopic("management")
    }
  
    ngOnDestroy(): void {
        this.newTagDataReadEvent.unsubscribe();
        //this.newControlEvent.unsubscribe();
        //this.newManagementEvent.unsubscribe();
    }
  
    subscribeToTopicData(): void {
      this._mqttService.observe("data").subscribe((message: IMqttMessage) => {
        let item : ReadTagEventModel = JSON.parse(message.payload.toString());
        
        this.newTagDataReadEvent.emit(item)
        console.log('New TagReadData event - Message: ' + message.payload.toString() + '<br> for topic: ' + message.topic);
      });

      console.log('subscribed to topic DATA')
    }
}