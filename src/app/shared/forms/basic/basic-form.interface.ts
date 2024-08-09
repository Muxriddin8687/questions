/* eslint-disable */
import { Validators } from "@angular/forms";

export interface IFormField {
  value: unknown;
  validators: Validators[];
  fieldType: EFormFieldTypes;
  getValue?: any;
  isFormField: boolean;
}

export interface IFormFields {
  [key: string]: IFormField | IFormFields;
}

export enum EFormFieldTypes {
  DEFAULT = 0,
  TRANSLATE = 1,
  DATE_PICKER = 2,
  DATE_PICKER_WITH_ISO_STRING = 3,
  CALENDAR = 4,
}
