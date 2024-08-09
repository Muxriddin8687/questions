import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    standalone: true,
    template: `<p-toast></p-toast>`,
    imports: [ToastModule],
    providers: [MessageService, DialogService]
})
export class BaseComponent {
    protected _router = inject(Router);
    protected _route = inject(ActivatedRoute);
    protected _modalService = inject(DialogService);
    protected _toastService = inject(MessageService);
    protected _fb = inject(FormBuilder);
}