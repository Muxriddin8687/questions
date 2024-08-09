/* eslint-disable */
import { Injectable } from "@angular/core";
import { BasicForm } from "./basic.form";
import { Observable } from "rxjs";

@Injectable()
export abstract class BasicCreateForm extends BasicForm {
  afterSuccessSubmit() {
    super.afterSuccessSubmit();
    this._toastService.success("TOAST.TOAST_SUCCESS");
    this._modalService.close();
  }

  onCancel() {
    this.form.reset();
    this._modalService.close();
  }

  submitAction(data: object): Observable<any> {
    return this._defaultService.insert(data);
  }
}
