import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

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
    recipe_image: [''],
    instructions: ['', Validators.required],
  });

  constructor(
    private _fb: FormBuilder,
    private _sanitizer: DomSanitizer,
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

  onSubmit(){
    this.recipeForm.markAllAsTouched();

    if(this.recipeForm.valid){
      this.btnOptions.active = true;
      this.btnOptions.text = 'Saving recipe';


    }
  }
}
