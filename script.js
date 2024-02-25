

const divideByZeroErrorMessages = [
    'Division by zero: moronic move.',
    'Infinity chuckles silently.',
    'Math cringes, nice try!',
    'Division by zero? Pathetic.',
    'Infinity\'s secret admirer.',
    'Mathematics scoffs at you.',
];

function Calculator(initialValue, operator, inputValue) {
    this.resultStored = initialValue;
    this.operator = operator;
    this.inputValue = inputValue;
    
    this.operations = {
        '=': () => this.resultStored = this.inputValue,
        '-': () => this.resultStored -= this.inputValue,
        '+': () => this.resultStored += this.inputValue,
        '*': () => this.resultStored *= this.inputValue,
        '/': () => (this.inputValue == 0) 
            ? divideByZeroErrorMessages[Math.round(Math.random() * divideByZeroErrorMessages.length)] 
            : this.resultStored /= this.inputValue,
    };
    
    this.operate = () => (typeof this.resultStored  === 'number' && typeof this.inputValue === 'number') 
        ? this.operations[this.operator]() : 'Error';
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
    
    display.textContent = calculator.inputValue = display.textContent + event.target.textContent;
});

dot.addEventListener('click', () => {
    if (displayState === TAKE_USER_INPUT) {
        dot.disabled = true;
    }
});

clear.addEventListener('click', () => {
    display.textContent = calculator.inputValue = '0';
    dot.disabled = false;

    displayState = DISPLAY_RESULT;

    calculator = new Calculator(0, '+', null);
});

backspace.addEventListener('click', () => {
    if (displayState !== TAKE_USER_INPUT) return;

    if (display.textContent.endsWith('.')) {
        dot.disabled = false;
    }
    
    display.textContent = calculator.inputValue = (calculator.inputValue.length > 1) ? calculator.inputValue.slice(0, -1) : '0';
});

operatorsKeyboard.addEventListener('click', (event) => {
    if (displayState === DISPLAY_ERROR) {
        return;
    }

    let operator = event.target.textContent;

    if (calculator.inputValue === null) {
        calculator.operator = operator;
        return;
    }

    calculator.inputValue = +calculator.inputValue;
    const result = calculator.operate();
    display.textContent = result;

    if (typeof result === 'number') {
        displayState = DISPLAY_RESULT;
    }
    else {
        displayState = DISPLAY_ERROR;
    }
    
    dot.disabled = false;
    calculator.operator = operator;
    calculator.inputValue = null;
});
