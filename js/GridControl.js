class GridControl {
    constructor(element, templateStr) {
        this.element = element;

        this.template = [];
        var templateStrLines = templateStr.split('|');
        for (var i=0; i<templateStrLines.length; i++) {
            var templateLines = [];

            var areas = templateStrLines[i].split(' ');
            for (var j=0; j<areas.length; j++) {
                templateLines.push(areas[j]);
            }

            this.template.push(templateLines);
        }

        this.cards = {};
        var childIndex = 0;
        for (var i=0; i<this.template.length; i++) {
            for (var j=0; j<this.template[0].length; j++) {
                if (this.template[i][j] != '_' && !(this.template[i][j] in this.cards)) {
                    this.cards[this.template[i][j]] = new CardControl(this.element.children[childIndex++], this, this.template[i][j]);
                }
            }
        }

        this.element.style.display = 'grid';
        this.element.style.gridTemplateRows = 'repeat(' + this.template.length + ', 1fr)';
        this.element.style.gridTemplateColumns = 'repeat(' + this.template[0].length + ', 1fr)';

        this.applyTemplate();
    }

    applyTemplate() {
        var res = '';

        for (var i=0; i<this.template.length; i++) {
            var line = '';

            for (var j=0; j<this.template[i].length; j++) {
                line += this.template[i][j]

                if (this.template[i][j] == '_') line += i + '_' + j;

                if (j < this.template[i].length-1) line += ' ';
            }

            res += '"' + line + '"';

            if (i < this.template.length-1) res += ' ';
        }

        this.element.style.gridTemplateAreas = res;
    }

    getAreaPosition(area) {
        var pos = null;

        var i=0;
        var found = false;
        while (i<this.template.length && !found) {

            var j=0;
            while (j<this.template[i].length && !found) {
                if (this.template[i][j] == area) {
                    found = true;
                    pos = {row: i, col: j, height: 0, width: 0};
                }
                j++;
            }
            i++;
        }

        if (found) {
            var i = 1;
            while (pos.col+i<this.template[0].length && this.template[pos.row][pos.col+i] == area) {
                i++;
            }
            pos.width = i;

            var i = 1;
            while (pos.row+i<this.template.length && this.template[pos.row+i][pos.col] == area) {
                i++;
            }
            pos.height = i;
        }

        return pos;
    }
}

class CardControl {
    constructor(element, grid, gridArea) {
        this.element = element;
        this.grid = grid;
        this.templateArea = gridArea;
        this.position = this.grid.getAreaPosition(this.templateArea);

        this.element.setAttribute('data-grid-area', this.templateArea);
        this.element.style.gridArea = this.templateArea;
        this.grid.cards[this.templateArea] = this;
    }

    spanRight() {
        if (this.position.col + this.position.width-1 == this.grid.template.length[0]-1) return false;

        for (var i = this.position.row; i < this.position.row + this.position.height; i++) {
            if (this.grid.template[i][this.position.col+this.position.width] != '_') {
                return false;
            }
        }

        for (var i = this.position.row; i < this.position.row + this.position.height; i++) {
            this.grid.template[i][this.position.col+this.position.width] = this.templateArea;
        }

        this.position.width++;
        this.grid.applyTemplate();
        return true;
    }

    spanBottom() {
        if (this.position.row + this.position.height-1 == grid.length-1) return false;

        for (var i = this.position.col; i < this.position.col + this.position.width; i++) {
            if (this.grid.template[this.position.row + this.position.height][i] != '_') return false;
        }

        for (var i = this.position.col; i < this.position.col + this.position.width; i++) {
            this.grid.template[this.position.row + this.position.height][i] = this.templateArea;
        }

        this.position.height++;
        this.grid.applyTemplate();
        return true;
    }

    unSpanRight() {
        if (this.position.width == 1) return false;

        for (var i = this.position.row; i < this.position.row + this.position.height; i++) {
            this.grid.template[i][this.position.col+this.position.width-1] = '_';
        }

        this.position.width--;
        this.grid.applyTemplate();
        return true;
    }

    unSpanBottom() {
        if (this.position.height == 1) return false;

        for (var i = this.position.col; i < this.position.col + this.position.width; i++) {
            this.grid.template[this.position.row + this.position.height-1][i] = '_';
        }

        this.position.height--;
        this.grid.applyTemplate();
        return true;
    }

    switchWith(otherCard) {
        for (var i=this.position.row; i < this.position.row + this.position.height; i++) {
            for (var j=this.position.col; j < this.position.col + this.position.width; j++) {
                this.grid.template[i][j] = otherCard.templateArea;
            }
        }

        for (var i=otherCard.position.row; i < otherCard.position.row + otherCard.position.height; i++) {
            for (var j=otherCard.position.col; j < otherCard.position.col + otherCard.position.width; j++) {
                this.grid.template[i][j] = this.templateArea;
            }
        }

        var position = this.position;
        this.position = otherCard.position;
        otherCard.position = position;

        this.grid.applyTemplate();
    }

    moveToEmptyCell(row, col) {
        this.grid.template[row][col] = this.templateArea;

        for (var i=this.position.row; i < this.position.row + this.position.height; i++) {
            for (var j=this.position.col; j < this.position.col + this.position.width; j++) {
                this.grid.template[i][j] = '_';
            }
        }

        this.position = {row: row, col: col, height: 1, width: 1};
        this.grid.applyTemplate();
    }
}
