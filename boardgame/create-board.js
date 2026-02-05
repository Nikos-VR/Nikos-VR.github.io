function createBoard(container) {
    let cells = {};
    let unitSize = GAME.unitsScale.split(' ');
    let boardSize = GAME.boardScale.split(' ');

    for (let z = 0; z < BOARD.length; z++) {
        let colorToggle = z % 2 === 0;

        for (let x = 0; x < BOARD[0].length; x++) {
            const id = x + '-' + z;
            const cell = document.createElement('a-entity');
            const grid1 = document.createElement('a-box');
            const grid2 = document.createElement('a-box');
            let col = colorToggle ? 0 : 1;

            cell.setAttribute('geometry', 'primitive: box; width: ' + (boardSize[0] - 0.1) + '; height: ' + boardSize[1] + '; depth: ' + (boardSize[2] - 0.1));
            cell.setAttribute('material', 'color: ' + GAME.boardColors[col]);
            cell.setAttribute('position', boardSize[0] * (x - BOARD[0].length / 2 + 0.5) + ' -' + boardSize[1] / 2 + ' ' + boardSize[2] * (z - BOARD.length / 2 + 0.5));

            cell.classList.add('cell');
            cell.classList.add('interactive');

            cell.dataset.x = x;
            cell.dataset.z = z;
            cell.dataset.id = id;
            cell.dataset.baseColor = GAME.boardColors[col];

            grid1.setAttribute('position', boardSize[0] * (x - BOARD[0].length / 2) + ' -' + boardSize[1] / 2 + ' ' + boardSize[2] * (z - BOARD.length / 2 + 0.5));
            grid1.setAttribute('scale', '0.1 ' + boardSize[1] + ' ' + (boardSize[2] - 0.1));
            grid1.setAttribute('color', GAME.boardColors[2]);
            grid2.setAttribute('position', boardSize[0] * (x - BOARD[0].length / 2 + 0.5) + ' -' + boardSize[1] / 2 + ' ' + boardSize[2] * (z - BOARD.length / 2));
            grid2.setAttribute('scale', (boardSize[0] - 0.1) + ' ' + boardSize[1] + ' 0.1');
            grid2.setAttribute('color', GAME.boardColors[2]);

            container.appendChild(cell);
            if (x > 0) container.appendChild(grid1);
            if (z > 0) container.appendChild(grid2);

            cells[id] = cell;
            colorToggle = !colorToggle;
        }
    }
    return cells;
}

function createUnits(container) {
    let unitSize = GAME.unitsScale.split(' ');
    let boardSize = GAME.boardScale.split(' ');

    for (let z = 0; z < BOARD.length; z++) {
        for (let x = 0; x < BOARD[0].length; x++) {
            const type = BOARD[z][x];
            if (type === 0) continue;

            const stats = UNITS[type];
            const unit = document.createElement('a-entity');
            const left = (x <= BOARD[0].length / 2) ? 0 : 1;

            if (stats.model === '') {
                unit.setAttribute('geometry', 'primitive: ' + stats.shape);
                unit.setAttribute('material', 'color: ' + GAME.unitsColors[left] + '; metalness: ' + 0.1 * type);
            }
            else unit.setAttribute('gltf-model', stats.model);

            unit.setAttribute('scale', GAME.unitsScale);
            unit.setAttribute('position', boardSize[0] * (x - BOARD[0].length / 2 + 0.5) + ' ' + unitSize[1] / 2 + ' ' + boardSize[2] * (z - BOARD.length / 2 + 0.5));

            unit.classList.add('unit');
            unit.classList.add('interactive');

            unit.dataset.team = GAME.teamNames[left];
            unit.dataset.type = type;
            unit.dataset.x = x;
            unit.dataset.z = z;

            container.appendChild(unit);
        }
    }
}