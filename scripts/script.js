const clearEntry = document.getElementsByClassName('clear-entry')[0];
const signButton = document.getElementsByClassName('plus-minus')[0];
const numericalButtons = document.getElementsByClassName('numeric');
const decimal = document.getElementsByClassName('decimal')[0];
const operations = document.getElementsByClassName('operations');
const equals = document.getElementsByClassName('equals')[0];
const buttons = document.querySelectorAll('button');
const plusMinusDisplay = document.getElementById('plus-minus-display');
const display = document.getElementById('display');
const memoryButtons = document.getElementsByClassName('memory');

let initialValue = '';
let finalValue = '';
let state = 'initial';
let clearedOnce = false;
let operation = NaN;
let positiveNegative = '+';
let lastPressed;
let memoryValue = 0;

clearEntry.addEventListener('click', () => {
    if (display.innerText === '0') {
        display.innerText = 'All cleared';
        setTimeout(() => {
            reset();
            updateDisplay('0');   
        }, 2000);
        memoryValue = 0;
    } else if (initialValue !== '') {
        initialValue = '';
        updateDisplay('0');
    } else if (state === 'initial') {
        initialValue = '';
        updateDisplay('0');
    } else if (state === 'final') {
        finalValue = '';
        updateDisplay('0');
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
        updateDisplay(initialValue);
    } else {
        if (finalValue.indexOf('.') > -1) {
            return;
        };

        finalValue += event.target.innerText;
        updateDisplay(finalValue);
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

for (let i = 0; i < memoryButtons.length; i++) {
    memoryButtons[i].addEventListener('click', (event) => {
        memoryFunctions(event.target.innerText);
    });
};

function append(value) {
    if (state === 'initial') {
        initialValue += value;
        updateDisplay(initialValue);
    } else if (state === 'final') {
        finalValue += value;
        updateDisplay(finalValue);
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
    updateDisplay(initialValue);
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

function updateDisplay(value) {
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

function memoryFunctions(pressedMemoryFunction) {
    if (pressedMemoryFunction === 'M+') {
        memoryValue += parseFloat(initialValue);
        display.innerText = memoryValue.toString();
    } else if (pressedMemoryFunction === 'M-') {
        memoryValue += (-1 * parseFloat(initialValue));
        display.innerText = memoryValue.toString();
    } else {
        display.innerText = memoryValue;
    };
};

function reset() {
    initialValue = '';
    finalValue = '';
    operation = NaN;
    state = 'initial';
};