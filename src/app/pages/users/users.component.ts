import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { BaseComponent } from "@core/components/base.component";
import { ButtonModule } from "primeng/button";
import { AddEditFormComponent } from "./add-edit-form/add-edit-form.component";
import { TableModule } from "primeng/table";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { UserService } from "@services/user.service";
import { tap } from "rxjs";

@UntilDestroy()
@Component({
  selector: "app-users",
  standalone: true,
  imports: [ButtonModule, TableModule],
  templateUrl: "./users.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends BaseComponent implements OnInit {
  protected _userService = inject(UserService);

  ngOnInit(): void {
    this._userService
      .getByList()
      .pipe(
        untilDestroyed(this),
        tap((val) => this._userService.data.set(val))
      )
      .subscribe();
  }

  override delete(id: number) {
    this._userService
      .delete(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.successMessage("Foydalanuvchi o'chirildi."),
        error: () => this.errorMessage(),
      });
  }

  update(id: number) {
    this._modalService.open(AddEditFormComponent, {
      data: {
        id: id,
      },
      header: "Foydalanuvchini tahrirlash",
      breakpoints: { "600px": "90vw", "960px": "75vw", "2500px": "500px" },
    });
  }

  openAddModal() {
    this._modalService.open(AddEditFormComponent, {
      header: "Foydalanuvchi qo'shish",
      breakpoints: { "600px": "90vw", "960px": "75vw", "2500px": "500px" },
    });
  }
}
