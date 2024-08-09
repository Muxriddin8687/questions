/* eslint-disable */
import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectorRef,
  inject,
  Injectable,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ERRORS } from "@core/enums/Errors.enum";
import { LanguageArray, mappingLanguageList } from "@core/enums/Languages.enum";
import { ILanguages, TLanguage } from "@core/interfaces/default.interface";
import { IErrorResponse } from "@core/interfaces/error.interface";
import { DefaultService } from "@core/services/default.service";
import { FormModalService } from "@core/services/modal.service";
import { ToastService } from "@core/services/toast.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Observable } from "rxjs";
import { CabTabService } from "../../cab-tab/cab-tab.service";
import {
  DateToISOStringWithCurrentTimeZone,
  dateToString,
} from "../../utils/date";
import objectTreeSelect from "../../utils/objectTreeSelect";
import { reshapeDataByTranslate } from "../../utils/reshapeDataByTranslate";
import {
  EFormFieldTypes,
  IFormField,
  IFormFields,
} from "./basic-form.interface";

@UntilDestroy()
@Injectable()
export abstract class BasicForm implements OnInit {
  public abstract _defaultService: DefaultService<unknown, unknown, unknown>;
  public _modalService = inject(FormModalService);
  public _toastService = inject(ToastService);
  public _cabTabService = inject(CabTabService);
  public abstract formFields: IFormFields;
  public isPending = signal(false);
  public isFormModal = signal(false);
  public form!: FormGroup;
  public tabInputs = signal([]);
  public errorMessage = signal<string | any>("");
  public resStatus = signal<number | any>(null);
  protected _fb = inject(FormBuilder);
  protected cdr = inject(ChangeDetectorRef);
  test: string;

  ngOnInit() {
    this.form = this.createFormGroup(this.formFields);
  }

  createFormField(
    value: any,
    validators: Validators[] = [],
    fieldType: EFormFieldTypes = EFormFieldTypes.DEFAULT,
    getValue: any = null
  ): IFormField {
    return {
      value,
      validators,
      fieldType,
      getValue,
      isFormField: true,
    };
  }

  beforeSubmit() {
    this.isPending.set(true);
  }

  convertToRequestData(formFields: IFormFields, formValue: any) {
    const data: any = {};
    const translateData: ILanguages = reshapeDataByTranslate({});
    let hasTranslate = false;
    for (const key in formFields) {
      const formField: IFormField | IFormFields = formFields[key];
      if (this.isFormField(formField)) {
        if (formField.fieldType === EFormFieldTypes.TRANSLATE) {
          hasTranslate = true;
          LanguageArray.forEach((lang: TLanguage) => {
            translateData[lang][key] = formValue[`${key}_${lang}`];
          });
        } else if (formField.fieldType === EFormFieldTypes.DATE_PICKER) {
          data[key] = dateToString(formValue[key]);
        } else if (
          formField.fieldType === EFormFieldTypes.DATE_PICKER_WITH_ISO_STRING
        ) {
          data[key] = DateToISOStringWithCurrentTimeZone(formValue[key]);
        } else if (formField.fieldType === EFormFieldTypes.CALENDAR) {
          data[key] =
            new Date(new Date(formValue[key]).getTime() + 5 * 60 * 60 * 1000) ??
            formField.value;
        } else {
          data[key] = formValue[key] ?? formField.value;
        }
      } else {
        data[key] = this.convertToRequestData(
          formField as IFormFields,
          formValue[key]
        );
      }
    }
    if (hasTranslate) {
      data.translates = [];
      LanguageArray.forEach((lang: TLanguage) => {
        translateData[lang]["lang"] = mappingLanguageList[lang];
        data.translates.push(translateData[lang]);
      });
    }
    return data;
  }

  convertToRequestControl(formFields: IFormFields, form: FormGroup) {
    const data: any = {};
    const translateData: ILanguages = reshapeDataByTranslate({});
    let hasTranslate = false;
    for (const key in formFields) {
      const formField: IFormField | IFormFields = formFields[key];
      if (this.isFormField(formField)) {
        if (formField.fieldType === EFormFieldTypes.TRANSLATE) {
          hasTranslate = true;
          LanguageArray.forEach((lang: TLanguage) => {
            translateData[lang][key] = form.get(`${key}_${lang}`);
          });
        } else {
          data[key] = form.get(key);
        }
      } else {
        data[key] = this.convertToRequestControl(
          formField as IFormFields,
          form.get(key) as FormGroup
        );
      }
    }
    if (hasTranslate) {
      data.translates = [];
      LanguageArray.forEach((lang: TLanguage) => {
        data.translates.push(translateData[lang]);
      });
    }
    return data;
  }

  abstract submitAction(data: object): Observable<any>;

  afterSuccessSubmit() {
    this.isPending.set(false);
    this._modalService.close();
    this.form.reset();
  }

  onSubmit() {
    this.markAsTouched();
    if (this.form.valid && !this.isPending()) {
      this.beforeSubmit();
      const data = this.convertToRequestData(this.formFields, this.form.value);

      this.submitAction(data)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => this.afterSuccessSubmit(),
          error: (res: HttpErrorResponse) => {
            if (res) {
              this.resStatus.set(res.status);
              this.setResponseErrors(res.error);
            }
          },
        });
    }
  }

  checkTabsInputs() {
    if (!Object.keys(this.tabInputs()).length) return;
    for (const key of this.tabInputs()) {
      LanguageArray.forEach((lang: TLanguage) => {
        switch (lang) {
          case "uz":
            if (this.form.get([`${key}_${lang}`])?.hasError("required"))
              this._cabTabService.changeStep(this._cabTabService.STEP_IN_UZ);
            break;
          case "crl":
            if (this.form.get([`${key}_${lang}`])?.hasError("required"))
              this._cabTabService.changeStep(this._cabTabService.STEP_IN_CRL);
            break;
          case "ru":
            if (this.form.get([`${key}_${lang}`])?.hasError("required"))
              this._cabTabService.changeStep(this._cabTabService.STEP_IN_RU);
            break;
        }
      });
    }
  }

  markAsTouched() {
    this.form.markAllAsTouched();
    this.checkTabsInputs();
    this.cdr.markForCheck();
  }

  protected createFormGroup(formFields: IFormFields) {
    const formControls: any = {};
    for (const key in formFields) {
      if (this.isFormField(formFields[key])) {
        const formField: IFormField | IFormFields = formFields[key];
        if (formField.fieldType == EFormFieldTypes.TRANSLATE) {
          this.tabInputs.update((values: any) => {
            values.push(key);
            return values;
          });

          LanguageArray.forEach((lang: string) => {
            formControls[`${key}_${lang}`] = [
              formField.value,
              formField.validators,
            ];
          });
        } else {
          formControls[key] = [formField.value, formField.validators];
        }
      } else {
        formControls[key] = this.createFormGroup(
          formFields[key] as IFormFields
        );
      }
    }
    return this._fb.group(formControls);
  }

  protected isFormField(formField: IFormField | IFormFields) {
    return Boolean(formField.isFormField);
  }

  protected setResponseErrors(errorResponse: IErrorResponse) {
    this.isPending.set(false);

    if (!errorResponse) return;
    const errorMsg = errorResponse.message;

    if (errorResponse.details) {
      const obj = this.convertToRequestControl(this.formFields, this.form);
      errorResponse.details.forEach((detail) => {
        const select: FormControl | null = objectTreeSelect(obj, detail.field);
        if (select) {
          select.setErrors({ error: detail.message });
          select.markAsTouched();
          this.cdr.markForCheck();
        }
      });
      this.markAsTouched();
    }

    if (
      errorMsg &&
      [ERRORS.ERROR_409, ERRORS.ERROR_404].includes(Number(this.resStatus()))
    ) {
      this.errorMessage.set(errorMsg);
    }
  }
}
