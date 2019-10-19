import { LayoutModule } from '@angular/cdk/layout';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule, DatePipe } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BooleanCellComponent } from './components/boolean-cell/boolean-cell.component';
import { ColumnsConfigComponent } from './components/columns-selector/columns-selector.component';
import { DateCellComponent } from './components/date-cell/date-cell.component';
import { DefaultCellComponent } from './components/default-cell/default-cell.component';
import { GridComponent } from './components/grid/grid.component';
import { NumberCellComponent } from './components/number-cell/number-cell.component';
import { StringCellComponent } from './components/string-cell/string-cell.component';
import { CellPipe } from './pipes/cell/cell.pipe';
import { YesNoPipe } from './pipes/yes-no/yes-no.pipe';
import { CssInjectorService } from './services/css-injector.service';
import { GridMetaDataGeneratorService } from './services/grid-meta-data-generator/grid-meta-data-generator.service';
import {MatListModule} from '@angular/material/list';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { GridService } from './services/grid/grid.service';
@NgModule({
  declarations: [
    ColumnsConfigComponent,
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
    BooleanCellComponent,
    ColumnsConfigComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    DragDropModule,
    MatListModule,
    MatDialogModule,
    CdkTableModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
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
    GridMetaDataGeneratorService,
    GridService
  ]
})
export class GridModule { }
