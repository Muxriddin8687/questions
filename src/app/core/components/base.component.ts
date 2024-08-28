import { Component, inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";

@Component({
  standalone: true,
  template: ``,
  providers: [MessageService, DialogService, DynamicDialogRef, DynamicDialogConfig, ConfirmationService],
})
export class BaseComponent {
  protected _toastService = inject(MessageService);
  protected _modalService = inject(DialogService);
  protected _modalConfig = inject(DynamicDialogConfig);
  protected confirmationService = inject(ConfirmationService);
  protected _route = inject(ActivatedRoute);
  protected _fb = inject(FormBuilder);
  protected _router = inject(Router);
  protected _ref = inject(DynamicDialogRef);

  closeModal() {
    this._ref.close();
  }

  delete(id: number) {}

  deleteDialog(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Haqiqatan ham tanlangan ma'lumotni o'chirmoqchimisiz?",
      header: "O'chirish",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Ha",
      rejectLabel: "Yo'q",
      accept: () => this.delete(id),
      reject: () => {},
    });
  }

  successMessage(message: string = "Ma'lumot qo'shildi.") {
    this._toastService.add({ severity: "success", summary: "Muafaqiyatli", detail: message, life: 3000 });
  }

  successUpdateMessage(message: string = "Ma'lumot yangilandi.") {
    this.successMessage(message);
  }

  errorMessage(message: string = "Serverda xatolik bo'ldi.") {
    this._toastService.add({ severity: "warn", summary: "Ogohlantirish", detail: message, life: 3000 });
  }
}
