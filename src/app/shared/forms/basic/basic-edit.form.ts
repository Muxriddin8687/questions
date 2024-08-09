/* eslint-disable */
import { effect, Injectable, signal } from "@angular/core";
import { LanguageArray } from "../../../core/enums/Languages.enum";
import { reshapeDataByTranslate } from "../../utils/reshapeDataByTranslate";
import {
  ILanguages,
  TLanguage,
} from "../../../core/interfaces/default.interface";
import {
  EFormFieldTypes,
  IFormField,
  IFormFields,
} from "./basic-form.interface";
import { Observable } from "rxjs";
import { BasicForm } from "./basic.form";
import { stringToDate } from "../../utils/date";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import objectTreeSelect from "../../utils/objectTreeSelect";

@UntilDestroy()
@Injectable()
export abstract class BasicEditForm extends BasicForm {
  selectedRowDataToSelect = "id";
  getOneData = signal<any>({});
  loading = signal(false);
  setQuery = signal("");

  constructor() {
    super();
    effect(
      () => {
        this._defaultService.selectedRow();
        if (this._defaultService.hasSelectedRow()) {
          this.loadData(this.setQuery());
        }
      },
      { allowSignalWrites: true }
    );
  }

  submitAction(data: object): Observable<any> {
    return this._defaultService.update(data);
  }

  getSelector() {
    return this._defaultService.selectedRow()[this.selectedRowDataToSelect];
  }

  patchResponseData(res: any) {
    this.form.patchValue(this.convertToFormData(this.formFields, res));
  }

  loadData(query?: string) {
    this.loading.set(true);
    this.form?.reset();
    this._defaultService
      .getOne(this.getSelector(), query)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.patchResponseData(res);
        this.getOneData.set(res);
        this.loading.set(false);
      });
  }

  convertToFormData(formFields: IFormFields, res: any) {
    const data: any = {};
    const translate: ILanguages = reshapeDataByTranslate(res);
    for (const key in formFields) {
      const formField: IFormField | IFormFields = formFields[key];
      if (this.isFormField(formField)) {
        if (formField.fieldType == EFormFieldTypes.TRANSLATE) {
          LanguageArray.forEach((lang: TLanguage) => {
            data[`${key}_${lang}`] = translate[lang][key] ?? formField.value;
          });
        } else if (formField.fieldType === EFormFieldTypes.DATE_PICKER) {
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

  onCancel() {
    this._modalService.close();
  }

  afterSuccessSubmit() {
    super.afterSuccessSubmit();
    this._toastService.success("TOAST.TOAST_UPDATE");
  }
}
