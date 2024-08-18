import { Component, ElementRef, inject, OnInit } from "@angular/core";
import { LayoutService } from "./service/app.layout.service";
import { AppMenuComponent } from "./app.menu.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { SubjectService } from "../services/subject.service";

@UntilDestroy()
@Component({
  selector: "app-sidebar",
  templateUrl: "./app.sidebar.component.html",
  standalone: true,
  imports: [AppMenuComponent],
})
export class AppSidebarComponent implements OnInit {
  public layoutService = inject(LayoutService);
  public el = inject(ElementRef);
  private _subjectService = inject(SubjectService);

  ngOnInit(): void {
    this._subjectService.filterParams = { size: 500, sort: "title" };
    this._subjectService.loadData();
  }
}
