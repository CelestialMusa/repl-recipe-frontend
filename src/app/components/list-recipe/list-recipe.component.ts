import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IRecipe } from 'src/app/helpers/interfaces/recipe.interface';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-recipe',
  templateUrl: './list-recipe.component.html',
  styleUrls: ['./list-recipe.component.scss']
})
export class ListRecipeComponent implements OnInit, AfterViewInit {

  recipes: IRecipe[] = [];

  searchInput = new FormControl();

  is_indexing_db: boolean = false;
  is_indexing_mealdb: boolean = false;

  constructor(
    private _recipeService: RecipeService,
  ) { }

  ngAfterViewInit(): void {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(async (search_string: string) => {
          if(search_string?.length >=3){
            this.is_indexing_db = true;
            
            let filtered_recipes = this.recipes.filter(x => x?.title.includes(search_string));

            if(filtered_recipes.length > 0){
              return of<IRecipe[]>(filtered_recipes);
            }else{
              this.is_indexing_db = false;
              this.is_indexing_mealdb = true;

              return (await this._recipeService.indexMealDB(search_string)).toPromise();
            }
          } else if(search_string?.length === 0){
            this.getAllRecipes();
          }

          return of<IRecipe[]>();
        })
      ).subscribe((recipes: any) => {
        if(recipes?.length > 0)
          this.recipes = recipes;
      });
  }

  ngOnInit(): void {
    this.getAllRecipes();
  }

  async getAllRecipes(){
    (await this._recipeService.getAllRecipes()).toPromise()
      .then(resp => {
        this.recipes = resp;
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          iconColor: '#ff4081',
          confirmButtonColor: '#ff4081',
          title: 'Failure',
          text: err.error.message,
          showConfirmButton: true
        })
      });
  }
}
