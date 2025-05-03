let words = [];
let wordIndex = 0;
let jsonObj;
let startTime;
let numberOfChar;
let quotes;
// page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');


function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        // console.log(reader.result);
        jsonObj = JSON.parse(reader.result);
        quotes = jsonObj.quotes  // [{text: "abc", source: "abc", id: 100, length: 3k}]
    };

    reader.onerror = function() {
        console.log(reader.error);
    };
    return reader.result
}


// construct test
document.getElementById("typed-value").addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        // get a quote
        const quoteIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[quoteIndex];

        // numberOfChar = quote.split("").length;
        numberOfChar = quote.length;

        // Put the quote into an array of words
        words = quote.text.split(" ");
        // reset the word index for tracking
        wordIndex = 0;

        // UI updates
        // Create an array of span elements so we can set a class
        // Convert into string and set as innerHTML on quote display
        // Highlight the first word
        const spanWords = words.map(function(word) { return `<span>${word} </span>`});
        quoteElement.innerHTML = spanWords.join("");
        quoteElement.childNodes[0].className = "highlight";

        // Clear any prior messages
        messageElement.innerText = "";

        // Setup the textbox, and set focus
        typedValueElement.value = "";
        // set the event handler

        // Start the timer
        startTime = new Date().getTime();
    }
});


typedValueElement.addEventListener("input", () => {
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    // end of sentence
    // Display success
    const elapsedTime = new Date().getTime() - startTime;
    const message = `Characters: ${numberOfChar}\nTime: ${elapsedTime / 1000}\nSpeed: ${Math.floor(numberOfChar / (elapsedTime * 5 / (1000 * 60)))} WPM.\n `;
    messageElement.innerText = message;
  } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    // end of word
    // clear the typedValueElement for the new word
    typedValueElement.value = '';
    // move to the next word
    wordIndex++;
    // reset the class name for all elements in quote
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = '';
    }
    // highlight the new word
    quoteElement.childNodes[wordIndex].className = "highlight";
  } else if (currentWord.startsWith(typedValue)) {
    // currently correct
    // highlight the next word
    typedValueElement.className = "";
  } else {
    // error state
    typedValueElement.className = "error";
  }
});


typedValueElement.focus();
