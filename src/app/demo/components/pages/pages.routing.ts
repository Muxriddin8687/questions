import { Routes } from "@angular/router";

export const pagesRoutes: Routes = [
    {
        path: "pages",
        loadComponent: () => import("./pages.component").then((c) => c.PagesComponent),
        children: [
            {
                path: 'crud',
                loadComponent: () => import('./crud/crud.component').then(c => c.CrudComponent)
            },
            {
                path: 'empty',
                loadComponent: () => import('./empty/emptydemo.component').then(c => c.EmptyDemoComponent)
            },
            {
                path: 'timeline',
                loadComponent: () => import('./timeline/timelinedemo.component').then(c => c.TimelineDemoComponent)
            }
        ],
    },
];

