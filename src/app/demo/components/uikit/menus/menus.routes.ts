import { Routes } from "@angular/router";

export const menusRoutes: Routes = [
    {
        path: "menu",
        loadComponent: () => import("./menus.component").then((c) => c.MenusComponent),
        children: [
            { path: '', redirectTo: 'personal', pathMatch: 'full' },
            { path: 'personal', loadComponent: () => import('./personal.component').then(c => c.PersonalComponent) },
            { path: 'confirmation', loadComponent: () => import('./confirmation.component').then(c => c.ConfirmationComponent) },
            { path: 'seat', loadComponent: () => import('./seat.component').then(c => c.SeatComponent) },
            { path: 'payment', loadComponent: () => import('./payment.component').then(c => c.PaymentComponent) }
        ],
    },
];

