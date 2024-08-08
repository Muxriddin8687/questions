import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-auth',
    template: `<router-outlet />`,
    standalone: true,
    imports: [RouterModule],
})
export class AuthComponent { }