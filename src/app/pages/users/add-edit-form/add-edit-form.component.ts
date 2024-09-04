import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BaseComponent } from "@core/components/base.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ButtonModule } from "primeng/button";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { UserService } from "@services/user.service";

@UntilDestroy()
@Component({
  selector: "app-add-edit-form",
  templateUrl: "./add-edit-form.component.html",
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, PasswordModule, InputTextModule, InputMaskModule],
})
export class AddEditFormComponent extends BaseComponent implements OnInit {
  private _userService = inject(UserService);
  isEdit = !!this._modalConfig.data?.id;

  form = this._fb.group(
    {
      id: [null],
      fullName: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      username: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmPassword: [null, Validators.required],
      role: "ADMIN",
      contact: [null, Validators.required],
      email: [null, [Validators.email, Validators.minLength(8), Validators.maxLength(50)]],
    },
    { validator: this.passwordMatchValidator }
  );

  ngOnInit(): void {
    const id = this._modalConfig.data?.id;
    if (this.isEdit) {
      this.form.get("password")?.clearValidators();
      this.form.get("confirmPassword")?.clearValidators();
      this.loadData(id);
    }
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  loadData(id: number) {
    this._userService
      .getOne(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => this.form.patchValue(data),
        error: () => this.errorMessage(),
      });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const confirmError: any = this.form?.errors;
      confirmError["mismatch"] ? this.errorMessage("Yangi parol va tasdiqlash paroli mos emas!") : null;

      return;
    }

    this.form.value.contact = this.form.value.contact.toString().replace(/[()\-\s]/g, "");

    if (!this.isEdit) {
      this._userService
        .insert(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.closeModal();
            this.form.reset();
            this.successMessage();
          },
          error: () => this.errorMessage(),
        });
    } else {
      this._userService
        .update(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.closeModal();
            this.form.reset();
            this.successUpdateMessage();
          },
          error: () => this.errorMessage(),
        });
    }
  }
}
