import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BaseComponent } from "@core/components/base.component";
import { untilDestroyed } from "@ngneat/until-destroy";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs";
import { SubjectService } from "src/app/services/subject.service";
import { TopicService } from "src/app/services/topic.service";
import { QuestionService } from "src/app/services/question.service";
import { AsyncPipe } from "@angular/common";
import { AddFormComponent } from "./components/add-form/add-form.component";

@Component({
  selector: "app-questions",
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    AsyncPipe,
  ],
  templateUrl: "./questions.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsComponent extends BaseComponent implements OnInit {
  protected _topicService = inject(TopicService);
  protected _subjectService = inject(SubjectService);
  protected _questionService = inject(QuestionService);

  topics = signal([]);
  filterForm = this._fb.group({
    search: [null],
    subjectId: [null],
    topicId: [null],
  });

  ngOnInit(): void {
    this._questionService.filterParams = { sort: "id,asc", size: 15, page: 1 };
    this._questionService.loadData();

    this._topicService.getByList().subscribe((data) => {
      this.topics.set(data);
    });

    this.filterForm.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(500),
        distinctUntilChanged(),
        tap((val) => (this._questionService.filterParams = { ...val })),
        switchMap((val) => this._questionService.getByFilter(val))
      )
      .subscribe();
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
