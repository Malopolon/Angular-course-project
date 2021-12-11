import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
id!: number
editMode = false
recipeFrom!: FormGroup

@ViewChild('newIngredientName', {static: false}) newIngredientName!:ElementRef
@ViewChild('newIngredientAmount', {static: false}) newIngredientAmount!:ElementRef


  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']
      this.editMode = params['id'] !=null
      this.initForm()
    })
  }

  private initForm() {
    let recipeName = ''
    let recipeImgPath = ''
    let recipeDescription = ''
    let recipeIngredients = new FormArray([])

    if(this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id)
      recipeName = recipe.name
      recipeImgPath = recipe.imagePath
      recipeDescription = recipe.description
        if(recipe['ingredients']) {
          for ( let ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredient.name,Validators.required),
              'amount': new FormControl(ingredient.amount,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            }))
          }
        }
    }
    this.recipeFrom= new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImgPath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'newIngredient': new FormGroup({
          'newIngredientName': new FormControl(null),
          'newIngredientAmount': new FormControl(null, Validators.pattern(/^[1-9]+[0-9]*$/))
      }),
      'ingredients': recipeIngredients
    })
  }

  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeFrom.value['name'],
      this.recipeFrom.value['description'],
      this.recipeFrom.value['imagePath'],
      this.recipeFrom.value['ingredients'])
    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe)
    } else {
      this.recipeService.addRecipe(newRecipe)
    }
    this.onCancel()
  }
  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onAddIngredient() {
    (<FormArray>this.recipeFrom.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(this.recipeFrom.get('newIngredient.newIngredientName')?.value, Validators.required),
        'amount': new FormControl(this.recipeFrom.get('newIngredient.newIngredientAmount')?.value,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
    this.recipeFrom.get('newIngredient')?.reset()
  }



  get controls() { 
    return (<FormArray>this.recipeFrom.get('ingredients')).controls;
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeFrom.get('ingredients')).removeAt(index)
  }
}
