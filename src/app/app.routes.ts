import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
// import { FilesavePageComponent } from './pages/filesave/filesave.page.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import { PdfUploaderComponent } from './pages/pdfCreation/pdf-uploader';
import { PptxUploaderComponent } from './pages/pptxUploader/pptxUploader.component';
import { ContentEntryYtComponent } from './pages/content-entry-yt/content-entry-yt.component';
import { ForgotPasswordComponent } from './pages/forgotPassword/ForgotPassword.component';
import { ResetPasswordComponent } from './pages/resetPassword/ResetPassword.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { YoutubePptxGeneratorComponent } from './pages/youtubePptx/youtubePptx.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'signup', component: SigUpComponent, canActivate: [GuestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [GuestGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [GuestGuard] },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      { path: 'app', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin],
          name: 'Users',
          showInSidebar: true
        }
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [GuestGuard],
      },
      {
        path: 'signup',
        component: SigUpComponent,
        canActivate: [GuestGuard],
      },
      {
        path: 'access-denied',
        component: AccessDeniedComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Dashboard'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Profile',
          showInSidebar: false
        }
      },
      {
        path: 'equipo',
        loadComponent: () =>
          import('./pages/team-landing/team-landing.component').then(m => m.TeamLandingComponent)
      },
      {
        path: 'content-entry-yt',
        component: ContentEntryYtComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Content Entry',
          showInSidebar: false
        }
      },
      {
        path: 'pdf-summary',
        component: PdfUploaderComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Resumen de PDF',
          showInSidebar: false
        }
      },
      {
        path: 'pptx-summary',
        component: PptxUploaderComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Resumen de PPTX',
          showInSidebar: false
        }
      },
      {
        path: 'app-youtube-pptx-generator',
        component: YoutubePptxGeneratorComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Resumen YT de PPTX',
          showInSidebar: false
        }
      },
      {
        path: 'filesave',
        loadComponent: () =>
          import('./pages/filesave/filesave.component').then(m => m.FilesavePageComponent),
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Filesave',
          showInSidebar: true
        }
      }
    ]
  }
];
