import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { GridComponent } from './components/grid/grid.component';
import { CssInjectorService } from './services/css-injector.service';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [GridComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    LayoutModule, FlexLayoutModule, // Базовые модули для формирования louout
  ],
  exports: [
    GridComponent
  ],
  providers:[
    CssInjectorService
  ]
})
export class GridModule { }
