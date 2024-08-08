import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        path: "auth",
        loadComponent: () => import("./auth.component").then((c) => c.AuthComponent),
        children: [
            {
                path: 'error',
                loadComponent: () => import('./error/error.component').then(c => c.ErrorComponent)
            },
            {
                path: 'login',
                loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),
            },
            { path: "", redirectTo: "login", pathMatch: "full" },
        ],
    },
];

