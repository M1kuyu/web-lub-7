// Функция priority возвращает приоритет оператора.
// Для операций '+' и '-' приоритет равен 1,
// для остальных (умножение и деление) — 2.
function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Функция isNumeric проверяет, является ли строка числом.
// Строка должна быть числом, которое может содержать
// одну точку (десятичную дробь).
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Функция isDigit проверяет, является ли строка одной цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Функция isOperation проверяет, является ли строка оператором
// (+, -, *, /).
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize разбивает строку на отдельные токены
// (цифры, операторы, скобки). Возвращает массив токенов.
function tokenize(str) {
    let tokens = [];
    let lastNumber = ''; // Строка для текущего числа
    for (char of str) {
        // Если символ — цифра или точка, добавляем к числу
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            // Если накопили число, добавляем его в список токенов
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        // Если символ — оператор или скобка, добавляем его в токены
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    // Добавляем последнее число, если оно осталось
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile преобразует выражение из инфиксной нотации
// в обратную польскую нотацию (ОПН). Используется алгоритм сортировочной станции.
function compile(str) {
    let out = []; // Массив для хранения результата (ОПН)
    let stack = []; // Стек для операторов и скобок
    for (token of tokenize(str)) {
        // Если токен — число, добавляем его в результат
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            // Если токен — оператор, перемещаем операторы в стек по приоритету
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token); // Добавляем текущий оператор в стек
        } else if (token == '(') {
            stack.push(token); // Открывающая скобка — добавляем в стек
        } else if (token == ')') {
            // Закрывающая скобка — извлекаем все операторы до открывающей
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop(); // Убираем открывающую скобку
        }
    }
    // Добавляем оставшиеся операторы из стека в результат
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' '); // Возвращаем строку, разделенную пробелами
}

// Функция evaluate вычисляет выражение в обратной польской нотации (ОПН).
function evaluate(str) {
    let stack = []; // Стек для операндов
    let tokens = str.split(' '); // Разделяем строку на токены

    for (let token of tokens) {
        // Если токен — число, добавляем его в стек
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            // Если токен — оператор, извлекаем два операнда из стека
            let b = stack.pop();
            let a = stack.pop();
            // Применяем оператор к операндам и кладем результат обратно в стек
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
            }
        }
    }

    return stack.pop(); // Возвращаем результат вычисления
}

// Функция clickHandler обрабатывает клики по кнопкам калькулятора.
// В зависимости от нажатой кнопки выполняются разные действия:
function clickHandler(event) {
    const screen = document.querySelector('.screen span');
    const target = event.target;
    const value = target.textContent;

    // Если нажата кнопка с числом, оператором или скобкой — добавляем символ на экран
    if (target.classList.contains('digit') || target.classList.contains('operation') || target.classList.contains('bracket')) {
        screen.textContent += value;
    } else if (target.classList.contains('clear')) {
        screen.textContent = ''; // Очищаем экран при нажатии на кнопку "Clear"
    } else if (target.classList.contains('result')) {
        // При нажатии на кнопку "Result" вычисляем результат
        const rpnExpression = compile(screen.textContent); // Преобразуем выражение в ОПН
        const result = evaluate(rpnExpression); // Вычисляем результат
        screen.textContent = result.toFixed(2); // Отображаем результат с точностью до двух знаков
    }
}

// Назначаем обработчик событий для всех кнопок калькулятора
window.onload = function () {
    document.querySelector('.buttons').addEventListener('click', clickHandler);
}
