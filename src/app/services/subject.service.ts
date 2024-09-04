import { Injectable } from "@angular/core";
import { DefaultService } from "@core/services/default.service";
import { ISubject } from "@models/subject.model";

@Injectable({
  providedIn: "root",
})
export class SubjectService extends DefaultService<ISubject, any, any> {
  constructor() {
    super("subjects");
  }
}
