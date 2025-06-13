import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { NgApexchartsModule } from 'ng-apexcharts';

import { firstValueFrom } from 'rxjs';
import { Protocolo } from 'src/app/model/protocolo';
import { ProtocoloService } from 'src/app/service/protocolo.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCustomModalComponent } from 'ngx-custom-modal';

@Component({
    selector: 'app-protocolo',
    standalone: true,
    imports: [DataTableModule, NgApexchartsModule, CommonModule, FormsModule,NgxCustomModalComponent,ReactiveFormsModule],
    templateUrl: './protocolo.component.html',
    styleUrl: './protocolo.component.css',
})
export class ProtocoloComponent {
    loading = false;
    private readonly protocoloService = inject(ProtocoloService);
    private readonly fb = inject(FormBuilder);
    protocolos: Protocolo[] = [];
    @ViewChild ('datatable') datatable: any;
    @ViewChild('addModal') addModal!: NgxCustomModalComponent;
    params!: FormGroup;

    filterdProtocoloList: any = [];
    search = '';

    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'codigo', title: 'Codigo' },
        { field: 'descripcion', title: 'Descripcion' },
        { field: 'acciones', title: 'Acciones' },
    ];

    initForm() {
        this.params = this.fb.group({
            id: [0],
            codigo: [''],
            descripcion: [''],
        });
    }

    ngOnInit(): void {
        this.getAll();
    }

    getAll() {
        this.protocoloService.getAll().subscribe((data) => {
            this.protocolos = data;
        });
    }

    editar(row: Protocolo | null) {
        this.addModal.open();
        this.initForm();
        if (row) {
            this.params.setValue({
                id: row.id,
                codigo: row.codigo,
                descripcion: row.descripcion,
            });
        }
    }

    guardar(){
         if (this.params.controls['codigo'].errors) {
            this.showMessage('Codigo es requerido.', 'error');
            return;
        }

        if (this.params.controls['descripcion'].errors) {
            this.showMessage('Descripcion es requerido.', 'error');
            return;
        }

        const req: Protocolo = {
            id: this.params.value.id != 0 ? this.params.value.id : null,
            codigo: this.params.value.codigo,
            descripcion: this.params.value.descripcion,
        };

        this.protocoloService.save(req).subscribe(data => {
        this.getAll();
        this.showMessage('Registro guardado', 'success');
        this.addModal.close();
        });

    }

    eliminar(row: Protocolo) {
        Swal.fire({
            title: 'Desea eliminar el registro?',
            showCancelButton: true,
            confirmButtonText: 'SI',
            icon: "warning",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await firstValueFrom(this.protocoloService.delete(row.id!));
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
