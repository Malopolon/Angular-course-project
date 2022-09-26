import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';

import * as fromShoppingList from '../store/shopping-list.reducer'
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  
  @ViewChild('shopForm', {static: false}) slForm!: NgForm
  sub!: Subscription
  editMode = false
  editedItemIndex!: number
  editedItem!: Ingredient

  constructor(private slService: ShoppingListService,
              private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit() {
    this.sub = this.slService.startedEditing.subscribe(
      (index:number) => {
        this.editMode= true
        this.editedItemIndex = index
        this.editedItem = this.slService.getIngredient(index)
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    )
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  onSubmit(form:NgForm) {
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);

    if(this.editMode) {
      //this.slService.updateIngredient(this.editedItemIndex, newIngredient)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient({
          index: this.editedItemIndex, 
          ingredient: newIngredient
        })
      )
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }
      this.editMode = false
    form.reset()
  }

  onClear() {
    this.slForm.reset()
    this.editMode = false
  }

  onDelete() {
    //this.slService.deleteIngredient(this.editedItemIndex)
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex))
    this.onClear()
  }

}
