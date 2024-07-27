import { Routes } from "@angular/router";
import { menusRoutes } from "./menus/menus.routes";

export const uikitRoutes: Routes = [
    {
        path: "uikit",
        loadComponent: () => import("./uikit.component").then((c) => c.UikitComponent),
        children: [
            ...menusRoutes,
            { path: 'formlayout', loadComponent: () => import('./formlayout/formlayout.component').then(c => c.FormLayoutComponent) },
            { path: 'button', loadComponent: () => import('./button/buttondemo.component').then(c => c.ButtonDemoComponent) },
            { path: 'charts', loadComponent: () => import('./charts/charts.component').then(c => c.ChartsComponent) },
            { path: 'file', loadComponent: () => import('./file/filedemo.component').then(c => c.FileDemoComponent) },
            { path: 'floatlabel', loadComponent: () => import('./floatlabel/floatlabeldemo.component').then(c => c.FloatLabelDemoComponent) },
            { path: 'input', loadComponent: () => import('./input/inputdemo.component').then(c => c.InputDemoComponent) },
            { path: 'invalidstate', loadComponent: () => import('./invalid/invalidstatedemo.component').then(c => c.InvalidStateDemoComponent) },
            { path: 'list', loadComponent: () => import('./list/listdemo.component').then(c => c.ListDemoComponent) },
            { path: 'media', loadComponent: () => import('./media/mediademo.component').then(c => c.MediaDemoComponent) },
            { path: 'message', loadComponent: () => import('./messages/messagesdemo.component').then(c => c.MessagesDemoComponent) },
            { path: 'misc', loadComponent: () => import('./misc/miscdemo.component').then(c => c.MiscDemoComponent) },
            { path: 'overlay', loadComponent: () => import('./overlays/overlaysdemo.component').then(c => c.OverlaysDemoComponent) },
            { path: 'panel', loadComponent: () => import('./panels/panelsdemo.component').then(c => c.PanelsDemoComponent) },
            { path: 'table', loadComponent: () => import('./table/tabledemo.component').then(c => c.TableDemoComponent) },
            { path: 'tree', loadComponent: () => import('./tree/treedemo.component').then(c => c.TreeDemoComponent) },
        ],
    },
];


