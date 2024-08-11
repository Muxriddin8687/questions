import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PrimeNGConfig } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { SubjectService } from "./services/subject.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private _subjectService = inject(SubjectService);
  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = "14px";

    this._subjectService.getAll().pipe(untilDestroyed(this)).subscribe();
  }

  // mdc-light-indigo light
  // mdc-dark-indigo dark
  // changeTheme(theme: string, colorScheme: string) {
  //     const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
  //     const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
  //     this.layoutService.config.colorScheme
  //     this.replaceThemeLink(newHref, () => {
  //         this.layoutService.config.theme = theme;
  //         this.layoutService.config.colorScheme = colorScheme;
  //         this.layoutService.onConfigUpdate();
  //     });
  // }

  // replaceThemeLink(href: string, onComplete: Function) {
  //     const id = 'theme-css';
  //     const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
  //     const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

  //     cloneLinkElement.setAttribute('href', href);
  //     cloneLinkElement.setAttribute('id', id + '-clone');

  //     themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

  //     cloneLinkElement.addEventListener('load', () => {
  //         themeLink.remove();
  //         cloneLinkElement.setAttribute('id', id);
  //         onComplete();
  //     });
  // }
}
