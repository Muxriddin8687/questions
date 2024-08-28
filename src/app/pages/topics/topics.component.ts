import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { BaseComponent } from "@core/components/base.component";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { AddEditFormComponent } from "./add-edit-form/add-edit-form.component";
import { TopicService } from "src/app/services/topic.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { SubjectService } from "src/app/services/subject.service";
import { debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs";

@UntilDestroy()
@Component({
  selector: "app-topics",
  standalone: true,
  imports: [ButtonModule, TableModule, ReactiveFormsModule, InputTextModule, DropdownModule],
  templateUrl: "./topics.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicsComponent extends BaseComponent implements OnInit {
  protected _topicService = inject(TopicService);
  protected _subjectService = inject(SubjectService);
  filterForm = this._fb.group({
    search: [null],
    subjectId: [null],
  });

  ngOnInit(): void {
    this._topicService.defaultParams = { size: 500 };
    this._topicService.filterParams = { sort: "title,asc" };
    this._topicService.loadData();

    this.filterForm.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(500),
        distinctUntilChanged(),
        tap((val) => (this._topicService.filterParams = { ...val })),
        switchMap((val) => this._topicService.getByFilter(val))
      )
      .subscribe();
  }

  override delete(id: number) {
    this._topicService
      .delete(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.successMessage("Mavzu o'chirildi."),
        error: () => this.errorMessage(),
      });
  }

  update(id: number) {
    this._modalService.open(AddEditFormComponent, {
      data: {
        id: id,
      },
      header: "Mavzu yangilash",
      breakpoints: { "600px": "90vw", "960px": "75vw", "2500px": "500px" },
    });
  }

  openAddModal() {
    this._modalService.open(AddEditFormComponent, {
      header: "Mavzu qo'shish",
      breakpoints: { "600px": "90vw", "960px": "75vw", "2500px": "500px" },
    });
  }
}
