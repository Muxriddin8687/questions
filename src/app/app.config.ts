import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { appRoutes } from "./app.routing";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { AuthInterceptor } from "@core/interceptors/auth.interceptor";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: "reload",
      })
    ),
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    MessageService,
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig,
    ConfirmationService,
  ],
};
