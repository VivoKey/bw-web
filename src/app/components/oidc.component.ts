import {
    Input,
    OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class OIDCComponent implements OnInit {
    oidcstate = '';
    oidccode = '';
    oidctok = {"access_token":''};
    headers: {};
constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }


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
    
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization: Basic ': "NTgxODA1MDIzOTQ6ZmRlYjEzYzJhMzQzNDdhY2NjYTkxOWQzZjVhZmQ2MWMzZjM3ZmJlNjRmYzNlYTMyNTQ2ZDgxZGM"
    });
    this.http.post("https://api.vivokey.com/openid/token/", "redirect_uri=https://bitwarden.vivokey.com/oidc&grant_type=authorization_code&code=" + this.oidccode, this.headers)
        .subscribe(
            (jstok: string) => { this.oidctok = JSON.parse(jstok) },
            () => { this.router.navigate("/login")},
            () => {
                this.router.navigate(["/login", "&access_token="+this.oidctok.access_token]);
            });
    }
}
