import { Component, EventEmitter, OnInit, Output} from '@angular/core';

import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>()
 recipes: Recipe[] = [
    new Recipe('A test recipe', 
               'this is simply test', 
               'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505'),
    new Recipe('A test another recipe', 
               'this is simply test', 
               'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505')
  ]

  
  constructor() { }

  ngOnInit(): void {
  }
  onSelectedRecipe(recipeSelected: Recipe) {
    this.recipeWasSelected.emit(recipeSelected)
  }
}
