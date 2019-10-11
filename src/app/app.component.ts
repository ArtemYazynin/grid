import { Cell } from './modules/grid/models/cell.model';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridMetaData } from './modules/grid/models/grid-meta-data.model';
import { Row } from './modules/grid/models/row.model';
import { GridMetaDataGeneratorService } from './modules/grid/services/grid-meta-data-generator/grid-meta-data-generator.service';
import { ColumnConfig } from './modules/grid/models/column-config.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  $dataSource: BehaviorSubject<Row[]>;
  $gridMetaData: BehaviorSubject<GridMetaData>;

  constructor(private gridMetaDataGeneratorService: GridMetaDataGeneratorService) {

  }
  ngOnInit(): void {
    this.prepareGrid();
  }
  private prepareGrid() {
    this.preprareDataSource();
    this.prepareMetaData();
  }

  private preprareDataSource() {
    const rows = this.gridMetaDataGeneratorService.getRowsWithBands();
    this.$dataSource = new BehaviorSubject<Row[]>(rows);
  }

  private prepareMetaData() {
    const gridMetaData = this.gridMetaDataGeneratorService.buildGridMetaDataWithBands();
    gridMetaData.updateCell = this.getUpdateCellHandler();
    this.$gridMetaData = new BehaviorSubject<GridMetaData>(gridMetaData);
  }

  private getUpdateCellHandler() {
    return (cell: Cell) => {
      console.log('getUpdateCellHandler');
    };
  }
}

