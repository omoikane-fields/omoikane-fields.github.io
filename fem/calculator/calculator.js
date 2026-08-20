let screenValue = document.querySelector(".screen");
screenValue.innerHTML = "";

const buttons = document.querySelectorAll("button");

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

function calculate() {
  const value = screenValue.innerHTML;
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

  screenValue.innerHTML = parts.join(" ");
}

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    console.log("Element clicked " + event.target.innerHTML);
    const buttonValue = event.target.innerHTML;

    switch (buttonValue) {
      case "C":
        screenValue.innerHTML = "";
        break;
      case "=":
        calculate(screenValue.innerHTML);
        break;
      case "←":
        screenValue.innerHTML = screenValue.innerHTML.substring(
          0,
          screenValue.innerHTML.length - 1,
        );
        break;
      default:
        screenValue.innerHTML += buttonValue;
        break;
    }
  });
});
