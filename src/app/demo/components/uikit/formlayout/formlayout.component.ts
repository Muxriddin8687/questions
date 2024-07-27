import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    templateUrl: './formlayout.component.html',
    standalone: true,
    imports: [InputTextModule, ButtonDirective, InputTextareaModule, DropdownModule, FormsModule]
})
export class FormLayoutComponent {

    selectedState: any;

    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];
}
