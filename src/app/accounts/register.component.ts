import { Component } from '@angular/core';
import {
    ActivatedRoute,
    Router,
} from '@angular/router';

import { ApiService } from 'jslib/abstractions/api.service';
import { AuthService } from 'jslib/abstractions/auth.service';
import { CryptoService } from 'jslib/abstractions/crypto.service';
import { I18nService } from 'jslib/abstractions/i18n.service';
import { PasswordGenerationService } from 'jslib/abstractions/passwordGeneration.service';
import { PlatformUtilsService } from 'jslib/abstractions/platformUtils.service';
import { StateService } from 'jslib/abstractions/state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterComponent as BaseRegisterComponent } from 'jslib/angular/components/register.component';

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
})
export class RegisterComponent extends BaseRegisterComponent {
    showCreateOrgMessage = false;
    showTerms = true;
    protected headerstok: {};
    protected headersid: {};
    protected oidctok: JSON;
    protected jsoninfo: {
        "email": "",
        "full_name": "",
        "sub": ""
    };
    oidcstate = '';
    oidccode = '';
    protected oidctoken = '';

    constructor(authService: AuthService, router: Router,
        i18nService: I18nService, cryptoService: CryptoService,
        apiService: ApiService, private route: ActivatedRoute,
        stateService: StateService, platformUtilsService: PlatformUtilsService,
        passwordGenerationService: PasswordGenerationService, private http: HttpClient) {
        super(authService, router, i18nService, cryptoService, apiService, stateService, platformUtilsService,
            passwordGenerationService);
        this.showTerms = !platformUtilsService.isSelfHost();
    }

    ngOnInit() {
        const queryParamsSub = this.route.queryParams.subscribe((qParams) => {
            if (qParams.state != null) {
                // State from OIDC redirect
                this.oidcstate = qParams.state; 
            }
            if (qParams.code != null) {
                this.oidccode = qParams.code;
            }
            
            if (queryParamsSub != null) {
                queryParamsSub.unsubscribe();
            }
        });
        if (this.oidcstate != null) {
            if (this.oidcstate = 'login') {
                this.router.navigate(['login']);
            } else {
                this.headersid = new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': "Basic MTA3MzI4Njg1ODI6M2MwOTAyNjQwOGRhODZkZTJmMTI0NTAyNGQ4YTFhMzE1MDIzNGE3ZDIzNjA1NDExNWQ5OGJlOTc="
                });
                this.http.post("https://api.vivokey.com/openid/token/", "?redirect_uri=https://bitwarden.vivokey.com/%23/register&grant_type=authorization_code&code=" + this.oidccode, this.headersid)
                    .subscribe(
                        (jstok: string) => { this.oidctok = JSON.parse(jstok) },
                        () => {
                            this.router.navigate(["login"])
                        },
                        () => { this.loadToken() });
            }
        }

        
        
    }
    loadToken() {
        this.headerstok = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization: Bearer ': this.oidctoken
        });
        this.http.post("https://api.vivokey.com/openid/userinfo/", this.headerstok)
            .subscribe(
                (jstok: string) => { this.jsoninfo = JSON.parse(jstok) },
                () => { 
                    this.email = null;
                    this.name = null;
                    this.masterPassword = null;
                },
                () => {
                    this.email = this.jsoninfo.email;
                    this.name = this.jsoninfo.full_name;
                    this.masterPassword = this.jsoninfo.sub;
                });
    }
}
