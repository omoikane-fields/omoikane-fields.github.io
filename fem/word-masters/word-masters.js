function init() {
  const rows = document.querySelectorAll(".row");

  rows.forEach((row, index) => {
    const inputs = row.querySelectorAll(".letter");

    row.addEventListener("input", function (e) {
      if (e.target.classList.contains("letter")) {
        console.log("hello");
        const index = Array.from(inputs).indexOf(e.target);
        if (
          e.target.value.length === e.target.maxLength &&
          index < inputs.length - 1
        ) {
          inputs[index + 1].focus();
        }
      }
    });

    row.addEventListener("keydown", function (e) {
      if (
        e.target.classList.contains("letter") &&
        e.key === "Backspace" &&
        !e.target.value
      ) {
        const index = Array.from(inputs).indexOf(e.target);
        if (index > 0) {
          inputs[index - 1].focus();
        }
      }
    });
  });
}

init();
