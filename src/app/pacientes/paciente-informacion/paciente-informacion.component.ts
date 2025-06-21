import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from "../../../shared.module";
import { IconModule } from "../../shared/icon/icon.module";

@Component({
  selector: 'app-paciente-informacion',
  imports: [CommonModule, SharedModule,IconModule,RouterModule],
  templateUrl: './paciente-informacion.component.html',
  standalone: true,
})
export class PacienteInformacionComponent implements OnInit {

      private route = inject(ActivatedRoute);
       id!: number;
       tab4: string = 'home';

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = +params.get('id')!;
        });
    }
}
