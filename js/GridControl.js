class GridControl {
    constructor(element, rules) {
        this.element = element;
        this.initialRules = rules;

        this.template = [];
        var templateStrLines = rules.templateArea.split('|');
        for (var i=0; i<templateStrLines.length; i++) {
            var templateLines = [];

            var areas = templateStrLines[i].split(' ');
            for (var j=0; j<areas.length; j++) {
                templateLines.push(areas[j]);
            }

            this.template.push(templateLines);
        }

        this.cards = {};
        for (var i=0; i<this.element.children.length; i++) {
            this.cards[rules.areas[i]] = new CardControl(this.element.children[i], this, rules.areas[i]);
        }

        this.element.style.display = 'grid';
        this.element.style.gridTemplateRows = rules.templateRows;
        this.element.style.gridTemplateColumns = rules.templateColumns;

        this.applyTemplate();
    }

    get rules() {
        var rules = this.initialRules;

        var templateArea = '';
        for (var i=0; i<this.template.length; i++) {
            for(var j=0; j<this.template[0].length; j++) {
                templateArea += this.template[i][j];
                if (j < this.template[0].length-1) templateArea += ' ';
            }
            if (i < this.template.length-1) templateArea += '|';
        }

        rules.templateArea = templateArea;
        return rules;
    }

    applyTemplate() {
        var res = '';

        for (var i=0; i<this.template.length; i++) {
            var line = '';

            for (var j=0; j<this.template[i].length; j++) {
                line += this.template[i][j];

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
    constructor(element, grid, area) {
        this.element = element;
        this.grid = grid;
        this.element.style.gridArea = area;
        this.position = this.grid.getAreaPosition(this.area);
    }

    get area() {
        return this.element.style.gridArea.split(' / ')[0];
    }

    spanRight() {
        if (this.position.col + this.position.width-1 == this.grid.template.length[0]-1) return false;

        for (var i = this.position.row; i < this.position.row + this.position.height; i++) {
            if (this.grid.template[i][this.position.col+this.position.width] != '_') {
                return false;
            }
        }

        for (var i = this.position.row; i < this.position.row + this.position.height; i++) {
            this.grid.template[i][this.position.col+this.position.width] = this.area;
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
            this.grid.template[this.position.row + this.position.height][i] = this.area;
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
                this.grid.template[i][j] = otherCard.area;
            }
        }

        for (var i=otherCard.position.row; i < otherCard.position.row + otherCard.position.height; i++) {
            for (var j=otherCard.position.col; j < otherCard.position.col + otherCard.position.width; j++) {
                this.grid.template[i][j] = this.area;
            }
        }

        var position = this.position;
        this.position = otherCard.position;
        otherCard.position = position;

        this.grid.applyTemplate();
    }

    moveToEmptyCell(row, col) {
        this.grid.template[row][col] = this.area;

        for (var i=this.position.row; i < this.position.row + this.position.height; i++) {
            for (var j=this.position.col; j < this.position.col + this.position.width; j++) {
                this.grid.template[i][j] = '_';
            }
        }

        this.position = {row: row, col: col, height: 1, width: 1};
        this.grid.applyTemplate();
    }
}
