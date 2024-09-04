import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { LayoutService } from "@core/services/layout.service";
import { MenuitemComponent } from "./menuitem.component";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  standalone: true,
  imports: [MenuitemComponent],
})
export class MenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: "Menu",
        items: [
          { label: "Fanlar", icon: "pi pi-fw pi-folder-open", routerLink: ["/subjects"] },
          { label: "Mavzular", icon: "pi pi-fw pi-file", routerLink: ["/topics"] },
          { label: "Savollar", icon: "pi pi-fw pi-ticket", routerLink: ["/questions"] },
          { label: "Foydalanuvchilar", icon: "pi pi-fw pi-users", routerLink: ["/users"] },
        ],
      },
    ];
  }
}
