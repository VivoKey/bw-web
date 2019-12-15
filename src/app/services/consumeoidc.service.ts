import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogService } from './log.service';



@Injectable({
    providedIn: 'root',
})
export class ConsumeOIDCService {
    headers: any;
    oidctok: {'access_token': ''};
    headers2: any;
    infotok: any;
    infojs: any;
    jstok: any;
    tokencall: string;

    constructor(private http: HttpClient, private log: LogService) {
        this.headers = new HttpHeaders('Authorization: Basic MTA3MzI4Njg1ODI6M2MwOTAyNjQwOGRhODZkZTJmMTI0NTAyNGQ4YTFhMzE1MDIzNGE3ZDIzNjA1NDExNWQ5OGJlOTc=');
    }

    async getBearerToken(token: string) {
        this.tokencall = "redirect_uri=https://bitwarden.vivokey.com/%23/register&grant_type=authorization_code&code=".concat(token);
        try {
            this.jstok = await this.http.post("https://api.vivokey.com/openid/token/", this.tokencall, this.headers).toPromise();
            this.oidctok = JSON.parse(this.jstok);
        } catch (err) {
            this.log.log(err);
        }

        return this.oidctok;
    }

    async getUserInfo(token: any) {
        this.headers2 = new HttpHeaders({
            'Authorization': "Bearer " + token.access_token
        })
        this.infotok = await this.http.post("https://api.vivokey.com/openid/userinfo/", this.headers2).toPromise();
        this.infojs = JSON.parse(this.infotok);
        return {
            'name': this.infojs.full_name,
            'email': this.infojs.email,
            'sub': this.infojs.sub
        };
    }
        



}
