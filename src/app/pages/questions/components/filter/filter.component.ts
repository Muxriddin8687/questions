import { AsyncPipe } from "@angular/common";
import { Component, EventEmitter, inject, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BaseComponent } from "@core/components/base.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { DropdownChangeEvent } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { debounceTime, distinctUntilChanged, map, Subject, switchMap, tap } from "rxjs";
import { QuestionService } from "src/app/services/question.service";
import { SubjectService } from "src/app/services/subject.service";
import { TopicService } from "src/app/services/topic.service";

@UntilDestroy()
@Component({
  selector: "app-filter",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, MultiSelectModule, AsyncPipe],
  templateUrl: "./filter.component.html",
})
export class FilterComponent extends BaseComponent {
  @Output() onFilter = new EventEmitter();
  protected _topicService = inject(TopicService);
  protected _subjectService = inject(SubjectService);
  protected _questionService = inject(QuestionService);

  topicFilter$ = new Subject();
  topics$ = this.topicFilter$.pipe(
    switchMap((val) => this._topicService.getByFilter(val)),
    map((res) => res?.content)
  );
  filterForm = this._fb.group({
    search: [null],
    subjectId: [null],
    topicId: [null],
    size: [15],
  });

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(500),
        distinctUntilChanged(),
        tap((val) => (this.onFilter.emit(val))),
      )
      .subscribe();
  }

  loadTopicsList(event: DropdownChangeEvent) {
    const filter = {
      size: 500,
      page: 0,
      sort: "title,asc",
      subjectId: event.value,
    };
    console.log(filter);

    this.topicFilter$.next(filter);
  }
}
