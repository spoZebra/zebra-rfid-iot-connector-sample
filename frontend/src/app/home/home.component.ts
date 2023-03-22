import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ZebraRmInterfaceService } from '../services/zebra-rm-interface-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public readerList : Array<any> = new Array<any>();
  public searchReaderForm = this.formBuilder.group({
    hostname: '',
    username: '',
    password: ''
  });

  constructor(private _zebraRmInterfaceService: ZebraRmInterfaceService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this._zebraRmInterfaceService.newReaderDiscovered.subscribe((item : any) => {
      if(item.result == "Success"){
        this.readerList.unshift(item);
      }
    })

    // Start discovery using my middleware
    this._zebraRmInterfaceService.startDiscovery();
  }

  onSearch(){
    this._zebraRmInterfaceService.login(
      this.searchReaderForm.value.hostname!,
      this.searchReaderForm.value.username!,
      this.searchReaderForm.value.password!).subscribe(res => {
        console.log(res);
      })
  }
}
