import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
            let infotok = await this.http.get<any>("https://bitwarden.vivokey.com:8080/").toPromise();

            this.userinfo = {
                'name': infotok.name,
                'email': infotok.email,
                'sub': infotok.sub,
                'passwd': infotok.passwd
            };
        } catch(err) {
        }
        return this.userinfo;
    }
        



}
