import { Component, inject, signal } from "@angular/core";
import { ButtonDirective } from "primeng/button";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { InputTextModule } from "primeng/inputtext";
import { AuthService } from "@core/services/auth.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseComponent } from "@core/components/base.component";
import { catchError, of, tap } from "rxjs";

@UntilDestroy()
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  standalone: true,
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonDirective,
    ReactiveFormsModule,
  ],
})
export class LoginComponent extends BaseComponent {
  private _authService = inject(AuthService);
  isError = signal(false);

  form = this._fb.group({
    username: [
      "",
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
    password: [
      "",
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
  });

  submit() {
    if (this.form.valid) {
      this._authService
        .login(this.form.value)
        .pipe(
          untilDestroyed(this),
          catchError(() => {
            this.isError.set(true);
            setTimeout(() => this.isError.set(false), 3000);
            return of(null);
          }),
          tap((res) => {
            if (res.token) {
              this._router.navigate(["/subjects"]);
              this.form.reset();
            }
          })
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
