import { Component, inject, Input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { IQuestion } from "@models/question.model";
import { BaseComponent } from "@core/components/base.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { EditFormComponent } from "../edit-form/edit-form.component";
import { QuestionService } from "@services/question.service";
import { ButtonModule } from "primeng/button";

@UntilDestroy()
@Component({
  selector: "app-question",
  standalone: true,
  imports: [TooltipModule, ButtonModule],
  templateUrl: "./question.component.html",
  styleUrl: "./question.component.scss",
})
export class QuestionComponent extends BaseComponent {
  @Input() data: IQuestion | undefined;
  @Input() index: number = 0;
  @Input() editable = false;

  answers: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  _questionService = inject(QuestionService);

  override delete(id: number) {
    this._questionService
      .delete(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.successMessage("Savol o'chirildi."),
        error: () => this.errorMessage(),
      });
  }

  update(id: number) {
    this._modalService.open(EditFormComponent, {
      data: {
        id: id,
      },
      header: "Savolni tahrirlash",
      breakpoints: { "600px": "90vw", "960px": "75vw", "2500px": "500px" },
    });
  }
}
