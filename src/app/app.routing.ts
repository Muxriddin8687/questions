import { Routes } from "@angular/router";
import { authRoutes } from "./demo/components/auth/auth.routing";
import { pagesRoutes } from "./demo/components/pages/pages.routing";
import { uikitRoutes } from "./demo/components/uikit/uikit.routing";

export const appRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layout/app.layout.component').then(c => c.AppLayoutComponent),
        children: [
            {
                path: 'subjects',
                loadComponent: () => import('./pages/subjects/subjects.component').then(c => c.SubjectsComponent)
            },
            {
                path: 'topics',
                loadComponent: () => import('./pages/topics/topics.component').then(c => c.TopicsComponent)
            },
            {
                path: 'questions',
                loadComponent: () => import('./pages/questions/questions.component').then(c => c.QuestionsComponent)
            },
            {
                path: '',
                loadComponent: () => import('./demo/components/dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: 'mydashboard',
                loadComponent: () => import('./demo/components/mydashboard/mydashboard.component').then(c => c.MyDashboardComponent)
            },
            {
                path: 'blocks',
                loadComponent: () => import('./demo/components/primeblocks/blocks/blocks.component').then(c => c.BlocksComponent)
            },
            {
                path: 'utilities',
                loadComponent: () => import('./demo/components/utilities/icons/icons.component').then(c => c.IconsComponent),
            },
            {
                path: 'documentation',
                loadComponent: () => import('./demo/components/documentation/documentation.component').then(c => c.DocumentationComponent)
            },
            ...pagesRoutes,
            ...uikitRoutes,
        ],
    },
    ...authRoutes,
    {
        path: 'landing',
        loadComponent: () => import('./demo/components/landing/landing.component').then(c => c.LandingComponent)
    },
    {
        path: 'pages/notfound',
        loadComponent: () => import('./demo/components/notfound/notfound.component').then(c => c.NotfoundComponent)
    },
    { path: '**', redirectTo: 'pages/notfound' },
];
