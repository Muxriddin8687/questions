import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { BaseComponent } from "@core/components/base.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { QuestionService } from "src/app/services/question.service";
import { AsyncPipe } from "@angular/common";
import { AddFormComponent } from "./components/add-form/add-form.component";
import { FilterComponent } from "./components/filter/filter.component";

@UntilDestroy()
@Component({
  selector: "app-questions",
  standalone: true,
  imports: [ButtonModule, TableModule, AsyncPipe, FilterComponent],
  templateUrl: "./questions.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsComponent extends BaseComponent implements OnInit {
  protected _questionService = inject(QuestionService);

  ngOnInit(): void {
    this._questionService.filterParams = { sort: "id,asc", size: 15, page: 1 };
    this._questionService.loadData();
  }

  override delete(id: number) {
    this._questionService
      .delete(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.successMessage("Savol o'chirildi."),
        error: () => this.errorMessgae(),
      });
  }

  update(id: number) {
    this._modalService.open(AddFormComponent, {
      data: {
        id: id,
      },
      header: "Savolni tahrirlash",
      style: { width: "450px", minWidth: "300px" },
    });
  }

  openAddModal() {
    this._modalService.open(AddFormComponent, {
      header: "Savol qo'shish",
      style: { width: "450px", minWidth: "300px" },
    });
  }
}
