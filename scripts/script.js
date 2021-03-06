const plusMinusDisplay = document.getElementById('plus-minus-display');
const display = document.getElementById('display');

let initialValue = '',
    finalValue = '',
    state = 'initial',
    operation = '',
    positiveNegative = '+',
    lastPressed,
    memoryValue = 0,
    memoryRecalled = false;

document.getElementById('clear-entry').addEventListener('click', () => {
    clearEntry();
});

document.getElementById('plus-minus').addEventListener('click', () => {
    flipSign();
});

const numericalButtons = document.getElementsByClassName('numeric');
for (const numericalButton of numericalButtons) {
    numericalButton.addEventListener('click', (event) => {
        appendValue(event.target.innerText);
    });
};

document.getElementById('decimal').addEventListener('click', () => {
    appendDecimal();
});

const operations = document.getElementsByClassName('operations');
for (const operation of operations) {
    operation.addEventListener('click', (event) => {
        setOperation(event.target.innerText);
    });
};

document.getElementById('equals').addEventListener('click', () => {
    compute(initialValue, finalValue, operation);
});

const buttons = document.querySelectorAll('button');
for (const button of buttons) {
    button.addEventListener('click', (event) => {
        setLastedPressed(event.target);
    })
};

const memoryButtons = document.getElementsByClassName('memory');
for (const memoryButton of memoryButtons) {
    memoryButton.addEventListener('click', (event) => {
        setMemoryFunction(event.target.innerText);
    });
};

function clearEntry() {
    if (display.innerText === '0') {
        display.innerText = 'All cleared';
        setTimeout(() => {
            clearAll();
            updateDisplay('0');   
        }, 2000);
    } else if (memoryRecalled === true) {
        initialValue = '';
        state = 'initial';
        memoryRecalled = false;
        updateDisplay('0');
    } else if (state === 'initial') {
        initialValue = '';
        updateDisplay('0');
    } else if (state === 'final') {
        finalValue = '';
        updateDisplay('0');
    };
};

function clearAll() {
    initialValue = '';
    finalValue = '';
    memoryValue = 0;
    operation = NaN;
    state = 'initial';
};

function appendValue(value) {
    if (state === 'initial') {
        initialValue += value;
        updateDisplay(initialValue);
    } else if (state === 'final') {
        finalValue += value;
        updateDisplay(finalValue);
    };
};

function appendDecimal() {
    if (finalValue.indexOf('.') > -1) return;

    if (state === 'initial') {
        initialValue += '.'
        updateDisplay(initialValue);
    } else {
        finalValue += '.';
        updateDisplay(finalValue);
    };
};

function setOperation(clickedOperation) {
    if (initialValue === '') return;
    
    initialValue = parseFloat(positiveNegative + initialValue);
    operation = clickedOperation;
    positiveNegative = '+';
    plusMinusDisplay.innerText = positiveNegative;
    state = 'final';
};

function doComputation() {
    switch (operation) {
        case '+':
            return initialValue + parseFloat(positiveNegative + finalValue);
        case '-':
            return initialValue - parseFloat(positiveNegative + finalValue);
        case '*':
            return initialValue * parseFloat(positiveNegative + finalValue);
        case '??':
            if (finalValue === '0') {
                setTimeout(() => {
                    clearAll();
                    updateDisplay('0');
                }, 1000);
                return 'NaN';
            };
    
            return parseFloat(initialValue) / parseFloat(positiveNegative + finalValue);
        default:
            return 'NaN';
    };
};

function compute() {
    if (initialValue === '' || finalValue === '') return;

    initialValue = doComputation().toString();
    finalValue = '';
    operation = NaN;
    positiveNegative = '+';
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
    if (lastPressed) lastPressed.removeAttribute('id');

    button.setAttribute('id', 'active');
    lastPressed = button;
};

function updateDisplay(value) {
    if (value.length > 16) {
        // If numeric value exceeds a length of 21, the returned value is automatically returned in scientific notation
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

function setMemoryFunction(pressedMemoryFunction) {
    if (pressedMemoryFunction === 'M+') {
        memoryValue += parseFloat(initialValue);
    } else if (pressedMemoryFunction === 'M-') {
        memoryValue -= parseFloat(initialValue);
    } else {
        initialValue = memoryValue.toString();
        memoryRecalled = true;
    };

    display.innerText = memoryValue.toString();
};