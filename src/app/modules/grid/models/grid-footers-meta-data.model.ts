
import { BehaviorSubject } from 'node_modules/rxjs';
import { FooterRow } from './footer-row.model';
import { GridMetaData } from './grid-meta-data.model';

/**
 * метаданные футеров грида
 *
 * @export
 * @class GridFooterMetaData
 */
export class GridFootersMetaData {
    private techCellName = 'tech';
    $footerRows: BehaviorSubject<FooterRow[]>;
    $displayedFooters: BehaviorSubject<string[]>;

    constructor(footers: FooterRow[], gridMetaData: GridMetaData) {
        this.callucateFooterColspan(footers, gridMetaData);
        this.createTechnicalCell(footers, gridMetaData);
        this.$footerRows = new BehaviorSubject<FooterRow[]>(footers);
        this.$displayedFooters = new BehaviorSubject(this.getDisplayedFooters(footers));
    }

    private callucateFooterColspan(footers: FooterRow[], gridMetaData: GridMetaData) {
        footers.forEach(footer => {
            if (footer.systemname !== this.techCellName) {
                const colspan = (() => {
                    const stickyColumnsCount = gridMetaData.getStickyColumnsCount()
                    const stickyEndColumnsCount = gridMetaData.getStickyEndColumnsCount();
                    const noStickyColumnsCount = gridMetaData.getNotStickyColumnsCount();
                    if (stickyEndColumnsCount === 0) {
                        if (stickyColumnsCount === 0) {
                            return noStickyColumnsCount/2;
                        }
                        return noStickyColumnsCount;
                    }else{
                        return stickyColumnsCount + noStickyColumnsCount;
                    }
                })();
                footer.$colspan.next(colspan);
            }
        });
    }

    private getDisplayedFooters(footers: FooterRow[]) {
        if (!footers) { return []; }
        return footers.map(x => x.systemname);
    }

    /**
     *Техническая TD в футере необходима для поддержки длины строки соответсвубщего размера
     *
     * @private
     * @param {FooterRow[]} footers
     * @param {GridMetaData} gridMetaData
     * @memberof GridFootersMetaData
     */
    private createTechnicalCell(footers: FooterRow[], gridMetaData: GridMetaData) {
        if (!footers || !gridMetaData) { return; }
        const technicalFooter = footers.find(x => x.systemname === this.techCellName);
        const colspan = (() => {
            const stickyColumnsCount = gridMetaData.getStickyColumnsCount()
            if (stickyColumnsCount === 0) {
                const stickyEndColumnsCount = gridMetaData.getStickyEndColumnsCount();
                if (stickyEndColumnsCount === 0) {
                    return gridMetaData.getNotStickyColumnsCount()/2;
                }
                return stickyEndColumnsCount;
            }
            return stickyColumnsCount;
        })();
        if (technicalFooter) {
            this.updateTechnicalFooterColspan(technicalFooter, footers, colspan);
        } else {
            this.createTechnicalFooter(footers, colspan);
        }
    }

    private updateTechnicalFooterColspan(technicalFooter: FooterRow, footers: FooterRow[], colspan: number) {
        if (!technicalFooter || !footers) { return; }
        if (colspan === 0) {
            const technicalFooterIndex = footers.indexOf(technicalFooter);
            footers.splice(technicalFooterIndex, 1);
        } else {
            technicalFooter.$colspan.next(colspan);
        }
    }

    private createTechnicalFooter(footers: FooterRow[], colspan: number) {
        if (!footers || !colspan) { return; }
        footers.push(new FooterRow(this.techCellName, '', colspan));
    }
}
