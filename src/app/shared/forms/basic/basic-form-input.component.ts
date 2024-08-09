import { Component, inject, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ErrorList } from "./errorList";

@Component({
  template: "",
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BasicFormInputComponent implements OnInit {
  @Input() customClass = "";
  @Input() placeholder = "";
  @Input() label = "";
  @Input() groupLabel = "";
  @Input() disabled = false;
  @Input() controlName: AbstractControl | string | null = "";
  @Input() width: string;
  @Input() size: "sm" | "lg" | "" = "sm";
  formControl: FormControl;
  id = Math.floor(Math.random() * 10000).toString();
  required = false;

  _translateService = inject(TranslateService);
  ngOnInit() {
    this.formControl =
      typeof this.controlName !== "string"
        ? (this.controlName as FormControl)
        : new FormControl(null);

    this.required = this.formControl.hasValidator(Validators.required);

    if (this.disabled) {
      this.formControl.disable();
    }
  }

  showValidationErrors() {
    return (
      this.formControl?.invalid &&
      (this.formControl?.touched || this.formControl?.dirty)
    );
  }

  errorMessage(): string[] {
    const result: string[] = [];
    const controlErrors: ValidationErrors | null = this.formControl.errors;
    if (controlErrors) {
      Object.keys(controlErrors).forEach((key) => {
        let errorMessage = "";
        if (key === "error") {
          errorMessage = controlErrors[key] ?? "";
        } else {
          errorMessage = this._translateService.instant(
            "ERROR_LIST." + ErrorList[key],
            controlErrors[key]
          );
        }
        result.push(errorMessage);
      });
    }
    return result;
  }

  errorMessagesHtml() {
    return "<div>" + this.errorMessage().join("</div><div>") + "</div>";
  }
}
