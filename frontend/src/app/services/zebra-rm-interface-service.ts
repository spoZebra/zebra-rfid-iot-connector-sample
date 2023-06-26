import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ZebraRmInterfaceService implements OnInit {

    public newReaderDiscovered: EventEmitter<any> = new EventEmitter<any>();

    private discoveryTopic: string = "zebra/discovery"

    ngOnInit(): void {
    }

    constructor(private httpClient: HttpClient, private _mqttService: MqttService) {
        this.subscribeToTopicDiscovery()
    }

    ngOnDestroy(): void {
        this.newReaderDiscovered.unsubscribe();
    }

    subscribeToTopicDiscovery(): void {
        this._mqttService.observe(this.discoveryTopic).subscribe((message: IMqttMessage) => {
            let item = JSON.parse(message.payload.toString());
            this.newReaderDiscovered.emit(item)
            console.log('New reader discovered - Message: ' + message.payload.toString() + '<br> for topic: ' + message.topic);
        });

        console.log('subscribed to topic DATA')
    }

    startDiscovery() { 
        return  this.httpClient.post<string>("http://localhost:3000/rm/discovery/", {}).subscribe(() =>{})
    }

    login(hostname: string, username: string, password: string) {
        return this.httpClient.post<any>("http://localhost:3000/rm/login",
            {
                "hostname": hostname,
                "username": username,
                "password": password,
            });

    }

    setCloudConfig(host : string, sessionID: string, config : any) {
        return this.httpClient.post<any>("http://localhost:3000/rm/set-config/", 
        { 
            "host": host,
            "sessionID" :sessionID,                
            "data" :  config
        });
    }
    
   
    getTargetCloudConfig(): Observable<any> {
        return this.httpClient.get<any>('assets/cloud-config.json').pipe(
            map(data => {
                this.modifyHostName(data, "192.168.137.1");
                return data;
            })
        );
    }

    modifyHostName(obj: any, newHostName: string) {
        for (const prop in obj) {
            if (typeof obj[prop] === 'object') {
                this.modifyHostName(obj[prop], newHostName);
            } else if (prop === 'hostName') {
                obj[prop] = newHostName;
            }
        }
    }
  
    connectToCloud(host : string, sessionID: string) {
        return this.httpClient.post<any>("http://localhost:3000/rm/connect/", 
        { 
            "host": host,
            "sessionID" :sessionID
        });
    }
}