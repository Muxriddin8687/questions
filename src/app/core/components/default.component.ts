import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    standalone: true,
    template: ''
})
export class BaseComponent {
    _router = inject(Router);
    _route = inject(ActivatedRoute);
}