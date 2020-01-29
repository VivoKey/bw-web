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
                'passwd': infotok.passwd
            };
        } catch(err) {
        }
        return this.userinfo;
    }
        



}
