import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '@core/services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BaseComponent } from '@core/components/default.component';
import { catchError, tap } from 'rxjs';

@UntilDestroy()
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    standalone: true,
    imports: [InputTextModule, PasswordModule, ButtonModule]
})
export class LoginComponent extends BaseComponent {
    private _authService = inject(AuthService);
    private _fb = inject(FormBuilder);

    form = this._fb.group({
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    });

    submit() {
        if (this.form.valid) {
            this._authService
                .login(this.form.value)
                .pipe(
                    untilDestroyed(this),
                    catchError((error) => {
                        this.form.setErrors({ invalidCredentials: true });
                        return error;
                    }),
                    tap(() => {
                        this._authService.isAuthenticated() ? this._router.navigate(['/subjects']) : null;
                        this.form.reset();
                    })
                )
                .subscribe();
        } else {
            this.form.markAllAsTouched();
        }
    }
}
