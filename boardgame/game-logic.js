AFRAME.registerComponent('game-logic', {
    init: function () {
        this.statusText = document.querySelector('#status');
        this.statusText.setAttribute('value', GAME.teamNames[GAME.teamTurn] + '' + GAME.statusText[0]);

        this.barL = document.querySelector('#pLeft');
        this.barR = document.querySelector('#pRight');
        this.barI = document.querySelector('#pIndex');
        this.barL.setAttribute('color', GAME.unitsColors[0]);
        this.barR.setAttribute('color', GAME.unitsColors[1]);

        this.cells = createBoard(document.querySelector('#board'));
        createUnits(document.querySelector('#units'));

        this.el.sceneEl.addEventListener('click', (evt) => {
            const el = evt.detail.intersectedEl;
            if (!el) return;

            if (el.classList.contains('unit')) {
                if (el.dataset.team !== GAME.teamNames[GAME.teamTurn]) {
                    this.statusText.setAttribute('value', GAME.statusText[1]); return;
                }
                this.selectUnit(el);
            }
            else if (el.classList.contains('cell') && GAME.selectedUnit) {
                const id = el.dataset.id;

                if (GAME.validMoves.includes(id)) this.executeAction(el);
                else this.statusText.setAttribute('value', GAME.statusText[2]);
            }
        });
    },

    selectUnit: function (unit) {
        if (GAME.selectedUnit) GAME.selectedUnit.setAttribute('material', 'emissive: #000');
        GAME.selectedUnit = unit;
        unit.setAttribute('material', 'emissive: #555');

        this.statusText.setAttribute('value', UNITS[unit.dataset.type].name + '' + GAME.statusText[3]);
        this.clearHighlights();
        this.highlightMoves(unit);
    },

    highlightMoves: function (unit) {
        GAME.validMoves = [];

        const ux = parseInt(unit.dataset.x);
        const uz = parseInt(unit.dataset.z);
        const range = UNITS[unit.dataset.type].range;

        for (let z = 0; z < BOARD.length; z++) {
            for (let x = 0; x < BOARD[0].length; x++) {
                const dist = Math.max(Math.abs(x - ux), Math.abs(z - uz));

                if (dist > 0 && dist <= range) {
                    const targetId = x + '-' + z;
                    const cell = this.cells[targetId];
                    const enemy = this.getUnitAt(x, z);

                    if (enemy && enemy.dataset.team === unit.dataset.team) continue;

                    GAME.validMoves.push(targetId);

                    if (enemy) cell.setAttribute('material', 'color: ' + GAME.boardColors[3]);
                    else cell.setAttribute('material', 'color: ' + GAME.boardColors[3] + '; opacity: 0.25');
                }
            }
        }
    },

    executeAction: function (cell) {
        const tx = parseInt(cell.dataset.x);
        const tz = parseInt(cell.dataset.z);
        const enemy = this.getUnitAt(tx, tz);
        const pos = cell.getAttribute('position');

        if (enemy) {
            GAME.combatData = {
                attacker: GAME.selectedUnit,
                defender: enemy,
                targetPos: pos,
                tx: tx, tz: tz
            };
            this.startCombat();
        }
        else this.moveUnit(GAME.selectedUnit, pos.x, pos.z, tx, tz);

        this.clearHighlights();
    },

    moveUnit: function (unit, posx, posz, x, z) {
        unit.setAttribute('animation', 'property: position; dur: ' + GAME.moveTimes[0] + '; to: ' + posx + ' ' + GAME.unitsScale.split(' ')[1] / 2 + ' ' + posz);
        unit.dataset.x = x;
        unit.dataset.z = z;

        setTimeout(() => this.endTurn(), GAME.moveTimes[0]);
    },

    endTurn: function () {
        if (GAME.selectedUnit) GAME.selectedUnit.setAttribute('material', 'emissive: #000');
        GAME.selectedUnit = null;

        this.clearHighlights();

        GAME.teamTurn = (GAME.teamTurn === 0) ? 1 : 0;
        this.statusText.setAttribute('value', GAME.statusText[4] + '' + GAME.teamNames[GAME.teamTurn]);
    },

    clearHighlights: function () {
        for (let id in this.cells) {
            const cell = this.cells[id];

            cell.setAttribute('material', 'color: ' + cell.dataset.baseColor + '; opacity: 1');
        }
    },

    getUnitAt: function (x, z) {
        const units = document.querySelectorAll('.unit');

        for (let u of units) {
            if (parseInt(u.dataset.x) === x && parseInt(u.dataset.z) === z) return u;
        }
        return null;
    },

    startCombat: function () {
        const data = GAME.combatData;
        const A = UNITS[data.attacker.dataset.type];
        const D = UNITS[data.defender.dataset.type];
        const result = Math.random();

        let leftAttacks = true;
        let powerL = GAME.attackForce * A.power / (GAME.attackForce * A.power + D.power);
        let powerD = D.power / (GAME.attackForce * A.power + D.power);

        this.statusText.setAttribute('value', A.name + '' + GAME.statusText[5] + '' + D.name);

        if (data.attacker.dataset.team === GAME.teamNames[1]) {
            this.statusText.setAttribute('value', D.name + '' + GAME.statusText[5] + '' + A.name);

            powerD = GAME.attackForce * A.power / (GAME.attackForce * A.power + D.power);
            powerL = D.power / (GAME.attackForce * A.power + D.power);
            leftAttacks = false;
        }
        const posI = this.barI.getAttribute('position');

        this.barL.setAttribute('height', powerL);
        this.barL.setAttribute('position', powerL / 2 - 0.5 + ' ' + posI.y + ' ' + posI.z);
        this.barR.setAttribute('height', powerD);
        this.barR.setAttribute('position', 0.5 - powerD / 2 + ' ' + posI.y + ' ' + posI.z);
        this.barI.setAttribute('animation', 'property: position; to:' + (result - 0.49) + ' ' + posI.y + ' ' + posI.z);

        if (leftAttacks && result <= powerL || !leftAttacks && result > powerL) {
            setTimeout(() => this.statusText.setAttribute('value', data.attacker.dataset.team + ' ' + A.name + '' + GAME.statusText[6]), GAME.moveTimes[1] - GAME.moveTimes[0]);
            setTimeout(() => data.defender.parentNode.removeChild(data.defender), GAME.moveTimes[1] + GAME.moveTimes[0]);
        } else {
            setTimeout(() => this.statusText.setAttribute('value', data.defender.dataset.team + ' ' + D.name + '' + GAME.statusText[6]), GAME.moveTimes[1] - GAME.moveTimes[0]);
            setTimeout(() => data.attacker.parentNode.removeChild(data.attacker), GAME.moveTimes[1] + GAME.moveTimes[0]);
        }
        setTimeout(() => this.moveUnit(data.attacker, data.targetPos.x, data.targetPos.z, data.tx, data.tz), GAME.moveTimes[1]);
    }
});