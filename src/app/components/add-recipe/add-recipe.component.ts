import { HttpEventType, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DIFFICULTY_LEVEL, Ingriedient, IRecipe } from 'src/app/helpers/interfaces/recipe.interface';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit, AfterViewInit {
  @ViewChild('recipeName') recipeName: any;

  btnOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Submit recipe',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    mode: 'indeterminate',
    disabled: false
  }

  recipe_image_file: File = null as any;
  recipe_image_display = 'https://source.unsplash.com/uQs1802D0CQ';

  recipeForm = this._fb.group({
    title: ['', Validators.required],
    meal_type: ['', Validators.required],
    number_of_people: ['', Validators.required],
    difficulty_level: ['', Validators.required],
    ingriedients: this._fb.array([this.ingriedients_form()]),
    recipe_image: ['', Validators.required],
    instructions: ['', Validators.required],
  });

  current_recipe: IRecipe = null as any;

  constructor(
    private _fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private _recipe_service: RecipeService,
    private _router: Router,
  ) { }


  ngAfterViewInit(): void {
    setTimeout(() => { //Necessary evil due to the change in the calculated view before it gets rendered. setTimeout defers it to a macro-task that enables it to run after the view data has been calculated. Reference = https://blog.angular-university.io/angular-debugging/
      this.recipeName.nativeElement.focus();
  },.1)
  }

  ngOnInit(): void {
  }

  ingriedients_form(){
    return this._fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
    })
  }

  get ingriedients_form_arr(){
    return this.recipeForm.get('ingriedients') as FormArray;
  }

  addIngriedient($event: Event){
    $event.stopPropagation();
    this.ingriedients_form_arr.push(this.ingriedients_form());
  }

  removeIngriedient(i: number, $event: Event){
    $event.stopPropagation();
    this.ingriedients_form_arr.removeAt(i);
  }

  onFileChanged($event: any){
    this.recipe_image_file = $event?.target?.files[0];

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.recipe_image_display = (fileReader.result as string);
    }

    fileReader.readAsDataURL(this.recipe_image_file);
  }

  getRecipeImage(){
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${this.recipe_image_display})`);
  }

  async onSubmit(){
    this.recipeForm.markAllAsTouched();

    if(this.recipeForm.valid){
      this.btnOptions.active = true;
      this.btnOptions.text = 'Saving recipe';

      let ingriedients_arr: Ingriedient[] = [];
      const ingriedients = ((this.recipeForm.get('ingriedients') as any).controls as any[]);
      
      ingriedients.forEach((element: FormGroup) => {
        ingriedients_arr.push({
          name: element.get('name')?.value,
          amount: element.get('amount')?.value,
        })
      });

      this.current_recipe = {
        title: this.recipeForm.get('title')?.value,
        meal_type: this.recipeForm.get('meal_type')?.value,
        serves: this.recipeForm.get('number_of_people')?.value,
        difficulty_level: this.recipeForm.get('difficulty_level')?.value,
        instructions: this.recipeForm.get('instructions')?.value,
        recipe_image: this.recipe_image_file,
        ingriedients: ingriedients_arr,
      }

      await (await this._recipe_service.persistRecipe(this.current_recipe))
        .pipe(catchError((e) => {
          Swal.fire({
            icon: 'error',
            iconColor: '#ff4081',
            confirmButtonColor: '#ff4081',
            title: 'Failure',
            text: e.error.message,
            showConfirmButton: true,
          });

          this.btnOptions.text = 'Send';
          this.btnOptions.active = false;

          return of<HttpResponse<IRecipe>>();
        }))
        .subscribe(async (resp: HttpResponse<IRecipe>) => {
          if(resp.type == HttpEventType.Response && resp.status == HttpStatusCode.Ok){
            this.btnOptions.text = 'Redirecting';

            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              iconColor: '#ff4081',
              title: 'Success',
              text: `You have added ${resp.body?.title} to the recipes database.`,
              showConfirmButton: false,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              },
              timer: 3000
            }).then(() => {
              this.btnOptions.active = false;
              this.btnOptions.text = 'Submit recipe';

              this._router.navigate(['list-recipes']);
            });
          }
        })

    }
  }
}
