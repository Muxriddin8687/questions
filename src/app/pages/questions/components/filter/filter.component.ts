import { AsyncPipe } from "@angular/common";
import { Component, EventEmitter, inject, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BaseComponent } from "@core/components/base.component";
import { ButtonDirective } from "primeng/button";
import { DropdownChangeEvent } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { catchError, distinct, distinctUntilChanged, map, of, Subject, switchMap, tap } from "rxjs";
import { QuestionService } from "@services/question.service";
import { SubjectService } from "@services/subject.service";
import { TopicService } from "@services/topic.service";

@Component({
  selector: "app-filter",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, MultiSelectModule, AsyncPipe, ButtonDirective],
  templateUrl: "./filter.component.html",
})
export class FilterComponent extends BaseComponent {
  @Output() onFilter = new EventEmitter();
  protected _topicService = inject(TopicService);
  protected _subjectService = inject(SubjectService);
  protected _questionService = inject(QuestionService);

  topicFilter$ = new Subject();
  topicLoading = false;
  topics$ = this.topicFilter$.pipe(
    distinctUntilChanged(),
    tap(() => (this.topicLoading = true)),
    switchMap((val) => this._topicService.getByFilter(val)),
    catchError(() => of([])),
    map((res) => res?.content || []),
    tap(() => (this.topicLoading = false))
  );
  filterForm = this._fb.group({
    search: [null],
    subjectIds: [null],
    topicIds: [null],
  });

  filter() {
    this.onFilter.emit(this.filterForm.value);
  }

  loadTopicsList(event: DropdownChangeEvent | null) {
    const filter = {
      size: 500,
      page: 0,
      sort: "title,asc",
      subjectIds: event?.value || null,
    };

    this.topicFilter$.next(filter);
  }
}
