import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-uikit',
    template: `<router-outlet />`,
    imports: [RouterOutlet],
    standalone: true
})
export class UikitComponent { }