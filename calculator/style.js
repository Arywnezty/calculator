const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }
    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

updateDisplay();

document.querySelector('.calculator-keys').addEventListener('click', (event) => {
    const { target } = event;
    
    if (!target.matches('button')) return;

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal('.');
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('equal-sign')) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && firstOperand !== null) {
            const result = calculate(firstOperand, inputValue, operator);
            calculator.displayValue = String(result);
            calculator.firstOperand = result;
            calculator.waitingForSecondOperand = true;
            calculator.operator = null;
        }
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

document.addEventListener('keydown', (event) => {
    const { key } = event;
    
    if (/[0-9]/.test(key)) {
        inputDigit(key);
        updateDisplay();
        return;
    }
    
    if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
        updateDisplay();
        return;
    }
    
    if (key === '.') {
        inputDecimal('.');
        updateDisplay();
        return;
    }
    
    if (key === '=' || key === 'Enter') {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && firstOperand !== null) {
            const result = calculate(firstOperand, inputValue, operator);
            calculator.displayValue = String(result);
            calculator.firstOperand = result;
            calculator.waitingForSecondOperand = true;
            calculator.operator = null;
        }
        updateDisplay();
        return;
    }
    
    if (key === 'Escape') {
        resetCalculator();
        updateDisplay();
        return;
    }
    
    if (key === 'Backspace') {
        calculator.displayValue = calculator.displayValue.length > 1 
            ? calculator.displayValue.slice(0, -1) 
            : '0';
        updateDisplay();
        return;
    }
});