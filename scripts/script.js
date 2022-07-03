const clearEntry = document.getElementsByClassName('clear-entry')[0];
const signButton = document.getElementsByClassName('plus-minus')[0];
const numericalButtons = document.getElementsByClassName('numeric');
const decimal = document.getElementsByClassName('decimal')[0];
const operations = document.getElementsByClassName('operations');
const equals = document.getElementsByClassName('equals')[0];
const buttons = document.querySelectorAll('button');
const plusMinusDisplay = document.getElementById('plus-minus-display');
const display = document.getElementById('display');

let initialValue = '';
let finalValue = '';
let state = 'initial';
let operation = NaN;
let positiveNegative = '+';
let lastPressed;

clearEntry.addEventListener('click', () => {
    if (display.innerText === '0') {
        display.innerText = 'All cleared';
        setTimeout(reset, 2000);
    } else if (state === 'initial') {
        initialValue = '';
        updatedisplay('0');
    } else if (state === 'final') {
        finalValue = '';
        updatedisplay('0');
    };
});

signButton.addEventListener('click', () => {
    flipSign();
});

for (let i = 0; i < numericalButtons.length; i++) {
    numericalButtons[i].addEventListener('click', (event) => {
        append(event.target.innerText);
    });
};

decimal.addEventListener('click', (event) => {
    if (state === 'initial') {
        if (initialValue.indexOf('.') > -1) {
            return;
        };

        initialValue += event.target.innerText;
        updatedisplay(initialValue);
    } else {
        if (finalValue.indexOf('.') > -1) {
            return;
        };

        finalValue += event.target.innerText;
        updatedisplay(finalValue);
    };
});

for (let i = 0; i < operations.length; i++) {
    operations[i].addEventListener('click', (event) => {
        setOperation(event.target.innerText);
    });
};

equals.addEventListener('click', () => {
    compute(initialValue, finalValue, operation);
});

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (event) => {
        setLastedPressed(event.target);
    });
};

function append(value) {
    if (state === 'initial') {
        initialValue += value;
        updatedisplay(initialValue);
    } else if (state === 'final') {
        finalValue += value;
        updatedisplay(finalValue);
    };
};

function setOperation(clickedOperation) {
    if (initialValue === '') {
        return;
    } else {
        initialValue = (parseFloat(positiveNegative + '1') * parseFloat(initialValue)).toString();
        operation = clickedOperation;
        positiveNegative = '+';
        plusMinusDisplay.innerText = positiveNegative;
        state = 'final';
    };
};

function compute() {
    if (initialValue === '' || finalValue === '') {
        return;
    };

    let temp;
    if (operation === '+') {
        temp = parseFloat(initialValue) + parseFloat(positiveNegative + finalValue);
    } else if (operation === '-') {
        temp = parseFloat(initialValue) - parseFloat(positiveNegative + finalValue);
    } else if (operation === '*') {
        temp = parseFloat(initialValue) * parseFloat(positiveNegative + finalValue);
    } else if (operation === '÷') {
        if (finalValue === '0') {
            display.innerText = 'NaN';
            setTimeout(reset, 3000);
            return;
        };

        temp = parseFloat(initialValue) / parseFloat(positiveNegative + finalValue);
    };

    initialValue = temp.toString();
    finalValue = '';
    operation = NaN;
    positiveNegative = '+';
    state = 'final';
    plusMinusDisplay.innerText = positiveNegative;
    updatedisplay(initialValue);
};

function flipSign() {
    if (positiveNegative === '+') {
        positiveNegative = '-';
    } else {
        positiveNegative = '+';
    };

    plusMinusDisplay.innerText = positiveNegative;
};

function setLastedPressed(button) {
    if (lastPressed) {
        lastPressed.removeAttribute('id');
    };

    button.setAttribute('id', 'active');
    lastPressed = button;
};

function updatedisplay(value) {
    if (value.length > 16) {
        // If numeric value exceeds a length of 21, the returned value is returned in scientific notation
        if (value.indexOf('e') > -1) {
            value = value.substring(0, 5) + value.substring(value.indexOf('e'), value.length);
        // Value exceeds display length; however, does not have a decimal (positive value)
        } else if (value.indexOf('.') === -1) {
            value = value.substring(0, 1) + '.' + value.substring(2, 5) + 'e+' + (value.length - 2).toString();
        // Value exceeds display length; however, is a decimal value
        } else if (value.indexOf('.') > -1) {
            value = value.substring(0, 16);
        };
    };

    document.getElementById('display').innerText = value;
}; 

function reset() {
    initialValue = '';
    finalValue = '';
    operation = NaN;
    state = 'initial';
    updatedisplay('0');
};