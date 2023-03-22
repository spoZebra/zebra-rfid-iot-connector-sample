import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ZebraRmInterfaceService } from '../services/zebra-rm-interface-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public searchReaderForm = this.formBuilder.group({
    hostname: '',
    username: '',
    password: ''
  });

  constructor(public _zebraRmInterfaceService: ZebraRmInterfaceService, private formBuilder: FormBuilder) {}


  onSearch(){
    this._zebraRmInterfaceService.login(
      this.searchReaderForm.value.hostname!,
      this.searchReaderForm.value.username!,
      this.searchReaderForm.value.password!).subscribe(res => {
        console.log(res);
      })
  }
}
