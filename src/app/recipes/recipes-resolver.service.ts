import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";

import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverServise implements Resolve<Recipe[]> {

    constructor(private dataStorage: DataStorageService,
                private recipeServise: RecipeService) {}

    resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const recipes = this.recipeServise.getRecipes()

        if(recipes.length === 0) {
            return this.dataStorage.fetchRecipes()
        } else {
            return recipes
        }
    }
}