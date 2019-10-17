import { NgModule, LOCALE_ID, InjectionToken } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { StringCellComponent } from './components/string-cell/string-cell.component';
import { DateCellComponent } from './components/date-cell/date-cell.component';
import { CellPipe } from './pipes/cell/cell.pipe';
import { BooleanCellComponent } from './components/boolean-cell/boolean-cell.component';
import { YesNoPipe } from './pipes/yes-no/yes-no.pipe';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    GridComponent,
    DefaultCellComponent,
    NumberCellComponent,
    StringCellComponent,
    DateCellComponent,
    CellPipe,
    BooleanCellComponent,
    YesNoPipe
  ],
  entryComponents: [
    DefaultCellComponent,
    NumberCellComponent,
    StringCellComponent,
    DateCellComponent,
    BooleanCellComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    CdkTableModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    LayoutModule, FlexLayoutModule, // Базовые модули для формирования louout
  ],
  exports: [
    GridComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: 'dateFormat', useValue: 'dd.MM.yyyy' },
    DatePipe,
    YesNoPipe,
    CssInjectorService,
    GridMetaDataGeneratorService
  ]
})
export class GridModule { }
