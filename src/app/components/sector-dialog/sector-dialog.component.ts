import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SectorEconomico } from '../../models/sector.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.modoEdicion ? 'Editar Sector Económico' : 'Crear Sector Económico' }}</h2>

    <div mat-dialog-content>
      <form #form="ngForm">
        <mat-form-field class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="data.sector.nombre" name="nombre" required />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Descripción</mat-label>
          <input matInput [(ngModel)]="data.sector.descripcion" name="descripcion" required />
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
export class SectorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sector: SectorEconomico; modoEdicion: boolean }
  ) {}

  onCancelar(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {
    this.dialogRef.close(this.data.sector);
  }
}