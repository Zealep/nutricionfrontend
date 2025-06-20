import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { firstValueFrom } from 'rxjs';
import { Patologia } from 'src/app/model/patologia';
import { PatologiaService } from 'src/app/service/patologia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patologias',
  standalone: true,
 imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule ],
  templateUrl: './patologias.component.html',
  styleUrl: './patologias.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatologiasComponent { 
       loading = false;
       private readonly patologiaService = inject(PatologiaService);
       private readonly fb = inject(FormBuilder);
       patologias= signal<Patologia[]>([]);
       @ViewChild ('datatable') datatable: any;
       @ViewChild('addModal') addModal!: NgxCustomModalComponent;
       params!: FormGroup;
       search = '';
       tipo:any;
  
       cols = [
           { field: 'id', title: 'ID', isUnique: true },
           { field: 'descripcion', title: 'Descripcion' },
           { field: 'acciones', title: 'Acciones' },
       ];
  
       initForm() {
           this.params = this.fb.group({
               id: [0],
               descripcion: [''],
           });
       }
  
       ngOnInit(): void {
           this.getAll();
       }
  
       getAll() {
           this.patologiaService.getAll().subscribe((data) => {
               this.patologias.set(data);
           });
       }



       editar(row: Patologia | null) {
           this.addModal.open();
           this.initForm();
           if (row) {
               this.params.setValue({
                   id: row.id,
                   descripcion: row.descripcion,
               });
           }
       }
  
       guardar(){
  
  
           if (this.params.controls['descripcion'].errors) {
               this.showMessage('La descripcion es requerida.', 'error');
               return;
           }


           const req: Patologia = {
               id: this.params.value.id != 0 ? this.params.value.id : null,
               descripcion: this.params.value.descripcion,
           };

           this.patologiaService.save(req).subscribe(data => {
           this.getAll();
           this.showMessage('Registro guardado', 'success');
           this.addModal.close();
           });
  
       }

       eliminar(row: Patologia) {
           Swal.fire({
               title: 'Desea eliminar el registro?',
               showCancelButton: true,
               confirmButtonText: 'SI',
               icon: "warning",
           }).then(async (result) => {
               if (result.isConfirmed) {
                   await firstValueFrom(this.patologiaService.delete(row.id!));
                   this.getAll();
                 this.showMessage('Registro Eliminado', 'success');
               }
           });
       }
  
       showMessage(msg = '', type = 'success') {
           const toast: any = Swal.mixin({
               toast: true,
               position: 'top',
               showConfirmButton: false,
               timer: 3000,
               customClass: { container: 'toast' },
           });
           toast.fire({
               icon: type,
               title: msg,
               padding: '10px 20px',
           });
       }
  
  }
