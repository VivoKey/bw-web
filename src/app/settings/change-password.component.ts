import {
    Component,
    OnInit,
} from '@angular/core';

import { ToasterService } from 'angular2-toaster';
import { Angulartics2 } from 'angulartics2';

import { ApiService } from 'jslib/abstractions/api.service';
import { CipherService } from 'jslib/abstractions/cipher.service';
import { CryptoService } from 'jslib/abstractions/crypto.service';
import { FolderService } from 'jslib/abstractions/folder.service';
import { I18nService } from 'jslib/abstractions/i18n.service';
import { MessagingService } from 'jslib/abstractions/messaging.service';
import { PasswordGenerationService } from 'jslib/abstractions/passwordGeneration.service';
import { PlatformUtilsService } from 'jslib/abstractions/platformUtils.service';
import { SyncService } from 'jslib/abstractions/sync.service';
import { UserService } from 'jslib/abstractions/user.service';

import { CipherString } from 'jslib/models/domain/cipherString';
import { SymmetricCryptoKey } from 'jslib/models/domain/symmetricCryptoKey';

import { CipherWithIdRequest } from 'jslib/models/request/cipherWithIdRequest';
import { FolderWithIdRequest } from 'jslib/models/request/folderWithIdRequest';
import { PasswordRequest } from 'jslib/models/request/passwordRequest';
import { UpdateKeyRequest } from 'jslib/models/request/updateKeyRequest';

@Component({
    selector: 'app-change-password',
    templateUrl: 'change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
    currentMasterPassword: string;
    newMasterPassword: string;
    confirmNewMasterPassword: string;
    formPromise: Promise<any>;
    masterPasswordScore: number;
    rotateEncKey = false;

    private masterPasswordStrengthTimeout: any;
    private email: string;

    constructor(private apiService: ApiService, private i18nService: I18nService,
        private analytics: Angulartics2, private toasterService: ToasterService,
        private cryptoService: CryptoService, private messagingService: MessagingService,
        private userService: UserService, private passwordGenerationService: PasswordGenerationService,
        private platformUtilsService: PlatformUtilsService, private folderService: FolderService,
        private cipherService: CipherService, private syncService: SyncService) { }

    async ngOnInit() {
        this.email = await this.userService.getEmail();
    }

    
}
