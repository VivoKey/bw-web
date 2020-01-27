import {
    Component,
    OnInit,
} from '@angular/core';

import { ToasterService } from 'angular2-toaster';
import { Angulartics2 } from 'angulartics2';

import { ApiService } from 'jslib/abstractions/api.service';
import { CryptoService } from 'jslib/abstractions/crypto.service';
import { I18nService } from 'jslib/abstractions/i18n.service';
import { MessagingService } from 'jslib/abstractions/messaging.service';
import { UserService } from 'jslib/abstractions/user.service';

import { KdfRequest } from 'jslib/models/request/kdfRequest';

import { KdfType } from 'jslib/enums/kdfType';

@Component({
    selector: 'app-change-kdf',
    templateUrl: 'change-kdf.component.html',
})
export class ChangeKdfComponent implements OnInit {
    masterPassword: string;
    kdfIterations: number;
    kdf = KdfType.PBKDF2_SHA256;
    kdfOptions: any[] = [];
    formPromise: Promise<any>;

    constructor(private apiService: ApiService, private i18nService: I18nService,
        private analytics: Angulartics2, private toasterService: ToasterService,
        private cryptoService: CryptoService, private messagingService: MessagingService,
        private userService: UserService) {
        this.kdfOptions = [
            { name: 'PBKDF2 SHA-256', value: KdfType.PBKDF2_SHA256 },
        ];
    }

    async ngOnInit() {
        this.kdf = await this.userService.getKdf();
        this.kdfIterations = await this.userService.getKdfIterations();
    }


}
