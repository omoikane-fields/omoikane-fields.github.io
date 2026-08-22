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
  return data.validWord;
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

async function getUserGuess(inputs) {
  const word = [...inputs].map((inp) => inp.value).join("");
  const validWord = await isAWord(word);

  return [word, validWord];
}

function lockRow(inputs) {
  inputs.forEach((inp) => (inp.disabled = true));
}

function backspace(event, inputs, index) {
  if (event.target.value) {
    // inside the cell that has value
    // remove that value and stay in cell.
  } else {
    if (index > 0) {
      inputs[index - 1].focus();
    }
  }
}

async function init() {
  const word = await getWordOfTheDay();
  const title = document.querySelector(".title");
  const rows = document.querySelectorAll(".row");
  const gameOver = document.querySelector(".game-over");

  // set focus on first row and letter
  rows[0].querySelector(".letter").focus();

  rows.forEach((row, index) => {
    const inputs = row.querySelectorAll(".letter");
    if (index > 0) {
      inputs.forEach((input) => (input.readOnly = true));
    }

    row.addEventListener("keydown", async function handleKeyPress(e) {
      if (e.target.readOnly) return;
      if (!e.target.classList.contains("letter")) return;
      const index = Array.from(inputs).indexOf(e.target);

      switch (e.key) {
        case "Backspace":
          backspace(event, inputs, index);
          return;
        case "Enter":
          const [guess, valid] = await getUserGuess(inputs);
          if (guess.length < 5) return;

          lockRow(inputs);

          if (!valid) {
            row.classList.add("invalid-word");
          }

          // now check
          switch (true) {
            case guess === word:
              // winner!!!!
              checkMatches(word, inputs);
              gameOver.classList.remove("hidden");
              gameOver.querySelector(".won").classList.remove("hidden");
              title.classList.add("winner");
            default:
              rowIndex = Array.from(rows).indexOf(row);
              if (rowIndex >= rows.length - 1) {
                // loser !!!
                gameOver.classList.remove("hidden");
                gameOver.querySelector(".lost").classList.remove("hidden");
              } else {
                // wrong guess
                checkMatches(word, inputs);
                const nextRow = rows[rowIndex + 1];
                nextRow.querySelector(".letter").focus();
                nextRow
                  .querySelectorAll(".letter")
                  .forEach((input) => (input.readOnly = false));
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
