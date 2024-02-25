

function Calculator(a, op, b) {
    this.a = a;
    this.op = op;
    this.b = b;

    this.operations = {
        '-': (a, b) => a - b,
        '+': (a, b) => a + b,
        '*': (a, b) => a * b,
        '/': (a, b) => (b === 0) ? null : a / b,
    };

    this.operate = () => this.operations[this.op](this.a, this.b);
}

const calculator = new Calculator(2, '+', 4);

