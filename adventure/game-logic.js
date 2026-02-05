AFRAME.registerComponent('game-logic', {
    init: function () {
        this.cam = document.querySelector('a-camera');
        this.info = document.querySelector('#info');

        this.el.addEventListener('click', (evt) => {
            const target = evt.target;
            if (!target.parentNode.getAttribute('visible')) return;
            else {
                const drop = target.getAttribute('drop');
                const pick = target.getAttribute('pick');
                const over = target.getAttribute('over');

                if (drop) {
                    const i = ITEMS.indexOf(drop);
                    if (i >= 0) {
                        ITEMS.splice(i, 1);
                        if (pick) ITEMS.push(pick);

                        this.updateText(target.getAttribute('goal') || TEXT[this.scene - 1]);
                        if (over && over === 'goal') this.endGame();
                    }
                    else {
                        this.updateText(target.getAttribute('fail') || TEXT[this.scene - 1]);
                        if (over && over === 'fail') this.endGame();
                    }
                }
                else if (pick) {
                    target.remove();
                    ITEMS.push(pick);
                    this.updateText(TEXT[this.scene - 1]);
                }
            }
        });
        this.loadScene(1);
    },
    tick: function () {
        const pos = this.cam.getAttribute('position');
        const rot = this.cam.getAttribute('rotation');

        if (pos.x > 0.25) {
            if (this.xi < MAP[0].length - 1 && MAP[this.yi][this.xi + 1] > 0) this.loadScene(MAP[this.yi][this.xi + 1]);
            else this.cam.setAttribute('position', '0.25 1.5 ' + pos.z);
        }
        if (pos.x < -0.25) {
            if (this.xi > 0 && MAP[this.yi][this.xi - 1] > 0) this.loadScene(MAP[this.yi][this.xi - 1]);
            else this.cam.setAttribute('position', '-0.25 1.5 ' + pos.z);
        }
        if (pos.z < -0.25) {
            if (this.yi > 0 && MAP[this.yi - 1][this.xi] > 0) this.loadScene(MAP[this.yi - 1][this.xi]);
            else this.cam.setAttribute('position', pos.x + ' 1.5 -0.25');
        }
        if (pos.z > 0.25) {
            if (this.yi < MAP.length - 1 && MAP[this.yi + 1][this.xi] > 0) this.loadScene(MAP[this.yi + 1][this.xi]);
            else this.cam.setAttribute('position', pos.x + ' 1.5 0.25');
        }
        let checkE = false, checkW = false, checkN = false, checkS = false;

        const E = this.xi < MAP[0].length - 1 && MAP[this.yi][this.xi + 1] > 0;
        const W = this.xi > 0 && MAP[this.yi][this.xi - 1] > 0;
        const N = this.yi > 0 && MAP[this.yi - 1][this.xi] > 0;
        const S = this.yi < MAP.length - 1 && MAP[this.yi + 1][this.xi] > 0;

        if (Math.abs(rot.y) % 360 < 15 || Math.abs(rot.y) % 360 > 345) { checkE = E; checkW = W; checkN = N; checkS = S; }
        if (Math.abs(rot.y + 90) % 360 < 15 || Math.abs(rot.y + 90) % 360 > 345) { checkN = E; checkS = W; checkW = N; checkE = S; }
        if (Math.abs(rot.y - 90) % 360 < 15 || Math.abs(rot.y - 90) % 360 > 345) { checkS = E; checkN = W; checkE = N; checkW = S; }
        if (Math.abs(rot.y + 180) % 360 < 15 || Math.abs(rot.y + 180) % 360 > 345) { checkW = E; checkE = W; checkS = N; checkN = S; }

        document.querySelector('#east').setAttribute('visible', checkE);
        document.querySelector('#west').setAttribute('visible', checkW);
        document.querySelector('#north').setAttribute('visible', checkN);
        document.querySelector('#south').setAttribute('visible', checkS);
    },
    updateCoords: function () {
        for (var i = 0; i < MAP.length; i++) {
            for (var j = 0; j < MAP[i].length; j++) {
                if (this.scene === MAP[i][j]) {
                    this.yi = i;
                    this.xi = j;
                }
            }
        }
    },
    loadScene: function (s) {
        this.scene = s;
        this.cam.setAttribute('position', '0 1.5 0');
        this.updateText(TEXT[s - 1]);
        this.updateCoords();

        document.querySelectorAll('.scene').forEach(el => el.setAttribute('visible', false));
        document.querySelector('#scene' + s).setAttribute('animation', 'property: visible; to: true; dur: 500');
        setTimeout(() => { document.querySelector('#scene' + s).removeAttribute('animation'); }, 1000);

        document.querySelector('#sky').setAttribute('src', '#sky' + s);
        document.querySelector('#sky').setAttribute('opacity', '0');
        document.querySelector('#sky').setAttribute('animation', 'property: opacity; to: 1; dur: 500');
        setTimeout(() => { document.querySelector('#sky').removeAttribute('animation'); }, 1000);
    },
    updateText: function (t) {
        const inventory = "\n\nYou are carrying " + (ITEMS.length > 0 ? ITEMS.join(' and ') : "nothing");
        this.info.setAttribute('value', t + inventory + '.');
    },
    endGame: function () {
        const text = this.info.getAttribute('value').split('\n\n');
        this.info.setAttribute('value', text[0] + '\n\nTHE END');
        document.querySelector('a-scene').pause();
    }
});