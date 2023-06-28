import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { ReadTagEventModel as AccessOperationTagEventModel } from '../models/read-tag-event-model';
import { SendCommandModel } from '../models/send-command-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ZebraIoTConnectorService implements OnInit {

  public newTagAccessOpEvent: EventEmitter<AccessOperationTagEventModel> = new EventEmitter<AccessOperationTagEventModel>();
  public newInferfaceEvent: EventEmitter<any> = new EventEmitter<any>();

  public newControlEvent: EventEmitter<IMqttMessage> = new EventEmitter<IMqttMessage>();
  public newManagementEvent: EventEmitter<IMqttMessage> = new EventEmitter<IMqttMessage>();

  private dataInterface: string = "data"
  private controlInterfaceCmd: string = "ctr/cmd"
  private managementInterfaceCmd: string = "mgmt/cmd"

  constructor(private _mqttService: MqttService, private httpClient: HttpClient) {
    this.subscribeToTopicData()
    this.subscribeToAllTopic()
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.newTagAccessOpEvent.unsubscribe();
    this.newInferfaceEvent.unsubscribe();
  }

  subscribeToTopicData(): void {
    this._mqttService.observe(this.dataInterface).subscribe((message: IMqttMessage) => {
      let item: AccessOperationTagEventModel = JSON.parse(message.payload.toString());

      this.newTagAccessOpEvent.emit(item)
      console.log('New TagData event - Message: ' + message.payload.toString() + '<br> for topic: ' + message.topic);
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

  setReadMode() {
    this.getConfigFile('read-op-mode.json').subscribe(configRead => {
      this._mqttService.unsafePublish(this.managementInterfaceCmd, new SendCommandModel("set_mode", configRead).toJson(), { qos: 0, retain: false });
    });
  }

  setWriteMode(tagId : String, memoryBank : String, data : String) {
    this.getConfigFile('write-op-mode.json').subscribe(configWrite => {

      configWrite.filter.value = tagId;

      // Modifying the data property of each accessed object
      configWrite.accesses.forEach((access: any) => {
        if (access.config.data) {
          access.config.data = data;
        }
      });

      // Modifying the memorybank property of each accessed object
      configWrite.accesses.forEach((access: any) => {
        access.config.membank = memoryBank;
      });

      this._mqttService.unsafePublish(this.managementInterfaceCmd, new SendCommandModel("set_mode", configWrite).toJson(), { qos: 0, retain: false });
      this.startOperation()
    });
  }

  getInfo() {
    this._mqttService.unsafePublish(this.managementInterfaceCmd, new SendCommandModel("get_info").toJson(), { qos: 0, retain: false });
  }
  startOperation() {
    this._mqttService.unsafePublish(this.controlInterfaceCmd, new SendCommandModel("start").toJson(), { qos: 0, retain: false });
  }
  stopOperation() {
    this._mqttService.unsafePublish(this.controlInterfaceCmd, new SendCommandModel("stop").toJson(), { qos: 0, retain: false });
  }


  getConfigFile(fileName: String) {
    return this.httpClient.get<any>('assets/' + fileName);
  }
}