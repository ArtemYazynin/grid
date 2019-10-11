import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { GridComponent } from './components/grid/grid.component';
import { CssInjectorService } from './services/css-injector.service';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DefaultCellComponent } from './components/default-cell/default-cell.component';
import { NumberCellComponent } from './components/number-cell/number-cell.component';
import { GridMetaDataGeneratorService } from './services/grid-meta-data-generator/grid-meta-data-generator.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GridComponent, DefaultCellComponent, NumberCellComponent],
  entryComponents: [DefaultCellComponent, NumberCellComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    LayoutModule, FlexLayoutModule, // Базовые модули для формирования louout
  ],
  exports: [
    GridComponent
  ],
  providers: [
    CssInjectorService,
    GridMetaDataGeneratorService
  ]
})
export class GridModule { }
