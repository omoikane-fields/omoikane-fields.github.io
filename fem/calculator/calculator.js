function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return Math.floor(a / b); // no fractions
}

function subtract(a, b) {
  return a - b;
}

function add(a, b) {
  return a + b;
}

function executeExpression(parts, operator, func) {
  const index = parts.indexOf(operator);
  const leftArg = parts[index - 1];
  const rightArg = parts[index + 1];
  const result = func(leftArg, rightArg);

  return [
    ...parts.slice(0, index - 1),
    func(Number.parseInt(leftArg), Number.parseInt(rightArg)).toString(),
    ...parts.slice(index + 2),
  ];
}

function calculate(value) {
  let parts = value.split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)/);

  // handle divide & multiple first
  while (parts.includes("x") || parts.includes("÷")) {
    const index = parts.findIndex((item) => item === "x" || item === "÷");
    const operator = parts[index];

    if (operator === "x") {
      parts = executeExpression(parts, "x", multiply);
    } else {
      parts = executeExpression(parts, "÷", divide);
    }
  }

  // subtract & divide next
  while (parts.includes("-") || parts.includes("+")) {
    const index = parts.findIndex((item) => item === "-" || item === "+");
    const operator = parts[index];

    if (operator === "-") {
      parts = executeExpression(parts, "-", subtract);
    } else {
      parts = executeExpression(parts, "+", add);
    }
  }

  return parts.join("");
}

function paint(screen, value) {
  screen.innerHTML = value;
}

// init() to initialize handlers
function init() {
  let screenValue = "";
  let screen = document.querySelector(".screen");
  paint(screen, screenValue);

  document
    .querySelector(".calculator-buttons")
    .addEventListener("click", (event) => {
      const buttonValue = event.target.innerHTML;

      switch (buttonValue) {
        case "C":
          screenValue = "";
          break;
        case "=":
          screenValue = calculate(screenValue);
          break;
        case "←":
          screenValue = screenValue.substring(0, screenValue.length - 1);
          break;
        default:
          screenValue += buttonValue;
          break;
      }

      paint(screen, screenValue);
    });
}

init();
