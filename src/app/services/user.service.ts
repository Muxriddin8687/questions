import { Injectable } from "@angular/core";
import { DefaultService } from "@core/services/default.service";
import { IUser } from "../models/user.model";
import { take, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService extends DefaultService<IUser, any, any> {
  constructor() {
    super("users");
  }

  override loadData() {
    this.getByList()
      .pipe(
        take(1),
        tap((data) => this.data.set(data))
      )
      .subscribe();
  }
}
