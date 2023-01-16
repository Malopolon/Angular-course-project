import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
recipeFrom!: UntypedFormGroup

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
    let recipeIngredients = new UntypedFormArray([])

    if(this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id)
      recipeName = recipe.name
      recipeImgPath = recipe.imagePath
      recipeDescription = recipe.description
        if(recipe['ingredients']) {
          for ( let ingredient of recipe.ingredients) {
            recipeIngredients.push(new UntypedFormGroup({
              'name': new UntypedFormControl(ingredient.name,Validators.required),
              'amount': new UntypedFormControl(ingredient.amount,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            }))
          }
        }
    }
    this.recipeFrom= new UntypedFormGroup({
      'name': new UntypedFormControl(recipeName, Validators.required),
      'imagePath': new UntypedFormControl(recipeImgPath, Validators.required),
      'description': new UntypedFormControl(recipeDescription, Validators.required),
      'newIngredient': new UntypedFormGroup({
          'newIngredientName': new UntypedFormControl(null),
          'newIngredientAmount': new UntypedFormControl(null, Validators.pattern(/^[1-9]+[0-9]*$/))
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
    (<UntypedFormArray>this.recipeFrom.get('ingredients')).push(
      new UntypedFormGroup({
        'name': new UntypedFormControl(this.recipeFrom.get('newIngredient.newIngredientName')?.value, Validators.required),
        'amount': new UntypedFormControl(this.recipeFrom.get('newIngredient.newIngredientAmount')?.value,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
    this.recipeFrom.get('newIngredient')?.reset()
  }



  get controls() { 
    return (<UntypedFormArray>this.recipeFrom.get('ingredients')).controls;
  }

  onDeleteIngredient(index: number) {
    (<UntypedFormArray>this.recipeFrom.get('ingredients')).removeAt(index)
  }
}
