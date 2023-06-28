import { Component } from '@angular/core';
import { ZebraIoTConnectorService } from '../services/zebra-iot-connector-service';
import { ReadTagEventModel } from '../models/read-tag-event-model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent {

  public writeSettingsForm = this.formBuilder.group({
    tagId: '',
    memoryBank: '',
    data: ''
  });

  public tagDataList :  Array<any> = new Array<any>();

  constructor(private _zebraIoTConnectorService : ZebraIoTConnectorService, private formBuilder: FormBuilder){ }

  ngOnInit(): void {
    this._zebraIoTConnectorService.newTagAccessOpEvent.subscribe((tagData : ReadTagEventModel) => {
      // Check if we've received an array of tag or just one tag
      if(Array.isArray(tagData.data)){
        tagData.data.filter(x => x.type == "CUSTOM").forEach(singleData => {

          let newTag : any;
          newTag.data = singleData
          newTag.type = tagData.type,
          newTag.timestamp = tagData.timestamp
          this.tagDataList.unshift(tagData);

        });
      }
      else{
        if(tagData.type == "CUSTOM") {
          this.tagDataList.length
          this.tagDataList.unshift(tagData);
        }
      }
    })
  }

  
  writeTag() {
    this._zebraIoTConnectorService.setWriteMode(this.writeSettingsForm.value.tagId!, this.writeSettingsForm.value.memoryBank!, this.writeSettingsForm.value.data!)
  }

  start(){
    this._zebraIoTConnectorService.startOperation()
  }
  stop(){
    this._zebraIoTConnectorService.stopOperation()
  }
}
