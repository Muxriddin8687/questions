import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { FormArray, ReactiveFormsModule, Validators } from "@angular/forms";
import { BaseComponent } from "@core/components/base.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ButtonModule } from "primeng/button";
import { DropdownChangeEvent, DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { map, Subject, switchMap, tap } from "rxjs";
import { QuestionService } from "@services/question.service";
import { SubjectService } from "@services/subject.service";
import { TopicService } from "@services/topic.service";
import { RadioButtonModule } from "primeng/radiobutton";

@UntilDestroy()
@Component({
  selector: "app-add-form",
  templateUrl: "./add-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, InputTextModule, DropdownModule, AsyncPipe, RadioButtonModule],
})
export class AddFormComponent extends BaseComponent implements OnInit {
  private _topicService = inject(TopicService);
  private _questionService = inject(QuestionService);
  protected _subjectService = inject(SubjectService);

  topicFilter$ = new Subject();
  topicLoading = false;
  topics$ = this.topicFilter$.pipe(
    tap(() => (this.topicLoading = true)),
    switchMap((val) => this._topicService.getByFilter(val)),
    map((res) => res?.content),
    tap(() => (this.topicLoading = false))
  );

  answers: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  form = this._fb.group({
    subjectId: [null, Validators.required],
    topicId: [null, Validators.required],
    questions: this._fb.array([]),
  });

  ngOnInit() {
    this.addQuestion();
  }

  loadTopicsList(event: DropdownChangeEvent | null) {
    const filter = {
      size: 500,
      page: 0,
      sort: "title,asc",
      subjectId: event?.value,
    };
    this.topicFilter$.next(filter);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._questionService
      .insert(this.form.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.closeModal();
          this.form.reset();
          this.successMessage();
        },
        error: () => this.errorMessage(),
      });
  }

  addQuestion() {
    let newForm = this.newQuestionForm();
    (newForm.get("answers") as FormArray)?.push(this.newAnswerForm(true));
    (newForm.get("answers") as FormArray)?.push(this.newAnswerForm());
    (newForm.get("answers") as FormArray)?.push(this.newAnswerForm());
    (newForm.get("answers") as FormArray)?.push(this.newAnswerForm());
    this.getQuestions().push(newForm);
  }

  removeQuestion(index: number) {
    this.getQuestions().removeAt(index);
  }

  getQuestions() {
    return this.form.get("questions") as FormArray;
  }

  getAnswers(index: number) {
    return this.getQuestions().at(index).get("answers") as FormArray;
  }

  newQuestionForm() {
    return this._fb.group({
      value: [null, [Validators.required, Validators.minLength(3)]],
      description: [null],
      answers: this._fb.array([]),
    });
  }

  newAnswerForm(isCorrectValue = false) {
    return this._fb.group({
      value: [null, [Validators.required, Validators.minLength(3)]],
      isCorrect: [isCorrectValue],
      description: [null],
    });
  }

  onChange($event: any, i: number, j: number) {
    if ($event) {
      this.getAnswers(i).controls.forEach((control) => control.get("isCorrect")?.patchValue(false));
      this.getAnswers(i).controls[j].get("isCorrect")?.setValue(true);
    }
  }
}
