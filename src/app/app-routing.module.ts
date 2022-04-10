import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { ListRecipeComponent } from './components/list-recipe/list-recipe.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'list-recipes', pathMatch: 'full'},
  {path: 'list-recipes', component: ListRecipeComponent,},
  {path: 'add-recipe', component: AddRecipeComponent,},
  {path: 'recipe-details/:id', component: RecipeDetailsComponent,},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
