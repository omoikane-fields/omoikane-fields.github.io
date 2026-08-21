function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// get words of the day
// https://words.dev-apis.com/word-of-the-day

const WOD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_URL = "https://words.dev-apis.com/validate-word";

async function getWordOfTheDay() {
  try {
    const response = await fetch(WOD_URL);
    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.word;
  } catch (error) {
    console.error("Failed to fetch Word of the Day:", error);
    return null;
  }
}

async function isAWord(guess) {
  const response = await fetch(VALIDATE_URL, {
    method: "POST",
    body: JSON.stringify({
      word: guess,
    }),
  });

  const data = await response.json();
}

function checkMatches(word, inputs) {
  let charCounts = {};
  let seenCounts = {};
  const wordChars = word.split(""); // all characters of the word

  // check exact matches first, remove wordChars that match
  inputs.forEach((input, index) => {
    if (input.value === word[index]) {
      input.classList.add("exact-match");
      const index = wordChars.indexOf(input.value);
      if (index !== -1) wordChars.splice(index, 1);
    }
  });

  inputs.forEach((input, index) => {
    if (word.includes(input.value) && wordChars.indexOf(input.value) != -1) {
      input.classList.add("match");
      const index = wordChars.indexOf(input.value);
      if (index !== -1) wordChars.splice(index, 1);
    } else if (input.value !== word[index]) {
      input.classList.add("mismatch");
    }
  });
}

function getUserGuess(inputs) {
  return [...inputs].map((inp) => inp.value).join("");
}

function lockRow(inputs) {
  inputs.forEach((inp) => (inp.disabled = true));
}

async function init() {
  const word = await getWordOfTheDay();
  const rows = document.querySelectorAll(".row");

  // set focus on first row and letter
  rows[0].querySelector(".letter").focus();

  rows.forEach((row, index) => {
    const inputs = row.querySelectorAll(".letter");
    if (index > 0) {
      inputs.forEach((input) => (input.readOnly = true));
    }

    row.addEventListener("keydown", function (e) {
      if (e.target.readOnly) return;
      if (!e.target.classList.contains("letter")) return;
      const index = Array.from(inputs).indexOf(e.target);

      switch (e.key) {
        case "Backspace":
          if (e.target.value) {
            // inside the cell that has value
            // remove that value and stay in cell.
          } else {
            if (index > 0) {
              inputs[index - 1].focus();
            }
          }
          return;
        case "Enter":
          guess = getUserGuess(inputs);
          if (guess.length == 5) {
            lockRow(inputs);
            // now check
            switch (true) {
              case guess === word:
                checkMatches(word, inputs);
                alert("you win!");
              default:
                rowIndex = Array.from(rows).indexOf(row);
                if (rowIndex >= rows.length - 1) {
                  alert("you lose!");
                } else {
                  checkMatches(word, inputs);
                  const nextRow = rows[rowIndex + 1];
                  nextRow.querySelector(".letter").focus();
                  nextRow
                    .querySelectorAll(".letter")
                    .forEach((input) => (input.readOnly = false));
                }
            }
          }
          break;
      }

      e.preventDefault();

      if (!isLetter(e.key)) {
        return;
      }

      e.target.value = e.key; // replace with new letter

      // move to next cell.
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
  });
}

init();
