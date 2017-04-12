var grid = new GridControl(document.getElementById('grid'), 'a a c _|b b c _');

for (var key in grid.cards) {
    grid.cards[key].element.addEventListener('dragover', function (event) {
         event.preventDefault();
    });

    grid.cards[key].element.addEventListener('drop', function (event) {
         event.preventDefault();
         var thisCard = grid.cards[this.getAttribute('data-grid-area')]
         var otherCard = grid.cards[event.dataTransfer.getData('text')]
         thisCard.switchWith(otherCard);
    });
}

var dragBtns = document.getElementsByClassName('dragbtn');
for (var i=0; i<dragBtns.length; i++) {
    dragBtns[i].addEventListener('dragstart', function (event) {
        event.dataTransfer.setData("Text", event.target.parentElement.getAttribute('data-grid-area'));
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
        var card = grid.cards[this.parentNode.getAttribute('data-grid-area')]
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

                dropzone.style.gridArea = '_' + i + '_' + j;
                dropzone.setAttribute('data-grid-area', '_' + i + '_' + j);

                dropzone.addEventListener('dragover', function (event) {
                     event.preventDefault();
                });

                dropzone.addEventListener('drop', function (event) {
                     event.preventDefault();
                     var pos = this.getAttribute('data-grid-area').substring(1).split('_');
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