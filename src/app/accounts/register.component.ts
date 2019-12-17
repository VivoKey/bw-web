import { Component } from '@angular/core';
import {
    ActivatedRoute,
    Router,
} from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { ApiService } from 'jslib/abstractions/api.service';
import { AuthService } from 'jslib/abstractions/auth.service';
import { CryptoService } from 'jslib/abstractions/crypto.service';
import { I18nService } from 'jslib/abstractions/i18n.service';
import { PasswordGenerationService } from 'jslib/abstractions/passwordGeneration.service';
import { PlatformUtilsService } from 'jslib/abstractions/platformUtils.service';
import { StateService } from 'jslib/abstractions/state.service';
import { ConsumeOIDCService } from '../services/consumeoidc.service';
import { RegisterComponent as BaseRegisterComponent } from 'jslib/angular/components/register.component';

import { UrlHelperService } from '../services/url-helper.service';
@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    providers: [ConsumeOIDCService]
})
export class RegisterComponent extends BaseRegisterComponent {
    showCreateOrgMessage = false;
    showTerms = true;
    oidcstate: string;
    oidccode: string;
    oidcauth: any;
    oidcinfo: any;

    oidcservice: ConsumeOIDCService;

    constructor(authService: AuthService, router: Router,
        i18nService: I18nService, cryptoService: CryptoService,
        apiService: ApiService, private route: ActivatedRoute, private urlHelper: UrlHelperService,
        stateService: StateService, platformUtilsService: PlatformUtilsService,
        passwordGenerationService: PasswordGenerationService, private consumeOIDCService: ConsumeOIDCService) {
        super(authService, router, i18nService, cryptoService, apiService, stateService, platformUtilsService,
            passwordGenerationService);
        this.oidcservice = consumeOIDCService;
        this.showTerms = !platformUtilsService.isSelfHost();
    }

    async ngOnInit() {
        const qParams = this.urlHelper.getHashFragmentParams();
        if (qParams.email != null && qParams.email.indexOf('@') > -1) {
            this.email = qParams.email;
        }
        if (qParams.premium != null) {
            this.stateService.save('loginRedirect', { route: '/settings/premium' });
        } else if (qParams.org != null) {
            this.showCreateOrgMessage = true;
            this.stateService.save('loginRedirect',
                { route: '/settings/create-organization', qParams: { plan: qParams.org } });
        }
        if (qParams.state != null) {
            this.oidcstate = qParams.state;
            
        }
        if (qParams.code != null) {
            this.oidccode = qParams.code;
        }
        if (this.oidcstate == "login") {
            this.router.navigate(['login'], { queryParams: { state: this.oidcstate, code: this.oidccode} });
        }
        if (this.oidcstate == "unlock") {
            this.router.navigate(['lock'], { queryParams: { state: this.oidcstate, code: this.oidccode } });

        }
    }

    async ngAfterViewInit() {
        if (this.oidcstate == "register") {
            this.oidcauth = await this.consumeOIDCService.getBearerToken(this.oidccode);
            this.oidcinfo = await this.consumeOIDCService.getUserInfo(this.oidcauth);
            this.name = this.oidcinfo.name;
            this.email = this.oidcinfo.email;
            this.masterPassword = this.oidcinfo.sub;
            this.confirmMasterPassword = this.oidcinfo.sub;
            super.supsubmit();
        }
        
    }
    async submit() {
        super.supsubmit();
    }
    


}

