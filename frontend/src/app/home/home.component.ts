import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ZebraRmInterfaceService } from '../services/zebra-rm-interface-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public readerList: Array<any> = new Array<any>();
  public searchReaderForm = this.formBuilder.group({
    hostname: '',
    username: '',
    password: ''
  });
  public configureReader = this.formBuilder.group({
    username: '',
    password: ''
  });

  public discovering: Boolean = false;

  constructor(private _zebraRmInterfaceService: ZebraRmInterfaceService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this._zebraRmInterfaceService.newReaderDiscovered.subscribe((item: any) => {
      if (item.result == "Success" && this.readerList.find(x => x.address == item.address) == null) {
        item.flipped = false;
        this.readerList.unshift(item);
      }
    })
  }

  startDiscovery() {
    // Start discovery using my middleware
    this._zebraRmInterfaceService.startDiscovery();
    this.discovering = true;
  }

  onSearch() {
    this._zebraRmInterfaceService.login(
      this.searchReaderForm.value.hostname!,
      this.searchReaderForm.value.username!,
      this.searchReaderForm.value.password!).subscribe(res => {
        console.log(res);
        if (res.sessionId) {
          document.getElementById("closeModal")?.click();
          this.readerList.unshift(
            {
              address: this.searchReaderForm.value.hostname, 
              model: "Unknown", 
              friendlyName: "Manually Added", 
              fwVersion: "Unknown", 
              serialNumber: "Unknown",
              username: this.searchReaderForm.value.username!,
              password: this.searchReaderForm.value.password!
            }
          );
        }
      })
  }

  toggleConfiguration(reader : any) {
    this.readerList.find(x => x.address == reader.address).flipped = !reader.flipped;
  }

  onReaderConfigure(reader: any) {
    var myReader = this.readerList.find(x => x.address == reader.address);
    myReader.flipped = true;
    myReader.username = this.configureReader.value.username
    myReader.password = this.configureReader.value.password

    this._zebraRmInterfaceService.login(
      myReader.address,
      this.configureReader.value.username!,
      this.configureReader.value.password!).subscribe((req: any) => {

        if(req.error){
          this.configureReader.setErrors(req.error)
          return
        }
        
        this._zebraRmInterfaceService.getTargetCloudConfig().subscribe((data) => {
          this._zebraRmInterfaceService.setCloudConfig(myReader.address, req.sessionID, data).subscribe(() => {
            myReader.isConfigured = true;
            myReader.flipped = false;
            this._zebraRmInterfaceService.connectToCloud(myReader.address, req.sessionID).subscribe(() => {
            })
          })
        })
      })
  }

}
