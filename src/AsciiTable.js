class AsciiTable {

    /**
     * @type {[]}
     */
    rows = [];

    /**
     * @type {[]}
     */
    colLengths = [];

    /**
     * Table Styles
     * @type {{compact: {hasTopLine: boolean, cMM: string, hasBottomLine: boolean, cML: string, spV: string, cMR: string, spH: string, hasHeaderSeparators: boolean, hdV: string, hdH: string, hasLineSeparators: boolean}, unicode: {cTR: string, hasTopLine: boolean, cMM: string, cML: string, cMR: string, spH: string, cBL: string, hdH: string, cBM: string, cBR: string, hasBottomLine: boolean, spV: string, cTL: string, hasHeaderSeparators: boolean, hdV: string, cTM: string, hasLineSeparators: boolean}, mysql: {cTR: string, hasTopLine: boolean, cMM: string, cML: string, cMR: string, spH: string, cBL: string, hdH: string, cBM: string, cBR: string, hasBottomLine: boolean, spV: string, cTL: string, hasHeaderSeparators: boolean, hdV: string, cTM: string, hasLineSeparators: boolean}}}
     */
    styles = {
        mysql: {
            cTL: "+",
            cTM: "+",
            cTR: "+",
            cML: "+",
            cMM: "+",
            cMR: "+",
            cBL: "+",
            cBM: "+",
            cBR: "+",
            hdV: "|",
            hdH: "-",
            spV: "|",
            spH: "-",
            hasTopLine: true,
            hasBottomLine: true,
            hasHeaderSeparators: true,
            hasLineSeparators: false
        },
        compact: {
            cML: " ",
            cMM: " ",
            cMR: " ",
            hdV: " ",
            hdH: "-",
            spV: " ",
            spH: "-",
            hasTopLine: false,
            hasBottomLine: false,
            hasHeaderSeparators: true,
            hasLineSeparators: false
        },
        unicode: {
            cTL: "\u2554",
            cTM: "\u2566",
            cTR: "\u2557",
            cML: "\u2560",
            cMM: "\u256C",
            cMR: "\u2563",
            cBL: "\u255A",
            cBM: "\u2569",
            cBR: "\u255D",
            hdV: "\u2551",
            hdH: "\u2550",
            spV: "\u2551",
            spH: "\u2550",
            hasTopLine: true,
            hasBottomLine: true,
            hasHeaderSeparators: true,
            hasLineSeparators: false
        }
    }

    /**
     * @param input
     * @param colSeparator
     * @param rowSeparator
     * @param colPadding
     * @param hasHeaders
     */
    constructor(input, {
        colSeparator = '|',
        rowSeparator = '>',
        colPadding = 2,
        hasHeaders = true
    } = {}) {
        this.colSeparator = colSeparator;
        this.rowSeparator = rowSeparator;
        this.colPadding = colPadding;
        this.hasHeaders = hasHeaders;
        this.processTableData(input);
    }

    /**
     * @param input
     */
    processTableData(input) {
        const rows = input.split(this.rowSeparator);
        rows.forEach((row) => {
            const cols = this.processCols(row);
            cols.forEach((col, idx) => {
                if (typeof this.colLengths[idx] === 'undefined') {
                    this.colLengths[idx] = col.length;
                } else {
                    if (this.colLengths[idx] < col.length) {
                        this.colLengths[idx] = col.length;
                    }
                }
            });
            this.rows.push({
                cols: cols,
                length: cols.length
            });
        });
    }

    /**
     * @param row
     * @returns {*[]}
     */
    processCols(row) {
        const cols = row.split(this.colSeparator);
        const workingCols = [];
        cols.forEach((col) => {
            workingCols.push({
                value: col.trim(),
                length: col.length
            });
        });
        return workingCols;
    }

    /**
     * @param style
     * @returns {string}
     */
    format(style) {
        if (!this.styles.hasOwnProperty(style)) {
            console.log(`[ERROR] Style '${style}' is not available`);
            return;
        }
        let output = '';
        const format = this.styles[style]
        if (format.hasTopLine) {
            output += this.getSeparatorRow(format.cTL, format.cTM, format.cTR, format.hdH);
        }
        this.rows.forEach((row, ridx) => {
            if (this.hasHeaders && format.hasHeaderSeparators && ridx === 1) {
                output += this.getSeparatorRow(format.cML, format.cMM, format.cMR, format.hdH);
            } else if (format.hasLineSeparators && ridx < this.rows.length) {
                if ((!this.hasHeaders && ridx >= 1) || (this.hasHeaders && ridx > 1)) {
                    output += this.getSeparatorRow(format.cML, format.cMM, format.cMR, format.spH);
                }
            }
            // column data
            for (let i = 0; i < row.cols.length; i++) {
                const colSep = (this.hasHeaders && ridx === 0) ? format.hdV : format.spV;
                if (this.hasHeaders && ridx === 0) {
                    // center headings
                    const data = row.cols[i].value
                        .padStart(row.cols[i].value.length + Math.floor((this.colLengths[i] - row.cols[i].value.length) / 2), ' ')
                        .padEnd(this.colLengths[i]);
                    output += colSep + " ".repeat(this.colPadding) + data + " ".repeat(this.colPadding);
                } else {
                    // left align content
                    output += colSep + " ".repeat(this.colPadding) + row.cols[i].value.padEnd(this.colLengths[i], ' ') + " ".repeat(this.colPadding);
                }
                if (i === (row.cols.length - 1)) {
                    output += colSep + "\n";
                }
            }
        });

        if (format.hasBottomLine) {
            output += this.getSeparatorRow(format.cBL, format.cBM, format.cBR, format.spH)
        }

        return output;
    }

    /**
     * @param left
     * @param middle
     * @param right
     * @param horizontal
     * @returns {string}
     */
    getSeparatorRow(left, middle, right, horizontal) {
        let output = '';
        for (let i = 0; i <= this.colLengths.length; i++) {
            if (i === 0) {
                output += left + horizontal.repeat(this.colLengths[i] + (this.colPadding * 2));
            } else if (i < this.colLengths.length) {
                output += middle + horizontal.repeat(this.colLengths[i] + (this.colPadding * 2));
            } else {
                output += right + "\n";
            }
        }
        return output;
    }
}

module.exports = AsciiTable;