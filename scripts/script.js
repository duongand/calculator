const clear_entry = document.getElementById('clear-entry');
const numerical_buttons = document.getElementsByClassName('numeric');
const decimal = document.getElementById('decimal');
const operations = document.getElementsByClassName('operations');
const equals = document.getElementById('equals');
let initial_value = '';
let final_value = '';
let state = 'initial';
let operation = NaN;

clear_entry.addEventListener('click', () => {
    // If display is empty, clear all values
    if (display.innerText === '') {
        initial_value = '';
        final_value = '';
        operation = NaN;
        state = 'initial';

        update_display('0');
        console.log('All entries cleared');
    };

    // Clear only inital value or final value
    if (state === 'initial') {
        initial_value = '';
        update_display('0');
    } else if (state === 'final') {
        final_value = '';
        update_display('0');
    };
});

for (let i = 0; i < numerical_buttons.length; i++) {
    numerical_buttons[i].addEventListener('click', (event) => {
        append(event.target.innerText);
    });
};

decimal.addEventListener('click', (event) => {

    if (state === 'initial') {
        if (initial_value.indexOf('.') > -1) {
            return;
        };

        initial_value += event.target.innerText;
        update_display(initial_value);
    } else {
        if (final_value.indexOf('.') > -1) {
            return;
        };

        final_value += event.target.innerText;
        update_display(final_value);
    };
});

for (let i = 0; i < operations.length; i++) {
    operations[i].addEventListener('click', (event) => {
        set_operation(event.target.innerText);
    });
};

equals.addEventListener('click', () => {
    compute(initial_value, final_value, operation);
});

function append(value) {
    if (state === 'initial') {
        initial_value += value;
        update_display(initial_value);
    } else if (state === 'final') {
        final_value += value;
        update_display(final_value);
    };
};

function set_operation(clicked_operation) {
    // If an initial value isn't entered, do not set operation
    if (initial_value === '') {
        return;
        // Set operation then change state to append to final value
    } else {
        operation = clicked_operation;
        state = 'final';
    };
};

function compute() {
    // Do not compute if no values were entered into the calculator
    if (initial_value === '' || final_value === '') {
        return;
    };

    let temp;
    if (operation === '+') {
        temp = parseFloat(initial_value) + parseFloat(final_value);
    } else if (operation === '-') {
        temp = parseFloat(initial_value) - parseFloat(final_value);
    } else if (operation === '*') {
        temp = parseFloat(initial_value) * parseFloat(final_value);
    } else if (operation === '÷') {
        if (final_value === '0') {
            document.getElementById('display').innerText = 'NaN';
            // setInterval() to reset calculator
            return;
        };

        temp = parseFloat(initial_value) / parseFloat(final_value);
    };

    initial_value = temp.toString();
    final_value = '';
    operation = NaN;
    state = 'final';
    update_display(initial_value);
};

function update_display(value) {
    // Scientific notation for values over display width
    if (value.length > 16) {
        if (value.indexOf('.') > -1) {
            value = value.substring(0, 1) + '.' + value.substring(2, 5) + 'E+' + (value.length - value.indexOf('.')).toString();
        } else {
            value = value.substring(0, 1) + '.' + value.substring(1, 4) + 'E+' + (value.length - 1).toString();
        };
    };

    document.getElementById('display').innerText = value;
};