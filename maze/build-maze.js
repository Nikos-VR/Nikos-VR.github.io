function buildMaze(MAP, CELL, WALL, container) {
    let L = MAP.length, D = MAP[0].length, W = MAP[0][0].length, startPos;

    container.appendChild(customPlane(W * CELL / 2, D * CELL / 2, (W + 3) * CELL, (D + 3) * CELL, 'darkolivegreen'));
    container.appendChild(customBox(W * CELL / 2, L * WALL / 2, 0, W * CELL, (L - 2) * WALL, 0.25, 'white', 1, 0, 0.66));
    container.appendChild(customBox(W * CELL / 2, L * WALL / 2, D * CELL, W * CELL, (L - 2) * WALL, 0.25, 'white', 1, 0, 0.66));
    container.appendChild(customBox(0, L * WALL / 2, D * CELL / 2, 0.25, (L - 2) * WALL, D * CELL, 'white', 1, 0, 0.66));
    container.appendChild(customBox(W * CELL, L * WALL / 2, D * CELL / 2, 0.25, (L - 2) * WALL, D * CELL, 'white', 1, 0, 0.66));

    for (let y = 0; y < L; y++) {
        for (let z = 0; z < D; z++) {
            for (let x = 0; x < W; x++) {
                const posX = (x * CELL) + (CELL / 2);
                const posZ = (z * CELL) + (CELL / 2);

                let type = MAP[y][z][x];
                if (type !== 5) container.appendChild(customBox(posX, y * WALL, posZ, CELL, 0.25, CELL, 'white', Math.random() / 10, 1, 1));
                if (type === -1) startPos = posX + ' ' + (y * WALL + 1.5) + ' ' + posZ;
                if (type === 1) {
                    if (y > 0 && y < L - 1) container.appendChild(storeRack(posX, y, posZ, CELL, WALL));
                    else {
                        const H = WALL / 2 * (Math.random() + 1);
                        container.appendChild(customBox(posX, y * WALL + H / 2, posZ, CELL - Math.random() / 2 - 0.1, H, CELL - Math.random() / 2 - 0.1, 'tan', Math.random(), 1, 1));
                    }
                }
                if (type === 2) container.appendChild(customCylinder(posX, y * WALL + WALL / 2, posZ, CELL / 3, WALL, 'indianred'));
                if (type === 3) container.appendChild(cameraProbe(posX, y * WALL + WALL - 0.5, posZ));
            }
        }
    }
    return startPos;
}