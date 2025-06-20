import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { firstValueFrom } from 'rxjs';
import { Alergia } from 'src/app/model/alergias';
import { AlergiaService } from 'src/app/service/alergia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alergias',
  templateUrl: './alergias.component.html',
  styleUrls: ['./alergias.component.css'],
  imports: [DataTableModule, CommonModule, FormsModule, NgxCustomModalComponent, ReactiveFormsModule,
      NgSelectComponent ],
  standalone: true,
})
export class AlergiasComponent implements OnInit {

 loading = false;
     private readonly alergiasService = inject(AlergiaService);
     private readonly fb = inject(FormBuilder);
     alergias= signal<Alergia[]>([]);
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
         this.alergiasService.getAll().subscribe((data) => {
             this.alergias.set(data);
         });
     }



     editar(row: Alergia | null) {
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


         const req: Alergia = {
             id: this.params.value.id != 0 ? this.params.value.id : null,
             descripcion: this.params.value.descripcion,
         };

         this.alergiasService.save(req).subscribe(data => {
         this.getAll();
         this.showMessage('Registro guardado', 'success');
         this.addModal.close();
         });

     }

     eliminar(row: Alergia) {
         Swal.fire({
             title: 'Desea eliminar el registro?',
             showCancelButton: true,
             confirmButtonText: 'SI',
             icon: "warning",
         }).then(async (result) => {
             if (result.isConfirmed) {
                 await firstValueFrom(this.alergiasService.delete(row.id!));
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
