import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { RecipesComponent } from '../recipes/recipes.component';
import { RecipeDetailComponent } from '../recipes/recipe-detail/recipe-detail.component';
import { RecipesStartComponent } from '../recipes/recipes-start/recipes-start.component';
import { AuthComponent } from '../auth/auth.component';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { RecipeEditComponent } from '../recipes/recipe-edit/recipe-edit.component';

import { RecipesResolverServise } from '../recipes/recipes-resolver.service';



const appRoutes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {path: 'recipes', component: RecipesComponent, children: [
    {path: '', component: RecipesStartComponent },
    {path: 'new', component: RecipeEditComponent},
    {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverServise]},
    {path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverServise]}
  ]},
  {path: 'shopping-list', component: ShoppingListComponent},
  {path: 'auth', component: AuthComponent}
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutersModule { }
