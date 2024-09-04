import { Injectable } from "@angular/core";
import { DefaultService } from "@core/services/default.service";
import { ITopic } from "@models/topic.model";

@Injectable({
  providedIn: "root",
})
export class QuestionService extends DefaultService<ITopic, any, any> {
  constructor() {
    super("questions");
  }
}
