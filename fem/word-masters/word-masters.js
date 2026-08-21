function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function init() {
  const rows = document.querySelectorAll(".row");

  rows.forEach((row, index) => {
    const inputs = row.querySelectorAll(".letter");

    row.addEventListener("keydown", function (e) {
      if (!e.target.classList.contains("letter")) return;
      const index = Array.from(inputs).indexOf(e.target);

      if (e.key === "Backspace") {
        if (e.target.value) {
          // inside
        } else {
          if (index > 0) {
            inputs[index - 1].focus();
          }
        }
        return;
      }

      if (!isLetter(e.key)) {
        e.preventDefault();
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        e.target.value = e.key; // replace with new letter

        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }

        if ([...inputs].every((inp) => inp.value)) {
          inputs.forEach((inp) => (inp.disabled = true));
          console.log("Row complete, locked.");
          // verify if word
          // mark letters
          // proceed to next line
        }
      }
    });
  });
}

init();
