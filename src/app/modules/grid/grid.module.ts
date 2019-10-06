import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { GridComponent } from './components/grid/grid.component';

@NgModule({
  declarations: [GridComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  exports:[
    GridComponent
  ]
})
export class GridModule { }
