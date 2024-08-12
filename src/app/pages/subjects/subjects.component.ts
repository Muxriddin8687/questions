import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { BaseComponent } from "@core/components/base.component";
import { ButtonModule } from "primeng/button";
import { AddEditFormComponent } from "./add-edit-form/add-edit-form.component";
import { SubjectService } from "src/app/services/subject.service";
import { TableModule } from "primeng/table";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "app-subjects",
  standalone: true,
  imports: [ButtonModule, TableModule],
  templateUrl: "./subjects.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsComponent extends BaseComponent implements OnInit {
  protected _subjectService = inject(SubjectService);

  ngOnInit(): void {
    this._subjectService.defaultParams = { size: 500, sort: "title" };
  }

  override delete(id: number) {
    this._subjectService
      .delete(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.successMessage("Fan o'chirildi."),
        error: () => this.errorMessgae(),
      });
  }

  update(id: number) {
    this._modalService.open(AddEditFormComponent, {
      data: {
        id: id,
      },
      header: "Fan yangilash",
      style: { width: "400px", minWidth: "300px" },
      breakpoints: { "960px": "75vw" },
    });
  }

  openAddModal() {
    this._modalService.open(AddEditFormComponent, {
      header: "Fan qo'shish",
      style: { width: "400px", minWidth: "300px" },
      breakpoints: { "960px": "75vw" },
    });
  }
}
