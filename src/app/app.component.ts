import { EditedCell } from './modules/grid/models/edited-cell.model';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridMetaData } from './modules/grid/models/grid-meta-data.model';
import { GridMetaDataGeneratorService } from './modules/grid/services/grid-meta-data-generator/grid-meta-data-generator.service';
import { GroupRow } from './modules/grid/models/group-row.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  $rows: BehaviorSubject<any[]>;
  $gridMetaData: BehaviorSubject<GridMetaData>;

  constructor(private gridMetaDataGeneratorService: GridMetaDataGeneratorService,private cdr:ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.prepareGrid();
  }
  private prepareGrid() {
    this.preprareDataSource();
    this.prepareMetaData();
  }

  private preprareDataSource() {
    const rows = this.gridMetaDataGeneratorService.getRows();
    rows.push(new GroupRow('Удалены', 'isDeleted', true));
    rows.push(new GroupRow('Не удалены', 'isDeleted', false));
    this.$rows = new BehaviorSubject<any[]>(rows);
  }

  private prepareMetaData() {
    const gridMetaData = this.gridMetaDataGeneratorService.buildGridMetaDataWithBands();
    gridMetaData.updateCell = this.getUpdateCellHandler();
    this.$gridMetaData = new BehaviorSubject<GridMetaData>(gridMetaData);
  }

  private getUpdateCellHandler() {
    return (cell: EditedCell) => {
      console.log(`getUpdateCellHandler: ${cell.value}`);
    };
  }

  add(){
    const oldArray = this.$rows.value;
    const newArray = this.gridMetaDataGeneratorService.getRows();
    const result = [...oldArray, ...newArray];
    this.$rows.next(result);
    setTimeout(() => {
      this.cdr.markForCheck(); 
    });
  }
}

