import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { LogService } from './log.service';



@Injectable({
    providedIn: 'root',
})
export class ConsumeOIDCService {
    
    tokenresp: string;
    tokencall: string;
    userinfo: any;
    private masterPass: string;
    private email: string;
    private name: string;

    constructor(private http: HttpClient, private log: LogService) {
        
    }

    async getBearerToken(token: string) {
        // Pass-thru function due to rebuild of authentication
        return token;
        
    }

    async getUserInfo(token: string) {
        
        try {
            let infotok = await this.http.get<any>("https://vault.vivokey.com/bwauth/webapi/getauth?code=" + token).toPromise();

            this.userinfo = {
                'name': infotok.name,
                'email': infotok.email,
                'passwd': infotok.passwd,
                'new': infotok.new
            };
        } catch(err) {
        }
        return this.userinfo;
    }
    setInfo(em: string, pass: string, nme: string) {
        // Set the info for storage
        console.log("Setting info.");
        this.email = em;
        this.name = nme;
        this.masterPass = pass;        
    }
    getInfo() {
        // Build info 
        if (this.name != null) {
            console.log("Returning info.");
            let loinfo = {
                'name': this.name,
                'email': this.email,
                'passwd': this.masterPass
            };
            return loinfo;
        } else {
            return null;
        }
    }

    isInfo() {
        // Is there info?
        if (this.name != null) {
            return true;
        } else {
            return false;
        }
    }

    clearInfo() {
        this.name = '';
        this.email = '';
        this.masterPass = '';
    }
        



}
