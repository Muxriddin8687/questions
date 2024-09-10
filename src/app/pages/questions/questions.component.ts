import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { QuestionService } from "@services/question.service";
import { JsonPipe } from "@angular/common";
import { AddFormComponent } from "./components/add-form/add-form.component";
import { FilterComponent } from "./components/filter/filter.component";
import { PaginatorModule } from "primeng/paginator";
import { QuestionComponent } from "./components/question/question.component";
import { DialogService } from "primeng/dynamicdialog";

@Component({
  selector: "app-questions",
  standalone: true,
  imports: [ButtonModule, JsonPipe, FilterComponent, PaginatorModule, QuestionComponent],
  templateUrl: "./questions.component.html",
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsComponent implements OnInit {
  protected _questionService = inject(QuestionService);
  private _modalService = inject(DialogService);
  data = computed(() => this._questionService.data());
  filter = { sort: "id,asc", size: 15, page: 0 };
  start_page = 0;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._questionService.filterParams = { ...this.filter };
    this._questionService.loadData();
  }

  onPageChange(event: any) {
    this.start_page = event.first;
    this.filter = { ...this.filter, page: event.page };
    this.loadData();
  }

  onFilter(event: object) {
    this.filter = { ...this.filter, ...event, page: 0 };
    this.start_page = 0;
    this.loadData();
  }

  openAddModal() {
    this._modalService.open(AddFormComponent, {
      header: "Savol qo'shish",
      style: { "overflow-y": "auto", "max-height": "80vh" },
      breakpoints: { "600px": "100vw", "960px": "80vw", "2500px": "60vw" },
      draggable: false,
    });
  }
}
