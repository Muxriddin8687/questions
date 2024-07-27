import { Component, OnInit } from '@angular/core';
import { LayoutService } from './layout/service/app.layout.service';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent implements OnInit {

    constructor(private layoutService: LayoutService) { }

    ngOnInit(): void {
        document.documentElement.style.fontSize = '14px';

        this.layoutService.config = {
            ripple: true,
            inputStyle: 'outlined',
            menuMode: 'static',
            colorScheme: 'light',
            theme: 'mdc-light-deeppurple',
            scale: 14
        };
    }

}
