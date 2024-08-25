import { Component, inject, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BaseComponent } from "@core/components/base.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs";
import { QuestionService } from "src/app/services/question.service";
import { SubjectService } from "src/app/services/subject.service";
import { TopicService } from "src/app/services/topic.service";

@UntilDestroy()
@Component({
  selector: "app-filter",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, MultiSelectModule],
  templateUrl: "./filter.component.html",
})
export class FilterComponent extends BaseComponent {
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
}
