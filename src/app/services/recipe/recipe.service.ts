import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRecipe } from 'src/app/helpers/interfaces/recipe.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private _headers = new HttpHeaders({contentType: 'multipart/form-data'});

  constructor(
    private _httpClient: HttpClient,
  ) { }

  async persistRecipe(recipe: IRecipe){
    const form_data = new FormData();
    form_data.append('title', recipe.title);
    form_data.append('meal_type', recipe.meal_type);
    form_data.append('serves', recipe.serves as any);
    form_data.append('instructions', recipe.instructions);
    form_data.append('difficulty_level', recipe.difficulty_level);
    form_data.append('ingriedients', JSON.stringify(recipe.ingriedients));
    form_data.append('file', recipe.recipe_image as any); 

   return this._httpClient.post<IRecipe>(`${environment.api_url}recipe/add`, form_data, {observe: 'response'});
  }

  async getAllRecipes(){
    return this._httpClient.get<IRecipe[]>(`${environment.api_url}recipe/list/25`);
  }

  async indexMealDB(search_string: string){
    return this._httpClient.get<IRecipe[]>(`${environment.api_url}meal-db/search/${search_string}`);
  }
}
