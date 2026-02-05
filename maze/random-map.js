function randomMap(floorLevel, width, depth, camS) {
    let MAP = [];
    for (let y = 0; y <= floorLevel; y++) {
        let camX = [], camZ = [];
        for (var i = 0; i < camS; i++) camX.push(Math.ceil(Math.random() * width - 2));
        for (var j = 0; j < camS; j++) camZ.push(Math.ceil(Math.random() * depth - 2));

        let Z = [];
        for (let z = 0; z < depth; z++) {
            let X = [];

            for (let x = 0; x < width; x++) {
                if (y < floorLevel && (x === 0 && z === 0 || x === 0 && z === depth - 1 || x === width - 1 && z === 0 || x === width - 1 && z === depth - 1)) X.push(2);
                else if (y > 0 && y < floorLevel && camX.indexOf(x) >= 0 && camZ.indexOf(z) == camX.indexOf(x)) X.push(3);
                else if (camX.indexOf(x) >= 0 || camZ.indexOf(z) >= 0) X.push(0);
                else X.push(Math.round(Math.random()) ? -3 : 1);
            }
            Z.push(X);
        }
        MAP.push(Z);
    }
    for (let y = 0; y <= floorLevel; y++) {
        let check = true;
        while (check) {
            let cellX = Math.ceil(Math.random() * (width - 2));
            let cellZ = Math.ceil(Math.random() * (depth - 2));

            if (MAP[y][cellZ][cellX] === 0) {
                if (y === floorLevel) {
                    MAP[y][cellZ][cellX] = -1;
                    check = false;
                }
                else if (MAP[y + 1][cellZ][cellX] === 0) {
                    MAP[y + 1][cellZ][cellX] = 5;
                    check = false;
                }
            }
        }
    }
    return MAP;
}