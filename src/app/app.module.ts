
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//#region  Custom module imports
import { MaterialModule } from './modules/material/material.module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
//#endregion End Custom module imports

//#region In-app components
import { AppComponent } from './app.component';
import { MainnavComponent } from './components/main-nav/main-nav.component';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { FooterComponent } from './components/footer/footer.component';
import { ListRecipeComponent } from './components/list-recipe/list-recipe.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';

//#region End In-app components



@NgModule({
  declarations: [
    AppComponent,
    MainnavComponent,
    AddRecipeComponent,
    FooterComponent,
    ListRecipeComponent,
    RecipeDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatProgressButtonsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
