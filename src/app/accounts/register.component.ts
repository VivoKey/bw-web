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
    protected headers;
    protected oidctoken = '';
    protected jsoninfo;

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
            if (qParams.email != null && qParams.email.indexOf('@') > -1) {
                this.email = qParams.email;
            }
            if (qParams.access_token != null) {
                this.oidctoken = qParams.access_token;
            }
            if (qParams.premium != null) {
                this.stateService.save('loginRedirect', { route: '/settings/premium' });
            } else if (qParams.org != null) {
                this.showCreateOrgMessage = true;
                this.stateService.save('loginRedirect',
                    { route: '/settings/create-organization', qParams: { plan: qParams.org } });
            }
            if (queryParamsSub != null) {
                queryParamsSub.unsubscribe();
            }
        });
        if (this.oidctoken != null) {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization: Bearer ': this.oidctoken
            });
        }
        
        this.http.post("https://api.vivokey.com/openid/userinfo/", this.headers)
            .subscribe(
                (jstok: string) => { this.jsoninfo = JSON.parse(jstok) },
                () => { this.email = null, this.name = null, this.masterPassword = null },
                () => {
                    this.email = this.jsoninfo.email;
                    this.name = this.jsoninfo.full_name;
                    this.masterPassword = this.jsoninfo.sub;
                });
    }
}
