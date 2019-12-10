import {
    Input,
    OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class OIDCComponent implements OnInit {
    oidcstate = '';
    oidccode = '';
    oidctok = '';
    headers;
    snap;
constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }


ngOnInit() {
    this.snap = this.route.snapshot.params;
    this.oidcstate = this.snap.state;
    this.oidccode = this.snap.code;
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization: Basic ': "NTgxODA1MDIzOTQ6ZmRlYjEzYzJhMzQzNDdhY2NjYTkxOWQzZjVhZmQ2MWMzZjM3ZmJlNjRmYzNlYTMyNTQ2ZDgxZGM"
    });
        // TODO: get the oidc access token via code, then get user details and pre-fill the reg form (somehow getting a password!)
    this.http.post("https://api.vivokey.com/openid/token/", "redirect_uri=https://bitwarden.vivokey.com/oidc&grant_type=authorization_code&code=" + this.oidccode, this.headers)
        .subscribe(
            (jstok: string) => { this.oidctok = JSON.parse(jstok) },
            () => { this.router.navigate("/")},
            () => {
                this.router.navigate(["/login", "&access_token="+this.oidctok.access_token]);
            });
    }
}
