import { Component, Input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { IQuestion } from "@models/question.model";

@Component({
  selector: "app-question",
  standalone: true,
  imports: [TooltipModule],
  templateUrl: "./question.component.html",
  styleUrl: "./question.component.scss",
})
export class QuestionComponent {
  @Input() data: IQuestion | undefined;
  @Input() editable = false;
}
