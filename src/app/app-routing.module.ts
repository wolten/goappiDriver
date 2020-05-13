import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  { path: 'main',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [UsuarioGuard]
    // canActivate: [ UsuarioGuard ]
  },
  {  path: 'login',  loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
    // redirectTo: 'main/tabs/tab2'
  }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
