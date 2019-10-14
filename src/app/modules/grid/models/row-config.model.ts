import { MetaData } from './meta-data.model';


export class RowConfig {
    /**
     * метаданные ячейки
     */
    [rowProperty: string]: MetaData
}