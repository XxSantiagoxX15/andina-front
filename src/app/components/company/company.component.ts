import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { loginService } from '../../services/login.service';
import { EmpresaDialogComponent } from '../empresa-dialog/empresa-dialog.component';
import { SectorDialogComponent } from '../sector-dialog/sector-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SectorEconomico} from '../../models/sector.model';
import { SectorEconomicoService } from '../../services/sector-economico.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule,MatDialogModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class company implements OnInit {
  primerNombre: string | null = localStorage.getItem('primerNombre');
  primerApellido: string | null = localStorage.getItem('primerApellido');;
  sectoresEconomicos: SectorEconomico[] = [];
  empresas: Empresa[] = [];
  empresaSeleccionada: Empresa = {id: 0,nombre:'',descripcion:'',sector_economico_id: 0 };
  modoEdicion: boolean = false;

  constructor(private empresaService: EmpresaService,private dialog:MatDialog,private router: Router,private loginService:loginService,private sectorService: SectorEconomicoService) {}

  ngOnInit(): void {
    this.cargarEmpresas();
    this.cargarSectores();
  }

  cargarEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(data => this.empresas = data);
  }

  cargarSectores(): void {
    this.sectorService.getAllSectores().subscribe({
      next: (sectoresEconomicos) => this.sectoresEconomicos = sectoresEconomicos,
      error: (err) => console.error('Error al cargar sectores', err)
    });
  }

  guardarEmpresa(): void {
    if(this.modoEdicion && this.empresaSeleccionada.id) {
      this.empresaService.updateEmpresa(this.empresaSeleccionada.id, this.empresaSeleccionada)
        .subscribe(() => {
          this.cargarEmpresas();
          this.limpiarFormulario();
        });
    } else {
      this.empresaService.createEmpresa(this.empresaSeleccionada)
        .subscribe(() => {
          this.cargarEmpresas();
          this.limpiarFormulario();
        });
    }
  }
  getSectorNombre(sectorId: number): string {
    const sector = this.sectoresEconomicos.find(s => s.id === sectorId);
    return sector ? sector.nombre : 'Desconocido';
  }
  editarEmpresa(empresa: Empresa): void {
    this.empresaSeleccionada = { ...empresa };
    this.modoEdicion = true;
  }
  abrirDialog(empresa?: Empresa) {
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '400px',
      data: {
        empresa: empresa ? { ...empresa } : { id: 0, nombre: '', sector_economico_id: 0 },
        modoEdicion: !!empresa
      }
    });

    dialogRef.afterClosed().subscribe((resultado: Empresa) => {
      if (resultado) {
        if (empresa) {
          // Edición
          this.empresaService.updateEmpresa(resultado.id!, resultado).subscribe(() => this.cargarSectores());
        } else {
          // Creación
          this.empresaService.createEmpresa(resultado).subscribe(() => this.cargarEmpresas());
        }
      }
    });
  }
  abrirDialogSector(sector?: SectorEconomico) {
    const dialogRef = this.dialog.open(SectorDialogComponent, {
      width: '400px',
      data: {
        sector: sector ? { ...sector } : { nombre: '', descripcion: '' },
        modoEdicion: !!sector
      }
    });
  
    dialogRef.afterClosed().subscribe((resultado: SectorEconomico) => {
      if (resultado) {
        if (sector) {
          this.sectorService.createSector(resultado).subscribe(() => this.cargarSectores());
        }
      }
    });
  }
  eliminarEmpresa(id?: number): void {
    if(id && confirm('¿Seguro que quieres eliminar esta empresa?')) {
      this.empresaService.deleteEmpresa(id)
        .subscribe(() => this.cargarEmpresas());
    }
  } eliminarSector(id?: number): void {
    if(id && confirm('¿Seguro que quieres eliminar este sector?')) {
      this.sectorService.deleteSector(id)
        .subscribe(() => this.cargarSectores());
    }
  }

  limpiarFormulario(): void {
    this.empresaSeleccionada = { id: 0,nombre:'',descripcion:'',sector_economico_id: 0 };
    this.modoEdicion = false;
  }

  
  logout() {
      this.loginService.logout();
      this.router.navigate(['/login']);
    }
}