import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { BaseComponent } from "@core/components/base.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { SubjectService } from "src/app/services/subject.service";
import { TopicService } from "src/app/services/topic.service";

@UntilDestroy()
@Component({
  selector: "app-add-edit-form",
  templateUrl: "./add-edit-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
  ],
})
export class AddEditFormComponent extends BaseComponent implements OnInit {
  private _topicService = inject(TopicService);
  protected _subjectService = inject(SubjectService);

  form = this._fb.group({
    id: [null],
    subjectId: [null, Validators.required],
    title: ["", [Validators.required, Validators.minLength(3)]],
    description: [""],
  });

  ngOnInit(): void {
    const id = this._modalConfig.data?.id;
    if (id) this.loadData(id);
  }

  loadData(id: number) {
    this._topicService
      .getOne(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) =>
          this.form.patchValue({ ...data, subjectId: data?.subject?.id }),
        error: () => this.errorMessgae(),
      });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.form.value.id) {
      this._topicService
        .insert(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.closeModal();
            this.form.reset();
            this.successMessage();
          },
          error: () => this.errorMessgae(),
        });
    } else {
      this._topicService
        .update(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.closeModal();
            this.form.reset();
            this.successUpdateMessage();
          },
          error: () => this.errorMessgae(),
        });
    }
  }
}
