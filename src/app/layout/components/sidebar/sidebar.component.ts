import { Component, ElementRef, inject, OnInit } from "@angular/core";
import { LayoutService } from "@core/services/layout.service";
import { MenuComponent } from "../menu/menu.component";
import { SubjectService } from "../../../services/subject.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  standalone: true,
  imports: [MenuComponent],
})
export class SidebarComponent implements OnInit {
  public layoutService = inject(LayoutService);
  public el = inject(ElementRef);
  private _subjectService = inject(SubjectService);

  ngOnInit(): void {
    this._subjectService.filterParams = { size: 500, sort: "title" };
    this._subjectService.loadData();
  }
}
