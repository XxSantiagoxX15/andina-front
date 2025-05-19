import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Empresa } from '../../models/empresa.model';
import { SectorEconomico} from '../../models/sector.model';
import { SectorEconomicoService } from '../../services/sector-economico.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empresa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.modoEdicion ? 'Editar Empresa' : 'Crear Empresa' }}</h2>

    <div mat-dialog-content>
      <form #form="ngForm">
        <mat-form-field class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="data.empresa.nombre" name="nombre" required />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Descripción</mat-label>
          <input matInput [(ngModel)]="data.empresa.descripcion" name="descripcion" required />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Sector Económico</mat-label>
          <mat-select [(ngModel)]="data.empresa.sector_economico_id" name="sector" required>
            <mat-option *ngFor="let sector of sectores" [value]="sector.id">
              {{ sector.nombre }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions>
      <button mat-button (click)="onCancelar()">Cancelar</button>
      <button mat-button color="primary" (click)="onGuardar()">Guardar</button>
    </div>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 1rem; }`]
})
export class EmpresaDialogComponent implements OnInit {
  sectores: SectorEconomico[] = [];

  constructor(
    public dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { empresa: Empresa; modoEdicion: boolean },
    private sectorService: SectorEconomicoService
  ) {}

  ngOnInit(): void {
    this.sectorService.getAllSectores().subscribe({
      next: (sectores) => (this.sectores = sectores),
      error: (err) => console.error('Error cargando sectores económicos', err)
    });
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {
    this.dialogRef.close(this.data.empresa);
  }
}