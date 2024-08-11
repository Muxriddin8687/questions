import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
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
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from "rxjs";

@UntilDestroy()
@Component({
  selector: "app-topics",
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
  ],
  templateUrl: "./topics.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicsComponent extends BaseComponent implements OnInit {
  protected _topicService = inject(TopicService);
  protected _subjectService = inject(SubjectService);
  filterForm = this._fb.group({
    search: [""],
    subjectId: [null],
  });

  ngOnInit(): void {
    this._topicService.defaultParams = { size: 500 };

    this._topicService
      .getByFilter({ sort: "title" })
      .pipe(untilDestroyed(this))
      .subscribe();

    this.filterForm.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(500),
        distinctUntilChanged(),
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
        error: () => this.errorMessgae(),
      });
  }

  update(id: number) {
    this._modalService.open(AddEditFormComponent, {
      data: {
        id: id,
      },
      header: "Mavzu yangilash",
      style: { width: "450px", minWidth: "300px" },
    });
  }

  openAddModal() {
    this._modalService.open(AddEditFormComponent, {
      header: "Mavzu qo'shish",
      style: { width: "450px", minWidth: "300px" },
    });
  }

  customSort($event: any) {
    console.log($event);

    this._topicService
      .getByFilter({ sort: "title" })
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}
