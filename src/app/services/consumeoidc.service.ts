import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogService } from './log.service';



@Injectable({
    providedIn: 'root',
})
export class ConsumeOIDCService {
    oidctok: any;
    
    tokencall: string;
    userinfo: any;

    constructor(private http: HttpClient, private log: LogService) {
        
    }

    async getBearerToken(token: string) {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Basic MTA3MzI4Njg1ODI6M2MwOTAyNjQwOGRhODZkZTJmMTI0NTAyNGQ4YTFhMzE1MDIzNGE3ZDIzNjA1NDExNWQ5OGJlOTc=').set('Content-Type', 'application/x-www-form-urlencoded');
        this.tokencall = "redirect_uri=https://bitwarden.vivokey.com/%23/register&grant_type=authorization_code&code=".concat(token);
        try {
            let jstok: string = await this.http.post<string>("https://api.vivokey.com/openid/token/", this.tokencall, { headers }).toPromise();
            this.log.log(jstok);
            this.oidctok = JSON.parse(jstok);

        } catch (err) {
            this.log.log(err);
            this.log.log(this.tokencall);
            this.log.log(headers);
        } finally {
            this.log.log(this.oidctok);
            return this.oidctok;
        }
        
    }

    async getUserInfo(token: any) {
        let headers2 = new HttpHeaders();
        headers2 = headers2.set('Authorization', 'Bearer ' + token.access_token).set('Content-Type', 'application/x-www-form-urlencoded');
        try {
            let infotok = await this.http.post<string>("https://api.vivokey.com/openid/userinfo/", {headers2}).toPromise();
            let infojs = JSON.parse(infotok);
            this.userinfo = {
                'name': infojs.full_name,
                'email': infojs.email,
                'sub': infojs.sub
            };
        } catch(err) {
        this.log.log(err);
        this.log.log(headers2);
        }
        return this.userinfo;
    }
        



}
