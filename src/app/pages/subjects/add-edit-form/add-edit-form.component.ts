import { Component, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { BaseComponent } from "@core/components/base.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { SubjectService } from "src/app/services/subject.service";

@UntilDestroy()
@Component({
  selector: "app-add-edit-form",
  templateUrl: "./add-edit-form.component.html",
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule],
})
export class AddEditFormComponent extends BaseComponent implements OnInit {
  private _subjectService = inject(SubjectService);

  form = this._fb.group({
    id: [null],
    title: ["", [Validators.required, Validators.minLength(3)]],
    description: [""],
  });

  ngOnInit(): void {
    const id = this._modalConfig.data?.id;
    if (id) this.loadData(id);
  }

  loadData(id: number) {
    this._subjectService
      .getOne(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => this.form.patchValue(data),
        error: () => this.errorMessage(),
      });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.form.value.id) {
      this._subjectService
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
    } else {
      this._subjectService
        .update(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.closeModal();
            this.form.reset();
            this.successUpdateMessage();
          },
          error: () => this.errorMessage(),
        });
    }
  }
}
