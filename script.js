

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
        '−': () => this.resultStored -= this.inputValue,
        '+': () => this.resultStored += this.inputValue,
        '×': () => this.resultStored *= this.inputValue,
        '÷': () => (this.inputValue == 0) 
            ? divideByZeroErrorMessages[Math.round(Math.random() * divideByZeroErrorMessages.length)] 
            : this.resultStored /= this.inputValue,
    };
    
    this.operate = () => (typeof this.resultStored  === 'number' && typeof this.inputValue === 'number') 
        ? this.operations[this.operator]() : 'Error';
}

const TAKE_USER_INPUT = 0;
const DISPLAY_RESULT = 1;
const DISPLAY_ERROR = 2;

let calculator = new Calculator(0, '+', 0);
let displayState = TAKE_USER_INPUT;

const errorMessage = document.querySelector('#error-message');
const display = document.querySelector('#display');
const operatorsKeyboard = document.querySelector('#operators');
const digitsKeyboard = document.querySelector('#digits');
const dot = document.querySelector('#dot');
const clear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');

digitsKeyboard.addEventListener('click', (event) => {
    if (displayState === DISPLAY_ERROR || event.target == digitsKeyboard) {
        return;
    }
    
    if (displayState === DISPLAY_RESULT) {
        calculator.inputValue = '0';
        displayState = TAKE_USER_INPUT;
    }
    
    if (calculator.inputValue == '0' && event.target.textContent !== '.') {
        calculator.inputValue = '';
    }
    
    display.textContent = calculator.inputValue = setPrecision(calculator.inputValue +  event.target.textContent);
});

dot.addEventListener('click', () => {
    if (displayState === TAKE_USER_INPUT) {
        dot.disabled = true;
    }
});

clear.addEventListener('click', () => {
    display.textContent = calculator.inputValue = '0';
    errorMessage.textContent = '';
    
    dot.disabled = false;

    displayState = TAKE_USER_INPUT;

    calculator = new Calculator(0, '+', 0);
});

backspace.addEventListener('click', () => {
    if (displayState !== TAKE_USER_INPUT) return;

    if (calculator.inputValue.endsWith('.')) {
        dot.disabled = false;
    }
    
    display.textContent = calculator.inputValue = (calculator.inputValue.length > 1) 
        ? calculator.inputValue.slice(0, -1) : '0';
});

operatorsKeyboard.addEventListener('click', (event) => {
    if (displayState === DISPLAY_ERROR || event.target == operatorsKeyboard) {
        return;
    }

    const operator = event.target.textContent;

    if (calculator.inputValue === null) {
        calculator.operator = operator;
        return;
    }

    calculator.inputValue = +calculator.inputValue;
    let result = calculator.operate();
    
    if (typeof result === 'number') {
        result = "" + +(+result).toPrecision(16);
        
        if (result.split('.')[0].length > 16) {
            errorMessage.textContent = 'Number Overflow. Shrink display.';
            displayState = DISPLAY_ERROR;
        }
        else {
            display.textContent = setPrecision(result);
            displayState = DISPLAY_RESULT;
        }
    }
    else {
        errorMessage.textContent = result;
        displayState = DISPLAY_ERROR;
    }

    dot.disabled = false;
    calculator.operator = operator;
    calculator.inputValue = null;
});

const setPrecision = (toDisplay, precision = 16) => {
    let split = toDisplay.split('.');
    const integer = split[0];
    const decimal = split[1];

    if (split.length === 1 || integer.length === precision) {
        toDisplay = integer.slice(0, precision);
        dot.disabled = false;
    }    
    else {
        toDisplay = integer + '.' + decimal.slice(0, precision - integer.length);
    }

    return toDisplay;
};
