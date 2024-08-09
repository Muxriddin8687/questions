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

@UntilDestroy()
@Component({
  selector: "app-topics",
  standalone: true,
  imports: [ButtonModule, TableModule],
  templateUrl: "./topics.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicsComponent extends BaseComponent implements OnInit {
  protected _topicService = inject(TopicService);

  ngOnInit(): void {
    this._topicService.getAll().pipe(untilDestroyed(this)).subscribe();
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

  pageChange(event: any) {
    console.log(event);
  }

  customSort(event: any) {
    console.log(event);
  }
}
