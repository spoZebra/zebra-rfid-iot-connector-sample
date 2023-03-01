export class SendCommandModel {
    public command: string = "";
    public command_id: string = "";
    public payload: any;
    public constructor(command : string, payload : any = {} as JSON) {
        this.command = command
        this.payload = payload
        this.command_id = new Date().getUTCMilliseconds().toString()
    }

    toJson(){
        return JSON.stringify(this)
   }
}