import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public searchReaderForm = this.formBuilder.group({
    name: '',
    address: ''
  });

  constructor(private formBuilder: FormBuilder) {}


  onSearch(){

  }
}
