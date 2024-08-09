import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '@core/components/base.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent extends BaseComponent {
  private _http = inject(HttpClient);
  private api = environment.api;

  form = this._fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  })
  display: boolean = false;

  save() {
    this._http.post(this.api + 'sasubjects', this.form.value).subscribe({
      next: () => {
        this.display = false;
        this.form.reset();
        this._toastService.add({ severity: 'success', summary: 'Muafaqiyatli', detail: 'Ma\'lumot qo\'shildi.', life: 3000 });
      },
      error: () => {
        this._toastService.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Serverda xatolik bo\'ldi.', life: 3000 });
      }
    });
  }
}
