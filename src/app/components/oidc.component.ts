import {
    Input,
    OnInit,
} from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { AuthResult } from '../../models/domain/authResult';

import { AuthService } from '../../abstractions/auth.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { StateService } from '../../abstractions/state.service';
import { StorageService } from '../../abstractions/storage.service';

import { ConstantsService } from '../../services/constants.service';

import { Utils } from '../../misc/utils';
export class OIDCComponent implements OnInit {
    oidcstate = '';
    oidccode = '';
    constructor(private route: ActivatedRoute, private router: Router) {}


    ngOnInit() {
        this.oidcstate = this.route.snapshot.params.state;
        this.oidccode = this.route.snapshot.params.code;
        let navExtra: NavigationExtras = {
            queryParams: {
                // TODO: get the oidc access token via code, then get user details and pre-fill the reg form (somehow getting a password!)
            }
        }
        }
    }
}
