import { CellValueType } from './cell-value-type.enum';

export const cellTemplates = (() => {
    const numberCellComponent = 'NumberCellComponent';
    const result = Object.create({});
    result[CellValueType.Int16] = numberCellComponent;
    result[CellValueType.UInt16] = numberCellComponent;
    result[CellValueType.Int32] = numberCellComponent;
    result[CellValueType.UInt32] = numberCellComponent;
    result[CellValueType.Int64] = numberCellComponent;
    result[CellValueType.UInt64] = numberCellComponent;
    result[CellValueType.Single] = numberCellComponent;
    result[CellValueType.Decimal] = numberCellComponent;
    result[CellValueType.Double] = numberCellComponent;

    result[CellValueType.String] = 'StringCellComponent';
    result[CellValueType.Boolean] = 'BooleanCellComponent';
    result[CellValueType.DateTime] = 'DateCellComponent';
    return result as { [type: string]: string };
})();
