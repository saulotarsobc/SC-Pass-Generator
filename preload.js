const { ipcRenderer, clipboard } = require('electron');

// Add the event listener for the response from the main process
ipcRenderer.on('main-process-response', (event, arg) => {
    clipboard.writeText(arg);
});

window.addEventListener('DOMContentLoaded', () => {

    const pass = document.querySelector("#pass");
    const size = document.querySelector("#size");
    const more = document.querySelector("#more");
    const less = document.querySelector("#less");
    const upper = document.querySelector("#upper");
    const lower = document.querySelector("#lower");
    const number = document.querySelector("#number");
    const special = document.querySelector("#special");
    const gerar = document.querySelector("#gerar");
    const copiar = document.querySelector("#copiar");
    const safe_bar = document.querySelector("#safe_bar");

    const MORE_LIMIT = 24;
    const LESS_LIMIT = 8;
    const INTERVAL = 22;

    function playKeySound() {
        let key_sound = new Audio('./sounds/key_sound.wav');
        key_sound.play();
    }

    copiar.addEventListener('click', () => {
        playKeySound();
        ipcRenderer.send('request-main-process-action', pass.innerHTML);
        setTimeout(() => {
            alert("Senha copiada: " + (pass.innerHTML));
        }, 400);
    });

    gerar.addEventListener('click', () => {
        playKeySound();
        getPass();
    });

    more.addEventListener('click', () => {
        playKeySound();
        changeSize('more');
    });

    less.addEventListener('click', () => {
        playKeySound();
        changeSize('less');
    });

    document.addEventListener('keydown', (event) => {
        let key = event.code;
        if ((key != "F12") ||
            (key != "Tab")) {
            event.preventDefault();
            keyboardShortcut(event);
        }
    });

    function keyboardShortcut(event) {
        if (event.code == 'ArrowUp') {
            more.focus();
            more.click();
        }
        if (event.code == 'ArrowDown') {
            less.focus();
            less.click();
        }
        if (event.code == 'KeyM') {
            upper.focus();
            upper.click();
        }
        if (event.code == 'KeyI') {
            lower.focus();
            lower.click();
        }
        if (event.code == 'KeyN') {
            number.focus();
            number.click();
        }
        if (event.code == 'KeyE') {
            special.focus();
            special.click();
        }
        if (event.code == 'KeyG') {
            gerar.focus();
            gerar.click();
        }
        if (event.code == 'KeyC') {
            copiar.focus();
            copiar.click();
        }
    }

    function playKeySound() {
        let key_sound = new Audio('./sounds/key_sound.wav');
        key_sound.play();
    }

    function copyPass() {
        navigator.clipboard.writeText(pass.innerHTML);
        alert("Senha copiada: " + (pass.innerHTML));
    }

    function getUpper() {
        const upper = "ABCDEFGHIJCLMNOPQRSTUVXYZ";
        return upper[Math.floor(Math.random() * upper.length)];
    }

    function getLower() {
        const lower = "abcdefghijklmnopqrstuvxyz";
        return lower[Math.floor(Math.random() * lower.length)];
    }

    function getNumber() {
        const number = "1234567890";
        return number[Math.floor(Math.random() * number.length)];
    }

    function getSpecial() {
        const special = "!@#$%<>&*()_+{}[]";
        return special[Math.floor(Math.random() * special.length)];
    }

    function updateSize(val) {
        size.value = val;
    }

    function cleanPass() {
        pass.innerHTML = '';
    }

    function changeSize(action) {
        const currentSize = parseInt(size.value);
        if (action == "more") {
            if (currentSize < MORE_LIMIT) {
                updateSize(currentSize + 1);
            }
        }
        else {
            if (currentSize > LESS_LIMIT) {
                updateSize(currentSize - 1);
            }
        }
    }

    function isChecked() {
        if (upper.checked ||
            lower.checked ||
            number.checked ||
            special.checked) {
            return true;
        }
        else {
            return false;
        }
    }

    function shuffleArray(newPass) {
        return newPass.sort(() => Math.random() - 0.5);
    }

    function showPass(newPass) {
        cleanPass();
        shuffleArray(newPass).forEach((el, i) => {
            setTimeout(() => { pass.innerHTML += el; }, (INTERVAL * i));
        });
    }

    function updateSecurityLevel() {
        let security_level = 12 + (parseInt(size.value) * 2);
        safe_bar.style.background = "#ff4d4d";
        if (upper.checked) {
            security_level = security_level + 11;
        }
        if (lower.checked) {
            security_level = security_level + 11;
        }
        if (number.checked) {
            security_level = security_level + 8;
        }
        if (special.checked) {
            security_level = security_level + 14;
        }
        if ((upper.checked == false) &&
            (lower.checked == false) &&
            (number.checked == true) &&
            (special.checked == false) &&
            (parseInt(size.value) < 12)) {
            security_level = 10 + parseInt(size.value);
            console.log('aki');
        }
        if (security_level >= 40) {
            safe_bar.style.background = "#ff933b";
        }
        if (security_level >= 51) {
            safe_bar.style.background = "#edff4f";
        }
        if (security_level >= 88) {
            safe_bar.style.background = "#4fff5e";
            security_level = 100;
        }
        safe_bar.style.width = security_level + "%";
    }

    function getPass() {
        let count = 0;
        cleanPass();
        let newPass = [];
        if (isChecked()) {
            while (count < parseInt(size.value)) {
                if (upper.checked && (count < parseInt(size.value))) {
                    newPass.push(getUpper());
                    count++;
                }
                if (lower.checked && (count < parseInt(size.value))) {
                    newPass.push(getLower());
                    count++;
                }
                if (number.checked && (count < parseInt(size.value))) {
                    newPass.push(getNumber());
                    count++;
                }
                if (special.checked && (count < parseInt(size.value))) {
                    newPass.push(getSpecial());
                    count++;
                }
            }
            showPass(newPass);
            updateSecurityLevel();
        }
        else {
            upper.checked = true;
            lower.checked = true;
            getPass();
        }
    }

    updateSize(LESS_LIMIT);
    updateSecurityLevel();
})

