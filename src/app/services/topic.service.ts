import { Injectable } from "@angular/core";
import { DefaultService } from "@core/services/default.service";
import { Observable, tap } from "rxjs";
import { ITopic } from "../models/topic.model";

@Injectable({
  providedIn: "root",
})
export class TopicService extends DefaultService<ITopic, any, any> {
  constructor() {
    super("topics");
  }

  override getAll<T>(): Observable<any> {
    return this._http
      .get<T[]>(this._api + "/page?sort=title&size=20")
      .pipe(tap((res: any) => this.data.set(res)));
  }
}
