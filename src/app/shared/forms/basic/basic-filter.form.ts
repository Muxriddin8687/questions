/* eslint-disable */
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  EFormFieldTypes,
  IFormField,
  IFormFields,
} from "./basic-form.interface";
import { inject, Injectable, OnInit } from "@angular/core";
import { DefaultService } from "@core/services/default.service";
import { stringToDate } from "../../utils/date";
import objectTreeSelect from "../../utils/objectTreeSelect";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { debounceTime } from "rxjs";

@UntilDestroy()
@Injectable()
export abstract class BasicFilterForm implements OnInit {
  public filterForm!: FormGroup;
  public abstract formFields: IFormFields;
  public abstract _defaultService: DefaultService<unknown, unknown, unknown>;
  protected _fb = inject(FormBuilder);

  ngOnInit() {
    this.filterForm = this.createFormGroup(this.formFields);
    this.uploadType();
    this.setDataToForm();
    this._defaultService.clearTableParams
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.setDataToForm();
      });
  }

  setDataToForm() {
    if (!this._defaultService) return;

    this._defaultService.tableRequest.setFilterParams(
      this._defaultService.filter
    );
    this.filterForm.patchValue(
      this.convertToFormData(this.formFields, this._defaultService.filter)
    );
  }

  convertToFormData(formFields: IFormFields, res: any) {
    const data: any = {};
    for (const key in formFields) {
      const formField: IFormField | IFormFields = formFields[key];
      if (this.isFormField(formField)) {
        if (formField.fieldType === EFormFieldTypes.DATE_PICKER) {
          data[key] = stringToDate(res[key]);
        } else {
          data[key] = res[key] ?? formField.value;
        }
        if (typeof formField.getValue === "function") {
          data[key] = formField.getValue(res);
        } else if (typeof formField.getValue === "string") {
          data[key] = objectTreeSelect(res, formField.getValue);
        }
      } else {
        data[key] = this.convertToFormData(
          formField as IFormFields,
          res[key] ?? {}
        );
      }
    }

    return data;
  }

  uploadType() {
    this.filterForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.uploadData(value);
      });
  }

  uploadData(data: any) {
    if (!this._defaultService) return;

    this._defaultService.setFilterTable(data);
  }

  createFormField(
    value: any = null,
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

  mergeFormGroups(form: FormGroup[]): FormGroup {
    const mergedControls = Object.assign(
      {},
      ...form.map((form) => form.controls)
    );
    return this._fb.group(mergedControls);
  }

  protected createFormGroup(formFields: IFormFields) {
    const formControls: any = {};
    for (const key in formFields) {
      if (this.isFormField(formFields[key])) {
        const formField: IFormField | IFormFields = formFields[key];
        formControls[key] = [formField.value, formField.validators];
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
}
