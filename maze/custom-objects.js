function customPlane(x, z, w, h, c) {
    const ground = document.createElement('a-plane');
    ground.setAttribute('position', x + ' 0 ' + z);
    ground.setAttribute('rotation', '-90 0 0');
    ground.setAttribute('width', w);
    ground.setAttribute('height', h);
    ground.setAttribute('color', c);
    return ground;
}

function customCylinder(x, y, z, r, h, c) {
    const colon = document.createElement('a-cylinder');
    colon.setAttribute('position', x + ' ' + y + ' ' + z);
    colon.setAttribute('radius', r);
    colon.setAttribute('height', h);
    colon.setAttribute('color', c);
    return colon;
}

function customBox(x, y, z, w, h, d, c, m, r, o) {
    const box = document.createElement('a-box');
    box.setAttribute('position', x + ' ' + y + ' ' + z);
    box.setAttribute('width', w);
    box.setAttribute('height', h);
    box.setAttribute('depth', d);
    box.setAttribute('color', c);
    box.setAttribute('metalness', m);
    box.setAttribute('roughness', r);
    box.setAttribute('opacity', o);
    return box;
}

function cameraProbe(x, y, z) {
    const probe = document.createElement('a-entity');

    const rod = document.createElement('a-cylinder');
    rod.setAttribute('position', x + ' ' + y + ' ' + z);
    rod.setAttribute('radius', 0.025);
    rod.setAttribute('height', 0.5);
    rod.setAttribute('color', 'black');
    probe.appendChild(rod);

    const camera = document.createElement('a-cylinder');
    camera.setAttribute('position', x + ' ' + (y - 0.25) + ' ' + z);
    camera.setAttribute('rotation', '91 ' + Math.floor(Math.random() * 4) * 90 + ' 0');
    camera.setAttribute('radius', 0.1);
    camera.setAttribute('height', 0.5);
    camera.setAttribute('color', 'darkolivegreen');
    camera.setAttribute('alarm', '');
    probe.appendChild(camera);

    const lens = document.createElement('a-sphere');
    lens.setAttribute('position', '0 0.2 0');
    lens.setAttribute('scale', '0.1 0.1 0.1');
    lens.setAttribute('color', 'lime');
    camera.appendChild(lens);

    const spot = document.createElement('a-light');
    spot.setAttribute('type', 'spot');
    spot.setAttribute('position', '0 0.2 0');
    spot.setAttribute('rotation', '91 0 0');
    spot.setAttribute('color', 'lime');
    spot.setAttribute('penumbra', 0.9);
    spot.setAttribute('angle', 3);
    camera.appendChild(spot);

    return probe;
}

function storeRack(x, y, z, CELL, WALL) {
    const rack = document.createElement('a-entity');
    rack.appendChild(customBox(x, y * WALL + WALL / 4, z, CELL - 0.1, 0.03, CELL - 0.1, 'slategray', 0, 0, 1));
    rack.appendChild(customBox(x, y * WALL + WALL / 2, z, CELL - 0.1, 0.03, CELL - 0.1, 'slategray', 0, 0, 1));
    rack.appendChild(customCylinder(x - CELL / 2 + 0.3, y * WALL + WALL / 2 - 0.5, z - CELL / 2 + 0.3, 0.03, 3 * WALL / 4, 'darkslategray'));
    rack.appendChild(customCylinder(x + CELL / 2 - 0.3, y * WALL + WALL / 2 - 0.5, z - CELL / 2 + 0.3, 0.03, 3 * WALL / 4, 'darkslategray'));
    rack.appendChild(customCylinder(x - CELL / 2 + 0.3, y * WALL + WALL / 2 - 0.5, z + CELL / 2 - 0.3, 0.03, 3 * WALL / 4, 'darkslategray'));
    rack.appendChild(customCylinder(x + CELL / 2 - 0.3, y * WALL + WALL / 2 - 0.5, z + CELL / 2 - 0.3, 0.03, 3 * WALL / 4, 'darkslategray'));

    for (var X = 1; X <= 6; X++) {
        for (var Y = 0; Y < 3; Y++) {
            for (var Z = 1; Z <= 6; Z++) {
                if (Math.random() > 0.5) {
                    const H = (Math.random() + 1) * WALL / 8;
                    rack.appendChild(customBox(x - CELL / 2 + X * CELL / 8 + 0.25, y * WALL + Y * WALL / 4 + H / 2, z - CELL / 2 + Z * CELL / 8 + 0.25, CELL / 8, H, CELL / 8, 'tan', Math.random(), 1, 1));
                }
            }
        }
    }
    return rack;
}