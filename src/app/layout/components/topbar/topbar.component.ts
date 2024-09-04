import { Component, ElementRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { LayoutService } from "@core/services/layout.service";
import { NgClass } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  standalone: true,
  imports: [RouterLink, NgClass],
})
export class TopBarComponent {
  items!: MenuItem[];

  @ViewChild("menubutton") menuButton!: ElementRef;

  @ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;

  @ViewChild("topbarmenu") menu!: ElementRef;

  constructor(public layoutService: LayoutService) {}
}
