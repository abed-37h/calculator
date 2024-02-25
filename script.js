

function Calculator(a, op, b) {
    this.a = a;
    this.op = op;
    this.b = b;
    
    this.operations = {
        '=': (a, b) => a = b,
        '-': (a, b) => a - b,
        '+': (a, b) => a + b,
        '*': (a, b) => a * b,
        '/': (a, b) => (b == 0) ? "Syntax Error: can't divide by 0" : a / b,
    };
    
    this.operate = () => (typeof this.a  === 'number' && typeof this.b === 'number') ? this.operations[this.op](this.a, this.b) : 'Error';
}

const TAKE_USER_INPUT = 0;
const DISPLAY_RESULT = 1;
const DISPLAY_ERROR = 2;

let calculator = new Calculator(0, '+', null);
let displayState = TAKE_USER_INPUT;

const display = document.querySelector('#display');
const operatorsKeyboard = document.querySelector('#operators');
const digitsKeyboard = document.querySelector('#digits');
const dot = document.querySelector('#dot');
const clear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');

digitsKeyboard.addEventListener('click', (event) => {
    if (displayState === DISPLAY_ERROR) {
        return;
    }
    
    if (displayState === DISPLAY_RESULT) {
        display.textContent = '0';
        displayState = TAKE_USER_INPUT;
    }
    
    if (display.textContent === '0' && event.target.textContent !== '.') {
        display.textContent = '';
    }
    
    display.textContent += event.target.textContent;
});

dot.addEventListener('click', () => {
    if (displayState === TAKE_USER_INPUT) {
        dot.disabled = true;
    }
});

clear.addEventListener('click', () => {
    display.textContent = '0';
    dot.disabled = false;
    displayState = DISPLAY_RESULT;
    calculator = new Calculator(0, '+', null);
});

backspace.addEventListener('click', () => {
    if (displayState !== TAKE_USER_INPUT) return;
    if (display.textContent.endsWith('.')) {
        dot.disabled = false;
    }
    
    display.textContent = display.textContent.slice(0, -1);
    
    if (display.textContent === '') {
        display.textContent = '0';
    }
});

operatorsKeyboard.addEventListener('click', (event) => {
    if (displayState === DISPLAY_ERROR) {
        return;
    }

    let op = event.target.textContent;
    calculator.b = +display.textContent;
    const result = calculator.operate();
    display.textContent = result;
    if (typeof result === 'number') {
        displayState = DISPLAY_RESULT;
    }
    else {
        displayState = DISPLAY_ERROR;
    }
    
    dot.disabled = false;
    calculator = new Calculator(result, op, null);
});
