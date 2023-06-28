import { Component, OnInit } from '@angular/core';
import { ReadTagEventModel } from '../models/read-tag-event-model';
import { ZebraIoTConnectorService } from '../services/zebra-iot-connector-service';
//import {MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.css']
})
export class ReadingComponent implements OnInit {

  public tagDataList: Array<any> = new Array<any>();

  constructor(private _zebraIoTConnectorService: ZebraIoTConnectorService) { }

  ngOnInit(): void {
    this._zebraIoTConnectorService.newTagAccessOpEvent.subscribe((tagData: ReadTagEventModel) => {
      // Check if we've received an array of tag or just one tag
      if (Array.isArray(tagData.data)) {
        tagData.data.filter(x => x.type != "CUSTOM").forEach(singleData => {

          let newTag: any;
          newTag.data = singleData
          newTag.type = tagData.type,
            newTag.timestamp = tagData.timestamp
          this.tagDataList.unshift(tagData);

        });
      }
      else {
        if (tagData.type != "CUSTOM") {
          this.tagDataList.length
          this.tagDataList.unshift(tagData);
        }
      }
    })
  }
  start() {
    this._zebraIoTConnectorService.setReadMode()
    this._zebraIoTConnectorService.startOperation()
  }
  stop() {
    this._zebraIoTConnectorService.stopOperation()
  }
  getToastMessage(): string {
    return "test"
  }
}
