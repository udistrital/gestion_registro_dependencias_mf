import { Component, Inject, OnInit} from '@angular/core';
import { Desplegables } from 'src/app/models/desplegables.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OikosService } from '../../../../services/oikos.service';
import { OikosMidService } from '../../../../services/oikos_mid.service';
import { BusquedaGestion } from 'src/app/models/busquedaGestion.models';
import { catchError, tap } from 'rxjs/operators';
import { PopUpManager } from '../../../../managers/popUpManager'
import { of } from 'rxjs';




@Component({
  selector: 'app-editar-dependencia-dialog',
  templateUrl: './editar-dependencia-dialog.component.html',
  styleUrls: ['./editar-dependencia-dialog.component.css']
})
export class EditarDependenciaDialogComponent implements OnInit {
  dependencia: BusquedaGestion;
  tiposDependencia: Desplegables[] = [];
  dependenciasAsociadas: Desplegables[] = [];
  tiposSeleccionados: Desplegables[]=[];

  EditarForm !: FormGroup;
   

  constructor(
    public dialogRef: MatDialogRef<EditarDependenciaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private oikosService: OikosService,
    private oikosMidService: OikosMidService,
    private popUpManager: PopUpManager,
  ){
    this.dependencia = data;
    this.preseleccionarDatosDependencia();
    this.cargarTiposDependencia();
    this.cargarDependenciasAsociadas();
    this.preseleccionarDependenciaAsociada();
  }

  ngOnInit() {
    this.iniciarFormularioConsulta();
  }
  iniciarFormularioConsulta(){
    this.EditarForm = new FormGroup({
      nombre: new FormControl<string | null>(null, {
        nonNullable: false,
        validators: [Validators.required]
      }),
      telefono: new FormControl<string | null>(null, {
        nonNullable: false,
        validators: [Validators.required]
      }),
      correo: new FormControl<string | null>(null, {
        nonNullable: false,
        validators: [Validators.required]
      }),
      tipoDependencia: new FormControl<Desplegables[] >([], {
        nonNullable: true,
        validators: [Validators.required]
      }),
      dependenciaAsociada: new FormControl<Desplegables | null>(null, {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }
  cargarTiposDependencia() {
    this.oikosService.get('tipo_dependencia?limit=-1&query=Activo:true').subscribe((res: any) => {
      this.tiposDependencia = res.map((item: any) => ({
        id: item.Id,
        nombre: item.Nombre
      }));
      this.preseleccionarTiposDependencia();
    });
  }
  
  preseleccionarTiposDependencia() {
    if (!this.dependencia || !this.dependencia.tipoDependencia) {
        return;
    }
    const tiposDependenciaEnData = this.dependencia.tipoDependencia;
    this.tiposSeleccionados = this.tiposDependencia.filter(td =>
        tiposDependenciaEnData.some((tdData: any) => tdData.id === td.id)
    );
    this.EditarForm.get('tipoDependencia')?.setValue(this.tiposSeleccionados);
}

  cargarDependenciasAsociadas(){
    this.oikosService.get('dependencia?query=Activo:true&limit=-1').subscribe((res:any)=>{
      this.dependenciasAsociadas =res.map((item:any) => ({
        id: item.Id,
        nombre: item.Nombre
      }));
      this.preseleccionarDependenciaAsociada();
    });
  }

  preseleccionarDependenciaAsociada(){
    if (!this.dependencia || !this.dependencia.dependenciasAsociadas) {
      return;
    }
    const dependenciaAsociadaPreseleccionada = this.dependenciasAsociadas.find(dep => dep.id === this.dependencia.dependenciasAsociadas.id) || null;
    this.EditarForm.get('dependenciaAsociada')?.setValue(dependenciaAsociadaPreseleccionada)
  }

  preseleccionarDatosDependencia(){
    this.EditarForm.get('nombre')?.setValue(this.dependencia.nombre)
    this.EditarForm.get('telefono')?.setValue(this.dependencia.telefono)
    this.EditarForm.get('correo')?.setValue(this.dependencia.correo)
  }

  construirEdicion(){
    const formValues = this.EditarForm.value;
    return {
      DependenciaId: this.dependencia.id,
      Nombre: formValues.nombre,
      TelefonoDependencia: formValues.telefono,
      CorreoElectronico: formValues.correo,
      TipoDependenciaId: formValues.tipoDependencia?.map((tipo: Desplegables) => tipo.id) || [],
      DependenciaAsociadaId: formValues.dependenciaAsociada?.id
    };
  }
  
  
  editarDependencia(){
    const editar = this.construirEdicion();
    this.oikosMidService.post("gestion_dependencias_mid/EditarDependencia", editar).pipe(
      tap((res: any) => {
          if (res.Success) {
              this.popUpManager.showSuccessAlert("Dependencia creada");
          } else {
              this.popUpManager.showErrorAlert("Error al crear la dependencia");
          }
      }),
      catchError((error) => {
          console.error('Error en la solicitud:', error);
          this.popUpManager.showErrorAlert("Error al crear la dependencia: " + (error.message || 'Error desconocido'));
          return of(null); 
      })
    ).subscribe();
    this.dialogRef.close();
  }

  onCloseClick(){
    this.dialogRef.close();
  }
}
