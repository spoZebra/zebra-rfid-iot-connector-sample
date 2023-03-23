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
      if (item.result == "Success") {
        item.isFlipped = false;
        this.readerList.unshift(item);
      }
    })
    this.readerList.unshift(
      {
        address: this.searchReaderForm.value.hostname, 
        model: "Unknown", 
        friendlyName: "Manually Added", 
        fwVersion: "Unknown", 
        serialNumber: "Unknown",
        username: this.searchReaderForm.value.username!,
        password: this.searchReaderForm.value.password!,
        isFlipped: false,
      }
    );
    this.readerList.unshift(
      {
        address: this.searchReaderForm.value.hostname, 
        model: "Unknown", 
        friendlyName: "Manually Added", 
        fwVersion: "Unknown", 
        serialNumber: "Unknown",
        username: this.searchReaderForm.value.username!,
        password: this.searchReaderForm.value.password!,
        isFlipped: false,
      }
    );
    
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
  

  flipCard(reader: any) {
    this.readerList[0].isFlipped = true;

    this._zebraRmInterfaceService.login(
      this.searchReaderForm.value.hostname!,
      this.searchReaderForm.value.username!,
      this.searchReaderForm.value.password!)
  }

}
