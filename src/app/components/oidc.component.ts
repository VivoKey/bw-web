import {
    Input,
    OnInit,
    Component,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { I18nService } from 'jslib/abstractions/i18n.service';
import { PlatformUtilsService } from 'jslib/abstractions/platformUtils.service';
@Component({
    selector: 'app-register',
    templateUrl: 'oidc.component.html',
})
export class OIDCComponent implements OnInit {
    oidcstate = '';
    oidccode = '';
    oidctok = {"access_token":''};
    headers: {};
    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, protected i18nService: I18nService, protected platformUtilsService: PlatformUtilsService) { }


ngOnInit() {
    const queryParamsSub = this.route.queryParams.subscribe((qParams) => {
        if (qParams.state != null) {
            this.oidcstate = qParams.state;
        }
        if (qParams.code != null) {
            this.oidccode = qParams.code;
        }
        if (queryParamsSub != null) {
            queryParamsSub.unsubscribe();
        }
    });
    
    this.headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': "Basic NTgxODA1MDIzOTQ6ZmRlYjEzYzJhMzQzNDdhY2NjYTkxOWQzZjVhZmQ2MWMzZjM3ZmJlNjRmYzNlYTMyNTQ2ZDgxZGM"
    });
    this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'),
        this.i18nService.t('emailRequired'));
    this.http.post("https://api.vivokey.com/openid/token/", "?redirect_uri=https://bitwarden.vivokey.com/%23/oidc&grant_type=authorization_code&code=" + this.oidccode, this.headers)
        .subscribe(
            (jstok: string) => { this.oidctok = JSON.parse(jstok) },
            () => { 
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'),
                    this.i18nService.t('emailRequired'));
                this.router.navigate(["register"])},
            () => {
                this.router.navigate(["register", "&access_token="+this.oidctok.access_token]);
            });
    }
}
