import { Logger } from "@azure/functions";

export class Settings {
    public appKey: string;
    public appSecret: string;
    public userToken: string;
    public userTokenSecret: string;
    
    constructor(log:Logger) {
        this.appKey = process.env["appKey"] as string;
        this.appSecret = process.env["appSecret"] as string;
        this.userToken = process.env["userToken"] as string;
        this.userTokenSecret = process.env["userTokenSecret"] as string;

        if(!this.appKey){
            log.error("`appKey` not set. This is an error in configuration!");
        } else if (!this.appSecret){
            log.error("`appKey` was set, but `appSecret` was not. EVERTHING WILL FAIL!");
        }

        if(!this.userToken){
            log.error("`userToken` not set. This is an error in configuration!");
        } else if (!this.userTokenSecret){
            log.error("`userToken` was set, but `userTokenSecret` was not. EVERTHING WILL FAIL!");
        }    
    }
}