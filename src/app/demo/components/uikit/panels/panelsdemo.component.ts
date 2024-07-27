import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { SplitterModule } from 'primeng/splitter';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonDirective, Button } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    templateUrl: './panelsdemo.component.html',
    standalone: true,
    imports: [ToolbarModule, ButtonDirective, SplitButtonModule, AccordionModule, TabViewModule, PanelModule, FieldsetModule, MenuModule, InputTextModule, Button, DividerModule, SplitterModule, PrimeTemplate]
})
export class PanelsDemoComponent implements OnInit {

    items: MenuItem[] = [];

    cardMenu: MenuItem[] = [];

    ngOnInit() {
        this.items = [
            { label: 'Angular.io', icon: 'pi pi-external-link', url: 'http://angular.io' },
            { label: 'Theming', icon: 'pi pi-bookmark', routerLink: ['/theming'] }
        ];

        this.cardMenu = [
            {
                label: 'Save', icon: 'pi pi-fw pi-check'
            },
            {
                label: 'Update', icon: 'pi pi-fw pi-refresh'
            },
            {
                label: 'Delete', icon: 'pi pi-fw pi-trash'
            },
        ];
    }
}
