import { Component, OnInit } from '@angular/core';
import { ReadTagEventModel } from '../models/read-tag-event-model';
import { TagDataModel } from '../models/tag-data-model';
import { ZebraIoTConnectorService } from '../services/zebra-iot-connector-service';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.css']
})
export class ReadingComponent implements OnInit {

  public tagDataList :  Array<TagDataModel> = new Array<TagDataModel>();

  constructor(private _zebraIoTConnectorService : ZebraIoTConnectorService){ }

  ngOnInit(): void {
    this._zebraIoTConnectorService.newTagDataReadEvent.subscribe((tagData : ReadTagEventModel) => {
      // Check if we've received an array of tag or just one tag
   /*   if(Array.isArray(tagData.data)){
          let item : Array<TagDataModel> = JSON.parse(tagData.data);
          this.tagDataList.concat(item);
      }
      else{*/
         let item : TagDataModel = JSON.parse(tagData.data.toString());
         this.tagDataList.push(item);
    //  }
    })
  }
}
