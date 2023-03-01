import { Component } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent {

  public dummyJsonObject : any = {"component":"RG","data":{"radio_control":{"antennas":{"1":"disconnected","2":"disconnected","3":"disconnected","4":"connected","5":"disconnected","6":"disconnected","7":"disconnected","8":"disconnected"},"cpu":0.1,"numDataMessagesTxed":3062,"numErrors":7,"numRadioPacketsRxed":186903,"numTagReads":3062,"numTagReadsPerAntenna":{"1":0,"2":0,"3":0,"4":3062,"5":0,"6":0,"7":0,"8":0},"numWarnings":0,"radioActivity":"inactive","radioConnection":"connected","ram":2.2,"status":"running","uptime":"05:19:28"},"reader_gateway":{"cpu":0.4,"dataPathStatistics":[{"numDataMessagesDropped":0,"numDataMessagesRetained":0,"numDataMessagesRxed":0,"numDataMessagesTxed":3062}],"interfaceConnectionStatus":{"data":[{"connectionError":"","connectionStatus":"connected","description":"server: ws://192.168.1.158:1997, ClientID: fx9600","interface":"mqtt"}]},"numDataMessagesRxedFromExt":3062,"numErrors":7,"numManagementEventsTxed":327,"numWarnings":0,"ram":2.9,"uptime":"5:19:29"},"system":{"GPI":{"1":"HIGH","2":"HIGH","3":"HIGH","4":"HIGH"},"GPO":{"1":"LOW","2":"LOW","3":"LOW","4":"LOW"},"cpu":{"system":7,"user":2},"flash":{"platform":{"free":12296192,"total":33554432,"used":21258240},"readerConfig":{"free":3198976,"total":4194304,"used":995328},"readerData":{"free":62447616,"total":67108864,"used":4661248},"rootFileSystem":{"free":27512832,"total":192937984,"used":165425152}},"ntp":{"offset":-1,"reach":377},"powerNegotiation":"DISABLED","powerSource":"DC","ram":{"free":108285952,"total":252334080,"used":144048128},"systemtime":"2023-03-01T13:57:20.135+0000","temperature":{"ambient":23,"pa":21},"uptime":"5:21:9"},"userapps":[]},"eventNum":328,"timestamp":"2023-03-01T13:57:29.126+0000","type":"heartbeat"}


}
