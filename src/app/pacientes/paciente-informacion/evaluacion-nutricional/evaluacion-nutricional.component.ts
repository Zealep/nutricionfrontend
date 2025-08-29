import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgLabelTemplateDirective, NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { firstValueFrom } from 'rxjs';
import { Paciente } from 'src/app/model/paciente';
import { PacienteService } from 'src/app/service/paciente.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
    selector: 'app-evaluacion-nutricional',
    standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgLabelTemplateDirective, NgOptionComponent, NgSelectComponent],
    templateUrl: './evaluacion-nutricional.component.html',
})
export class EvaluacionNutricionalComponent {
    private readonly pacientesService = inject(PacienteService);
    private readonly fb = inject(FormBuilder);
    private readonly toastService = inject(ToastService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    params!: FormGroup;

    paciente = signal<Paciente>({
        apellidos: '',
        nombres: '',
        fechaNacimiento: '',
        sexo: '',
        celular: '',
        correo: '',
    });

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.params = this.fb.group({
            peso: [''],
            talla: [''],
            imc: [''],
            circunferenciaCintura: [''],
            circunferenciaCadera: [''],
            medidaCuello: [''],
        });
        this.asignarPaciente();
    }

    async asignarPaciente() {
        const paciente = await firstValueFrom(this.pacientesService.getById(this.route.snapshot.params['id']));
        this.paciente.set(paciente);
        this.params.patchValue(paciente);
    }

    calcularIMC(){
        const peso = this.params.get('peso')?.value;
        const talla = this.params.get('talla')?.value;

        if (peso && talla) {
            const imc = peso / ((talla / 100) ** 2);
            const imcRound = Math.round(imc * 10) / 10; // Redondear a 2 decimales
            this.params.patchValue({ imc: imcRound });
        }
    }
}
