import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipesResolverServise } from "./recipes-resolver.service";
import { RecipesStartComponent } from "./recipes-start/recipes-start.component";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
    {
        path: '', component: RecipesComponent, 
            children: [
                    {path: '', component: RecipesStartComponent },
                    {path: 'new', component: RecipeEditComponent},
                    {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverServise]},
                    {path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverServise]}
            ]
    }
]    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RecipesRoutingModule {}