import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { ReactiveFormsModule } from '@angular/forms'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegistroComponent } from './pages/registro/registro.component';
import { environment } from 'src/environments/environment';
import { OikosService } from './services/oikos.service';
import { OikosMidService } from './services/oikos_mid.service';
import { GestionComponent } from './pages/gestion/gestion.component';
import { OrganigramaDialogComponent } from './pages/gestion/components/organigrama-dialog/organigrama-dialog.component';
import { EditarDependenciaDialogComponent } from './pages/gestion/components/editar-dependencia-dialog/editar-dependencia-dialog.component';

export function createTranslateLoader(http: HttpClient) {
  console.log("environment ", environment)
  console.log(environment.apiUrl + 'assets/i19n/', '.json')
  return new TranslateHttpLoader(http, environment.apiUrl + 'assets/i19n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    GestionComponent,
    OrganigramaDialogComponent,
    EditarDependenciaDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatFormFieldModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    OrganizationChartModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    OikosService,
    OikosMidService,
    TranslateService,
    TranslateStore,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
