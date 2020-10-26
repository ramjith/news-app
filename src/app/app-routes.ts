import { Routes } from '@angular/router';
import { VisitedComponent } from './visited/visited.component';
import { NewsComponent } from './news/news.component';

const routes: Routes = [
  { path: 'home', component: NewsComponent},
  { path: 'visited', component: VisitedComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }

];
export default routes;
