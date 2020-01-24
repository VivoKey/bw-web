import {
    Input,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { KeysRequest } from '../../models/request/keysRequest';
import { RegisterRequest } from '../../models/request/registerRequest';
import { AuthResult } from '../../models/domain/authResult';

import { ApiService } from '../../abstractions/api.service';

import { AuthService } from '../../abstractions/auth.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { StateService } from '../../abstractions/state.service';
import { StorageService } from '../../abstractions/storage.service';
import { ConstantsService } from '../../services/constants.service';
import { CryptoService } from '../../abstractions/crypto.service';
import { Utils } from '../../misc/utils';
import { KdfType } from '../../enums/kdfType';


const Keys = {
    rememberedEmail: 'rememberedEmail',
    rememberEmail: 'rememberEmail',
};

export class LoginComponent implements OnInit {
    @Input() email: string = '';
    @Input() rememberEmail = true;

    masterPassword: string = '';
    showPassword: boolean = false;
    formPromise: Promise<AuthResult>;
    onSuccessfulLogin: () => Promise<any>;
    onSuccessfulLoginNavigate: () => Promise<any>;
    onSuccessfulLoginTwoFactorNavigate: () => Promise<any>;
    hint: string = '';

    protected twoFactorRoute = '2fa';
    protected successRoute = 'vault';
    

    constructor(protected authService: AuthService, protected router: Router, protected cryptoService: CryptoService,
        protected platformUtilsService: PlatformUtilsService, protected i18nService: I18nService, protected apiService: ApiService,
        private storageService: StorageService, protected stateService: StorageService) { }

    async ngOnInit() {
        if (this.email == null || this.email === '') {
            this.email = await this.storageService.get<string>(Keys.rememberedEmail);
            if (this.email == null) {
                this.email = '';
            }
        }
        this.rememberEmail = await this.storageService.get<boolean>(Keys.rememberEmail);
        if (this.rememberEmail == null) {
            this.rememberEmail = true;
        }
        if (Utils.isBrowser) {
            document.getElementById(this.email == null || this.email === '' ? 'email' : 'masterPassword').focus();
        }
    }
    async regsubmit(oidcinf: any) {


        const name: string = oidcinf.name;
        const email = oidcinf.email.trim().toLowerCase();
        const kdf = KdfType.PBKDF2_SHA256;
        const useLowerKdf = this.platformUtilsService.isEdge() || this.platformUtilsService.isIE();
        const kdfIterations = useLowerKdf ? 10000 : 100000;
        const key = await this.cryptoService.makeKey(this.masterPassword, this.email, kdf, kdfIterations);
        const encKey = await this.cryptoService.makeEncKey(key);
        const hashedPassword = await this.cryptoService.hashPassword(this.masterPassword, key);
        const keys = await this.cryptoService.makeKeyPair(encKey[0]);
        const request = new RegisterRequest(email, name, hashedPassword,
            this.hint, encKey[1].encryptedString, kdf, kdfIterations);
        request.keys = new KeysRequest(keys[0], keys[1].encryptedString);
        const orgInvite = await this.stateService.get<any>('orgInvitation');
        if (orgInvite != null && orgInvite.token != null && orgInvite.organizationUserId != null) {
            request.token = orgInvite.token;
            request.organizationUserId = orgInvite.organizationUserId;
        }

        try {
            this.formPromise = this.apiService.postRegister(request);
            await this.formPromise;
            this.platformUtilsService.eventTrack('Registered');
            this.platformUtilsService.showToast('success', null, this.i18nService.t('newAccountCreated'));
            this.router.navigate([this.successRoute], { queryParams: { email: this.email } });
        } catch { }
    }
    async submit() {
        if (this.email == null || this.email === '') {
            this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'),
                this.i18nService.t('emailRequired'));
            return;
        }
        if (this.email.indexOf('@') === -1) {
            this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'),
                this.i18nService.t('invalidEmail'));
            return;
        }
        if (this.masterPassword == null || this.masterPassword === '') {
            this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'),
                this.i18nService.t('masterPassRequired'));
            return;
        }

        try {
            this.formPromise = this.authService.logIn(this.email, this.masterPassword);
            const response = await this.formPromise;
            await this.storageService.save(Keys.rememberEmail, this.rememberEmail);
            if (this.rememberEmail) {
                await this.storageService.save(Keys.rememberedEmail, this.email);
            } else {
                await this.storageService.remove(Keys.rememberedEmail);
            }
            if (response.twoFactor) {
                this.platformUtilsService.eventTrack('Logged In To Two-step');
                if (this.onSuccessfulLoginTwoFactorNavigate != null) {
                    this.onSuccessfulLoginTwoFactorNavigate();
                } else {
                    this.router.navigate([this.twoFactorRoute]);
                }
            } else {
                const disableFavicon = await this.storageService.get<boolean>(ConstantsService.disableFaviconKey);
                await this.stateService.save(ConstantsService.disableFaviconKey, !!disableFavicon);
                if (this.onSuccessfulLogin != null) {
                    this.onSuccessfulLogin();
                }
                this.platformUtilsService.eventTrack('Logged In');
                if (this.onSuccessfulLoginNavigate != null) {
                    this.onSuccessfulLoginNavigate();
                } else {
                    this.router.navigate([this.successRoute]);
                }
            }
        } catch { }
    }

    togglePassword() {
        this.platformUtilsService.eventTrack('Toggled Master Password on Login');
        this.showPassword = !this.showPassword;
        document.getElementById('masterPassword').focus();
    }
}
