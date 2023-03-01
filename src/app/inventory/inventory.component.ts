import { Component } from '@angular/core';
import { ZebraIoTConnectorService } from '../services/zebra-iot-connector-service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

  public tagDataList :  Map<string, any> = new Map<string, any>();
  public totalReadsCount : number = 0;

  constructor(private _zebraIoTConnectorService : ZebraIoTConnectorService){ }

  ngOnInit(): void {
    this._zebraIoTConnectorService.newTagDataReadEvent.subscribe((tagData : any) => {
      // Check if we've received an array of tag or just one tag
      if(Array.isArray(tagData.data)){
        tagData.data.forEach((singleData: any) => {

          let newTag : any;
          newTag.data = singleData
          newTag.type = tagData.type
          newTag.timestamp = tagData.timestamp
          this.tagDataList.set(newTag.data.idHex, newTag);
          this.totalReadsCount++;
        });
      }
      else{
        this.tagDataList.set(tagData.data.idHex, tagData);
        this.totalReadsCount++;
      } 
    })
  }

  start(){
    this._zebraIoTConnectorService.startReading()
  }
  stop(){
    this._zebraIoTConnectorService.stopReading()
  }
}
