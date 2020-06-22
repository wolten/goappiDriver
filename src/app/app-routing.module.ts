import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  { path: 'main',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [UsuarioGuard]
  },
  {  path: 'login',  loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'delivery',
    loadChildren: () => import('./pages/delivery/delivery.module').then( m => m.DeliveryPageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'tab4',
    loadChildren: () => import('./pages/tab4/tab4.module').then( m => m.Tab4PageModule)
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
