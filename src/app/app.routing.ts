import { Routes } from "@angular/router";
import { authRoutes } from "@pages/auth/auth.routing";
import { authGuard } from "@core/guards/auth.guard";

export const appRoutes: Routes = [
  ...authRoutes,
  { path: "**", redirectTo: "pages/notfound" },
  {
    path: "",
    loadComponent: () => import("./layout/layout.component").then((c) => c.LayoutComponent),
    children: [
      {
        path: "subjects",
        canActivate: [authGuard],
        loadComponent: () => import("./pages/subjects/subjects.component").then((c) => c.SubjectsComponent),
      },
      {
        path: "topics",
        canActivate: [authGuard],
        loadComponent: () => import("./pages/topics/topics.component").then((c) => c.TopicsComponent),
      },
      {
        path: "questions",
        canActivate: [authGuard],
        loadComponent: () => import("./pages/questions/questions.component").then((c) => c.QuestionsComponent),
      },
      {
        path: "users",
        canActivate: [authGuard],
        loadComponent: () => import("./pages/users/users.component").then((c) => c.UsersComponent),
      },
    ],
  },
];
