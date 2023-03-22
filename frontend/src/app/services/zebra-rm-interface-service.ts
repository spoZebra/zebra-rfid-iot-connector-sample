import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ZebraRmInterfaceService implements OnInit {

    ngOnInit(): void {
    } 
  
    constructor(private httpClient: HttpClient) { }

    login(hostname : string, username : string, password : string){
        return this.httpClient.post<string>("http://localhost:3000/rm/login", 
        {
            "hostname": hostname,
            "username": username,
            "password": password,
        });

    }
}