let gameOver = false, coords;

AFRAME.registerComponent('alarm', {
    tick: function () {
        const rot = this.el.getAttribute('rotation');
        const step = Math.floor(Math.random() * 4) * 90;
        if (Math.random() < 0.01 && rot.y !== step) this.el.setAttribute('animation', 'property: rotation; to: 91 ' + step + ' 0');

        const pos = this.el.getAttribute('position');
        const posX = Math.floor(pos.x / GAME.cellSize[0]);
        const posZ = Math.floor(pos.z / GAME.cellSize[0]);

        const coord = coords.getAttribute('position');
        const coordX = Math.floor(coord.x / GAME.cellSize[0]);
        const coordZ = Math.floor(coord.z / GAME.cellSize[0]);

        if (pos.y > coord.y && pos.y - coord.y < GAME.cellSize[1] && (posX === coordX || posZ === coordZ)) {
            if (rot.y === 0 && coordX === posX && coordZ > posZ) gameOver = true;
            if (rot.y === 90 && coordX > posX && coordZ === posZ) gameOver = true;
            if (rot.y === 180 && coordX === posX && coordZ < posZ) gameOver = true;
            if (rot.y === 270 && coordX < posX && coordZ === posZ) gameOver = true;
        }
        if (gameOver) this.el.pause();
    }
});

AFRAME.registerComponent('game-logic', {
    init: function () {
        this.timeLeft = GAME.timeLeft * 50;
        this.floorLevel = MAP.length - 1;
        this.lastPos = buildMaze(MAP, GAME.cellSize[0], GAME.cellSize[1], document.querySelector('#maze'));

        coords = document.querySelector('a-camera');
        document.querySelector('a-scene').addEventListener('enter-vr', function () { coords = document.getElementById('rig'); });
        document.querySelector('a-scene').addEventListener('exit-vr', function () { coords = document.querySelector('a-camera'); });
        coords.setAttribute('position', this.lastPos);
    },
    tick: function () {
        if (gameOver || this.floorLevel === 0) this.endGame();
        else if (this.timeLeft-- === 0) gameOver = true;
        else if (this.timeLeft % 50 === 0) {
            let status = GAME.statusText[2] + '' + this.floorLevel;
            if (GAME.timeLeft > 0) status += ' - ' + GAME.statusText[3] + Math.round(this.timeLeft / 50);
            document.querySelector('#floor').setAttribute('value', status);
        }
        const pos = coords.getAttribute('position');
        const gridX = Math.floor(pos.x / GAME.cellSize[0]);
        const gridZ = Math.floor(pos.z / GAME.cellSize[0]);

        if (pos.x < 1 || pos.x > MAP[0][0].length * GAME.cellSize[0] - 1 || pos.z < 1 || pos.z > MAP[0].length * GAME.cellSize[0] - 1) coords.setAttribute('position', this.lastPos);
        else if (MAP[this.floorLevel][gridZ][gridX] === 1 || MAP[this.floorLevel][gridZ][gridX] === 2) coords.setAttribute('position', this.lastPos);
        else if (MAP[this.floorLevel][gridZ][gridX] === 5) {
            this.floorLevel--;
            this.lastPos = pos.x + ' ' + (pos.y - GAME.cellSize[1]) + ' ' + pos.z;
            document.querySelector('#fall').setAttribute('position', this.lastPos);
            document.querySelector('#fall').components.sound.playSound();
            coords.setAttribute('animation', 'property: position; to: ' + this.lastPos + '; dur: 250');
        }
        else this.lastPos = Math.round(pos.x) + ' ' + (this.floorLevel * GAME.cellSize[1] + 1.5) + ' ' + Math.round(pos.z);
    },
    endGame: function () {
        document.querySelector('#message').setAttribute('value', gameOver ? GAME.statusText[0] : GAME.statusText[1]);
        document.querySelector('#message').setAttribute('color', gameOver ? GAME.textColors[0] : GAME.textColors[1]);
        coords.removeAttribute('wasd-controls');
    }
});