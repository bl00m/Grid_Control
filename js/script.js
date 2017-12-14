var rules = {
    'areas': ['a', 'b', 'c', 'd'],
    'templateArea': '_ a c _ _ _ _ _ _|_ a c _ _ _ _ _ _|b _ c _ _ _ _ _ _|b _ c _ _ d _ _ _',
    'templateRows': 'repeat(4, 1fr)',
    'templateColumns': 'repeat(9, 1fr)'
}

var grid = new GridControl(
    document.getElementById('grid'),
    rules
);

for (var key in grid.cards) {
    grid.cards[key].element.addEventListener('dragover', function (event) {
         event.preventDefault();
    });

    grid.cards[key].element.addEventListener('drop', function (event) {
         event.preventDefault();
         var thisCard = grid.cards[this.style.gridArea[this.style.gridArea.length-1]]
         var otherCard = grid.cards[event.dataTransfer.getData('text')]
         thisCard.switchWith(otherCard);
    });
}

var dragBtns = document.getElementsByClassName('dragbtn');
for (var i=0; i<dragBtns.length; i++) {
    dragBtns[i].addEventListener('dragstart', function (event) {
        let gridArea = event.target.parentElement.style.gridArea;
        event.dataTransfer.setData("text", gridArea[gridArea.length-1]);
        setupDropZones();
    });
    dragBtns[i].addEventListener('dragend', function () {
        removeDropZones();
    });
}

var resizeBtns = document.getElementsByClassName('resizebtn');
for (var i=0; i<resizeBtns.length; i++) {
    resizeBtns[i].addEventListener('mousedown', function (event) {
        event.preventDefault();
        let gridArea = this.parentNode.style.gridArea;
        var card = grid.cards[gridArea[gridArea.length-1]]
        var cellWidth = card.element.offsetWidth/card.position.width;
        var cellHeight = card.element.offsetHeight/card.position.height;
        var initialX = event.pageX;
        var initialY = event.pageY;

        document.onmousemove = function (event) {
            document.body.style.cursor = "nw-resize";
            if (event.pageX > initialX + cellWidth/2) {
                if (card.spanRight()) initialX += cellWidth;

            } else if (event.pageX < initialX - cellWidth/2) {
                if (card.unSpanRight()) initialX -= cellWidth;
            }

            if (event.pageY > initialY + cellHeight/2) {
                if (card.spanBottom()) initialY += cellHeight;

            } else if (event.pageY < initialY - cellHeight/2) {
                if (card.unSpanBottom()) initialY -= cellHeight;
            }
        }

        document.onmouseup = function () {
            document.body.style.cursor = "auto";
            document.onmousemove = null;
            document.onmouseup = null;
        }
    });
}

function setupDropZones() {
    var cpt = 0;
    for (var i=0; i<grid.template.length; i++) {
        for (var j=0; j<grid.template[i].length; j++) {

            if (grid.template[i][j] == '_') {
                var dropzone = document.createElement('div');
                dropzone.className = "dropzone";

                dropzone.id = i + '-' + j;

                dropzone.addEventListener('dragover', function (event) {
                    event.preventDefault();
                });

                dropzone.addEventListener('drop', function (event) {
                    event.preventDefault();
                    var pos = this.id.split('-');
                    var card = grid.cards[event.dataTransfer.getData('text')];
                    card.moveToEmptyCell(parseInt(pos[0]), parseInt(pos[1]));
                });

                grid.element.appendChild(dropzone);
            }
        }
    }
}

function removeDropZones() {
    var dropzones = document.getElementsByClassName('dropzone');

    while (dropzones.length > 0) {
        grid.element.removeChild(dropzones[0]);
    }
}
