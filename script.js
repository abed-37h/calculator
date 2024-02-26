

const divideByZeroErrorMessages = [
    'Division by zero: moronic move.',
    'Infinity chuckles silently.',
    'Math cringes, nice try!',
    'Division by zero? Pathetic.',
    'Infinity\'s secret admirer.',
    'Mathematics scoffs at you.',
];

const overflowErrorMessage = 'Number Overflow. Shrink display.';

function Calculator(initialValue, operator, inputValue) {
    this.resultStored = initialValue;
    this.operator = operator;
    this.inputValue = inputValue;
    
    this.operations = {
        '=': () => this.resultStored = this.inputValue,
        '−': () => this.resultStored -= this.inputValue,
        '+': () => this.resultStored += this.inputValue,
        '×': () => this.resultStored *= this.inputValue,
        '÷': () => {
            errorMessage.textContent = divideByZeroErrorMessages[Math.round(Math.random() * divideByZeroErrorMessages.length)];
            return (this.inputValue == 0) ? null : this.resultStored /= this.inputValue
        },
    };
    
    this.operate = () => (typeof this.resultStored  === 'number' && typeof this.inputValue === 'number') 
        ? this.operations[this.operator]() : 'Error';
}

let calculator = new Calculator(0, '+', null);

const errorMessage = document.querySelector('#error-message');
const display = document.querySelector('#display');
const operatorsKeyboard = document.querySelector('#operators');
const digitsKeyboard = document.querySelector('#digits');
const dot = document.querySelector('#dot');
const clear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');

const handleDigit = (digit) => {
    if (errorMessage.textContent.length) {
        return;
    }

    if (calculator.inputValue === null) {
        calculator.inputValue = '0';
    }
    
    if (digit === '.') {
        dot.disabled = true;
    }
    else if (calculator.inputValue == '0') {
        calculator.inputValue = '';
    }
    
    display.textContent = calculator.inputValue = setPrecision(calculator.inputValue +  digit);
};

const clearDisplay = () => {
    display.textContent = calculator.inputValue = '0';
    errorMessage.textContent = '';
    dot.disabled = false;
    
    calculator = new Calculator(0, '+', null);
};

const handleBackspace = () => {
    if (calculator.inputValue === null) return;

    if (calculator.inputValue.endsWith('.')) {
        dot.disabled = false;
    }
    
    display.textContent = calculator.inputValue = (calculator.inputValue.length > 1) 
        ? calculator.inputValue.slice(0, -1) : '0';
};

const handleOperator = (operator) => {
    if (errorMessage.textContent.length) {
        return;
    }

    if (calculator.inputValue === null) {
        calculator.operator = operator;
        return;
    }

    calculator.inputValue = +calculator.inputValue;
    let result = calculator.operate();
    
    if (typeof result === 'number') {
        result = "" + +(+result).toPrecision(16);
        
        if (result.split('.')[0].length > 16) {
            errorMessage.textContent = overflowErrorMessage;
        }
        else {
            display.textContent = setPrecision(result);
        }
    }

    dot.disabled = false;
    calculator.operator = operator;
    calculator.inputValue = null;
};

digitsKeyboard.addEventListener('click', (event) => {
    if (event.target != digitsKeyboard) {
        handleDigit(event.target.textContent);
    }
});

clear.addEventListener('click', clearDisplay);

backspace.addEventListener('click', handleBackspace);

operatorsKeyboard.addEventListener('click', (event) => {
    if (event.target != operatorsKeyboard) {
        handleOperator(event.target.textContent);
    }
});

window.addEventListener('keydown', (event) => {
    const digits = '0123456789.';
    const operators = '=-+*/';

    if (digits.includes(event.key)) {
        handleDigit(event.key);
    }
    else if (operators.includes(event.key)) {
        switch (event.key) {
            case '-': handleOperator('−'); break;
            case '+': handleOperator('+'); break;
            case '*': handleOperator('×'); break;
            case '/': handleOperator('÷'); event.preventDefault(); break;
            case '=': handleOperator('='); break;
        }
    }
    else if (event.key === 'Enter') {
        event.preventDefault();
        handleOperator('=');
    }
    else if (event.key === 'Delete') {
        (event.ctrlKey) ? clearDisplay() : handleBackspace();
    }
    else if (event.key === 'Backspace') {
        (event.ctrlKey) ? clearDisplay() : handleBackspace();
    }
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
