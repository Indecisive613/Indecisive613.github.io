let secret = ["", "", "", "", ""]; //goal is to guess this word
let guess = JSON.parse(localStorage.getItem("guess")) ||[ 
["", "", "", "", ""],
["", "", "", "", ""],
["", "", "", "", ""],
["", "", "", "", ""],
["", "", "", "", ""], 
["", "", "", "", ""]]; //guesses made by the user
let letters = {a: ["A",0], b: ["B",0], c: ["C",0],
d: ["D",0], e: ["E",0], f: ["F",0], g: ["G",0], h: ["H",0],
i: ["I",0], j: ["J",0], k: ["K",0], l: ["L",0], m: ["M",0],
n: ["N",0], o: ["O",0], p: ["P",0], q: ["Q",0], r: ["R",0],
s: ["S",0], t: ["T",0], u: ["U",0], v: ["V",0], w: ["W",0],
x: ["X",0], y: ["Y",0], z: ["Z",0]}; //state of each letter used to determine color
let userData = JSON.parse(localStorage.getItem("userData")) || {
    played: 0,
    winRate: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    mostRecentScore: 0
} //user statistics
let colMap = {1: "first", 2: "second", 3: "third", 4: "fourth", 5: "fifth"}; //connects column numbers to their associated IDs
let success = false; //whether or not the user can continue guessing
let activeRow = 0; //next empty row
let activeColumn = 1; //next empty column in the active row
let testValid = false; //used to keep track of word validity
let myTimeout = ""; //used to cancel timeouts if necessary


/*Setting Variables*/

function setSecret(){ //chooses a new secret word
    let storedSecret = JSON.parse(localStorage.getItem("secret")) || ["", "", "", "", ""];
    if(storedSecret[0] === ""){ //ensures no secret resets if the previous game is still incomplete
        let chosenWord = wordBank[Math.floor(Math.random() * 344)].toUpperCase();
        for(let i = 0; i < 5; i+=1){
            secret[i] = chosenWord[i];
        }
        console.log(chosenWord); //!uncomment this to have the secret outputted to the console
        localStorage.setItem("secret", JSON.stringify(secret)); //stores the new secret in local storage
    }else{
        for(let i = 0; i < 5; i+=1){
            secret[i] = storedSecret[i];
        }
        console.log("The secret was not renewed, it is still " + secret); //!uncomment this to have the secret outputted to the console
    }
}

function setSucces(){ //used on page load to set success to true if the secret had been discovered
    for(let i = 0; i < 6; i+=1){
        if(guess[i][0] == secret[0] && guess[i][1] == secret[1] && guess[i][2] == secret[2] && guess[i][3] == secret[3] && guess[i][4] == secret[4]){
            success = true;
            setTimeout(showStats, 1000);
            break;
        }
    }
}

function setActiveRow(){ //sets activeRow to the next empty row
    for(i = 1; i <= 6; i+=1){
        if(guess[i-1][0] === ""){
            activeRow = i;
            break;
        }
    }
}

/*Creating the Guessing Board*/

function makeAllRows(){ //creates the guess board
    for(let i = 1; i <= 6; i+=1){
        if(i === activeRow){
            createActiveRow(i);
        }else{
            createRow(i);
        }
    }
}

function createRow(row){ //creates the line of squares for the corresponding row
    if(guess[row-1][0] === ""){
        createEmptyRow(row);
    } else{
        elementID = "row" + row;
        document.getElementById(elementID).innerHTML = 
            `
                <div class="square${getCorrectClass(guess[row-1][0], 1, row)}">
                    ${guess[row-1][0]}
                </div>
                <div class="square${getCorrectClass(guess[row-1][1], 2, row)}">
                    ${guess[row-1][1]}
                </div>
                <div class="square${getCorrectClass(guess[row-1][2], 3, row)}">
                    ${guess[row-1][2]}
                </div>
                <div class="square${getCorrectClass(guess[row-1][3], 4, row)}">
                    ${guess[row-1][3]}
                </div>
                <div class="square${getCorrectClass(guess[row-1][4], 5, row)}">
                    ${guess[row-1][4]}
                </div>
            `;
    }
}

function createEmptyRow(row){ //creates empty squares on the specified row
    elementID = "row" + row;
    document.getElementById(elementID).innerHTML = 
        `
            <div class="square">
            </div>
            <div class="square">
            </div>
            <div class="square">
            </div>
            <div class="square">
            </div>
            <div class="square">
            </div>
        `;
}

function createActiveRow(row){ //creates active row on the specified row
    elementID = "row" + row; 
    document.getElementById(elementID).innerHTML = 
        `
            <div id="first" class="square${isFilled(row, 1)}"></div>
            <div id="second" class="square${isFilled(row, 2)}"></div>
            <div id="third" class="square${isFilled(row, 3)}"> </div>
            <div id="fourth" class="square${isFilled(row, 4)}"></div>
            <div id="fifth" class="square${isFilled(row, 5)}"></div>
        `;
}

function isFilled(row, position){ //returns the class associated with a filled square on the active row
    if(guess[row-1][position-1] != ""){
        return ` darkBorderSquare`;
    }
    return ``;
}

function getCorrectClass(letter, position, row){ //returns the appropriate CSS class for letter with regards to its' position
    if(secret[position-1] === letter){ //correct letter, correct position
        letters[letter.toLowerCase()][1] = 2;
        generateKeyboard();
        return ' greenSquare';
    }else if(!secret.includes(letter)){ //secret does not include letter
        letters[letter.toLowerCase()][1] = -1;
        generateKeyboard();
        return ' darksquare';
    } else{
        let possible = letterCount(letter, secret) - getNumberCorrect(letter, row);
        let currentLine = letterCount(letter, guess[row-1].slice(0, position));
        if (currentLine <= possible){ //correct letter, wrong position
            letters[letter.toLowerCase()][1] = 1;
            generateKeyboard();
            return ' yellowSquare';
        }
    }
    //secret contains the letter, but the guess already has a satisfactory number of letter(s)
    return ' darkSquare';
}

function letterCount(letter, arr){ //returns the number of times letter appears in arr
    let counter = 0;
    for(let i = 0; i < 5; i += 1){
        if(letter === arr[i]){
            counter += 1;
        }
    }
    return counter;
}

function getNumberCorrect(letter, row){ //returns how many correct instances of letter are in the current guess row
    counter = 0;
    for(let i = 0; i < 5; i += 1){
        if(letter === guess[row-1][i] && letter === secret[i]){
            counter += 1;
        }
    }
    return counter;
}

/*Creating the Keyboard*/

function generateKeyboard(){ //generates the keyboard
    document.getElementById("topLine").innerHTML = `${createKey("q")}${createKey("w")}
    ${createKey("e")}${createKey("r")}${createKey("t")}${createKey("y")}
    ${createKey("u")}${createKey("i")}${createKey("o")}${createKey("p")}`; //creates the top row of the keyboard

    document.getElementById("middleLine").innerHTML = `${createKey("a")}
    ${createKey("s")}${createKey("d")}${createKey("f")}${createKey("g")}
    ${createKey("h")}${createKey("j")}${createKey("k")}${createKey("l")}`; //creates the middle row of the keyboard

    document.getElementById("bottomLine").innerHTML = `${createBigKey("Enter")}
    ${createKey("z")}${createKey("x")}${createKey("c")}${createKey("v")}
    ${createKey("b")}${createKey("n")}${createKey("m")}${createBigKey("Backspace")}`; //creates the bottom row of the keyboard
}

function createKey(lowercase){ //returns the html to create a correctly colored keyboard key
    let keyClass = `lightKey`;
    switch(letters[lowercase][1]){
        case -1:
            keyClass += ` darkKey`;
            break;
        case 1:
            keyClass += ` yellowKey`;
            break;
        case 2:
            keyClass += ` greenKey`;
            break;
        default:
            break;
    }
    let x = letters[lowercase][0];
    return `<div class="${keyClass}" onclick="insertLetter('${x}')">${x}</div>`;
}

function createBigKey(description){ //returns the html to create the enter or backspace keys
    if(description === "Enter"){
        return `<div class="lightKey bigKey" onclick="enter()">ENTER</div>`;
    }
    return `<div class="lightKey bigKey bigIcon" onclick="backspace()"><i class="fa-solid fa-delete-left"></i></div>`;
}

/*Game Functionality*/

function action(event){ //activates when a key is pressed in order to generate and display guesses
    if(success){ //don't want to do anything after success
        return; 
    }
    let x = event.key;
    let lowercase = Object.keys(letters).includes(x);
    if(lowercase){
        x = letters[x][0]; //converts to upper case
        insertLetter(x);
    }else{
        let capital = false;
        for(lowercase in letters){ //checks if the key is a capital
            if(letters[lowercase][0] === x){
                capital = true;
                break;
            }
        }
        if(capital){
            insertLetter(x);
        } else if(x === "Enter" && guess[activeRow-1][4] != ""){
            enter();
        } else if(x === "Backspace" || x === "Delete"){
            backspace();
        }
    }
}

function insertLetter(x){ //inserts x in the next active location
    if(activeColumn < 6){ //caps guess at 5 letters
        guess[activeRow-1][activeColumn-1] = x;
        document.getElementById(colMap[activeColumn]).innerHTML = `${x}`;
        activeColumn += 1;
    }
}

function backspace(){ //deletes the most recent space in the guess row
    if(activeColumn > 1){ //will not delete if nothing is there
        guess[activeRow-1][activeColumn-2] = "";
        document.getElementById(colMap[activeColumn-1]).innerHTML = ``;
        activeColumn -= 1;
    }
}

async function enter(){ //cements the most recent row in guess
    if(activeColumn === 6){ //ensures that the guess has 5 letters
        let currentWord = convertGuess();
        testValid = false; //assumes currentWord is not a word
        hidePopup(); 
        await isWord(currentWord); //isWord will change testValid to true if currentWord is valid
        if(testValid === true){
            activeRow += 1;
            if(checkComplete() === true){
                success = true;
                setCompletion();
            }else{
                activeColumn = 1;
            }
            makeAllRows();
            if(activeRow > 6){ //person failed
                success = true; 
                setCompletion();
            }
            localStorage.setItem("guess", JSON.stringify(guess));
        }
    }
}

function convertGuess(){//returns a single string containing the guess on the active row
    let answer = "";
    for(let i = 0; i < 5; i+=1){
        answer += guess[activeRow-1][i];
    }
    return answer;
}

function hidePopup(){ //clears any popups
    document.getElementById("insert-here").innerHTML = ``;
}

/*Upon Completion*/

function setCompletion(){ //updates data and shows completion popups
    let score = 7;
    if(checkComplete()){ //reduce score if complete
        score -=1;
    }
    for(let i = 5; i >= 0; i-=1){ //reduce score for each empty line in guess
        if(guess[i][4] === ""){
            score -= 1;
        }else{
            break;
        }
    }
    updateData(score);
    clearTimeout(myTimeout); //clears timer in case the popup was scheduled to leave early
    statusPopup(score);
    setTimeout(showStats, 2000); //replaces statusPopup(score) with stats after two seconds
}

function checkComplete(){ //returns whether or not the secret word has been guessed
    for(let i = 0; i < 5; i++){
        if(secret[i] !== guess[activeRow-2][i]){
            return false;
        }
    }
    return true;
}

function statusPopup(score){ //generates a popup with a completion message
    let amazingMessages = ["Superb", "Genius", "Perfect", "Impeccable", "Splendid"];
    let happyMessages = ["Nice", "Amazing", "Great", "Excellent", "Awesome"];
    let gratefulMessages = ["Phew", "Close one", "Just made it", "Nice", "So close"];

    let chosenNum = Math.floor((Math.random() * 10)/2);
    let message = "";
    switch(score){//messages will depend on how well the user did
        case 1:
        case 2:
            message = amazingMessages[chosenNum];
            break;
        case 3:
        case 4:
        case 5:
            message = happyMessages[chosenNum];
            break;
        case 6:
            message = gratefulMessages[chosenNum];
            break;
        default: //if a user failed, the secret is displayed as the message
            for(let i = 0; i < 5; i+=1){
                message += secret[i];
            }
            break;
    }
    document.getElementById("insert-here").innerHTML = `
    <div class="status-popup">
        ${message}
    </div>
    `;
}

/*Dictionary*/

async function isWord(word){ //returns whether or not word is valid acording to Free Dictionary API
    let url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    try{
        let response = await fetch(url);
        let data = await response.text();
        data = JSON.parse(data);
        const exists = data[0].hasOwnProperty('word'); //if word is not valid, this results in an error
        testValid = true;
    }catch(error){
        document.getElementById("insert-here").innerHTML = `<div class="status-popup">Not in word list</div>`; //sets not a word popup
        myTimeout = setTimeout(hidePopup, 2000); //hides popup after two seconds

    }
}

/*Statistics*/

function updateData(score){ //updates game statistics
    userData["played"] += 1;
    userData["mostRecentScore"] = score;
    if(score <= 6){
        userData["guessDistribution"][score-1] += 1;
        userData["currentStreak"] += 1;
        if(userData["currentStreak"] > userData["maxStreak"]){
            userData["maxStreak"] = userData["currentStreak"];
        }
    } else{ //user failed or gave up
        userData["currentStreak"] = 0;
    }
    let victories = 0;
    for(number of userData["guessDistribution"]){
        victories += number;
    }
    if(victories === 0){
        userData["winRate"] = 0;
    }else{
        userData["winRate"] = Math.round((victories/userData["played"])*100);
    }
    localStorage.setItem("userData", JSON.stringify(userData)); //saves userData to local storage
}

function showStats(){ //generates a popup showing user statistics
    document.getElementById("insert-here").innerHTML = `
    <div class="popup">
        <i onclick="hidePopup()" class="fa-solid fa-x"></i><br>
        <div class="mini-header">STATISTICS</div>  
        <div class="play-win">  
            <div id="played" class="stat-box">
                ${userData["played"]}
                <div class="tiny-descriptor">Played</div>
            </div>
            <div id="win" class="stat-box">
                ${userData["winRate"]}
                <div class="tiny-descriptor">Win %</div>
            </div>
            <div id="currentStreak" class="stat-box">
                ${userData["currentStreak"]}
                <div class="tiny-descriptor">Current Streak</div>
            </div>
            <div id="maxStreak" class="stat-box">
                ${userData["maxStreak"]}
                <div class="tiny-descriptor">Max Streak</div>
            </div>
        </div>
        <div class="mini-header">GUESS DISTRIBUTION</div>  
        <div class="guess-distribution">
            <div class="frequency">
                1
                <div class="dark-bar${makeGreen(1)}" style="width:${getPixelWidth(1)}px;">
                    <div id="inOne" class="frequency-num">${userData["guessDistribution"][0]}</div>
                </div>
            </div>
            <div class="frequency">
                2
                <div class="dark-bar${makeGreen(2)}" style="width:${getPixelWidth(2)}px;">
                    <div id="inTwo" class="frequency-num">${userData["guessDistribution"][1]}</div>
                </div>
            </div>
            <div class="frequency">
                3
                <div class="dark-bar${makeGreen(3)}" style="width:${getPixelWidth(3)}px;">
                    <div id="inThree" class="frequency-num">${userData["guessDistribution"][2]}</div>
                </div>
            </div>
            <div class="frequency">
                4
                <div class="dark-bar${makeGreen(4)}" style="width:${getPixelWidth(4)}px;">
                    <div id="inFour" class="frequency-num">${userData["guessDistribution"][3]}</div>
                </div>
            </div>
            <div class="frequency">
                5
                <div class="dark-bar${makeGreen(5)}" style="width:${getPixelWidth(5)}px;">
                    <div id="inFive" class="frequency-num">${userData["guessDistribution"][4]}</div>
                </div>
            </div>
            <div class="frequency">
                6
                <div class="dark-bar${makeGreen(6)}" style="width:${getPixelWidth(6)}px;">
                    <div id="inSix" class="frequency-num">${userData["guessDistribution"][5]}</div>
                </div>
            </div>
        </div>
        <div onclick="playAgainRedirect()" class="play-again">Play Again</div>
        <div onclick="showDefinition()" class="play-again blue${definitionAvailable()}">Definition</div>
        <div id="def-here" class="definition"></div>
    </div>
    `;
}

function makeGreen(score){ //return the CSS class to make the most recent guessed score green
    if(score === userData["mostRecentScore"]){
        return ` green`;
    }
    return ``;
}

function getPixelWidth(score){ //returns the width in pixels of a specific guess distribution
    let pixels = Math.round((userData["guessDistribution"][score-1]/userData["played"])*100)*3; //each percentage is 3 pixels
    pixels += 30;
    return pixels;
}

function definitionAvailable(){ //returns the CSS class to hide the definition box in unfinished games
    if(success !== true){
        return ` hide`;
    }
    return ``;
}

async function showDefinition(){
    let word = getSecretString();
    wordDefinition = await getDefinition(word);
    document.getElementById("def-here").innerHTML = `
        <i onclick="hideDefinition()" class="fa-solid fa-x smaller-x"></i>
        <p class="definition-text">${wordDefinition}</p>
    `;
}

async function getDefinition(word){ //returns the definition of the given word according to Free Dictionary API
    let url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    try{
        let response = await fetch(url);
        let data = await response.text();
        data = JSON.parse(data);
        return word + ": " + data[0].meanings[0].definitions[0].definition;
    }catch(error){
        return "Sorry, something went wrong.";
    }
}

function hideDefinition(){
    document.getElementById("def-here").innerHTML = ``;
}

function getSecretString(){ //returns the secret as a string
    let answer = "";
    for(let i = 0; i < 5; i+=1){
        answer += secret[i];
    }
    return answer;
}

/*Starting a New Game*/

function playAgain(){ //performs actions necessary to play again including reinitializes variables, reseting the board, and changing the secret
    if(success === false){ //only activated by quitting
        updateData(7); //quitting = failing
    }
    hidePopup();
    guess = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""], 
        ["", "", "", "", ""]];
    localStorage.setItem("guess", JSON.stringify(guess));
    setActiveRow();
    activeColumn = 1;
    makeAllRows();
    secret = ["", "", "", "", ""];
    localStorage.setItem("secret", JSON.stringify(secret));
    setSecret();
    letters = {a: ["A",0], b: ["B",0], c: ["C",0],
    d: ["D",0], e: ["E",0], f: ["F",0], g: ["G",0], h: ["H",0],
    i: ["I",0], j: ["J",0], k: ["K",0], l: ["L",0], m: ["M",0],
    n: ["N",0], o: ["O",0], p: ["P",0], q: ["Q",0], r: ["R",0],
    s: ["S",0], t: ["T",0], u: ["U",0], v: ["V",0], w: ["W",0],
    x: ["X",0], y: ["Y",0], z: ["Z",0]};
    generateKeyboard();
    success = false;
}

function playAgainRedirect(){ //redirects a user to a new game or an are you sure popup if they're not done
    if(success === true){
        playAgain();
    }else{
        incompletePopup();
    }
}

function incompletePopup(){ //generates a popup asking whether or not a user wants to give up on the current secret
    document.getElementById("insert-here").innerHTML = `
    <div class="medium-popup"><br>
        <p class="text">Are you sure you don't want to keep trying?</p>
        <div onclick="hidePopup()" class="play-again less-margin">Keep Going</div>
        <div onclick="playAgain()" class="play-again give-up less-margin">Give Up</div>
    </div>`;
}

/*Rules*/

function showRules(){ //generates a popup showing the rules
    document.getElementById("insert-here").innerHTML = `
    <div class="popup bigger-popup">
        <i onclick="hidePopup()" class="fa-solid fa-x"></i><br>
        <div class="mini-header">HOW TO PLAY</div>  
        <p class="text">Figure out the secret word within six tries.</p>
        <p class="text">Guesses must be valid five-letter words. Press enter to submit your guess.</p>
        <p class="text">After each guess, the letters will change color to indicate the accuracy of your guess.</p>
        
        <div class="example-section">
            <div class=grey-line></div>
            <p class="text">EXAMPLES</p>
            <div class="tiny-row">
                <div class="tiny-sqaure tiny-green">C</div>
                <div class="tiny-sqaure">R</div>
                <div class="tiny-sqaure">A</div>
                <div class="tiny-sqaure">Z</div>
                <div class="tiny-sqaure">Y</div>
            </div>
            <p class="text">Green indicates that a letter is in the correct spot.</p>
            <div class="tiny-row">
                <div class="tiny-sqaure">P</div>
                <div class="tiny-sqaure tiny-yellow">L</div>
                <div class="tiny-sqaure">A</div>
                <div class="tiny-sqaure">N</div>
                <div class="tiny-sqaure">E</div>
            </div>
            <p class="text">Yellow reveals that a letter is in the word, but in a different spot.</p>
            <div class="tiny-row">
                <div class="tiny-sqaure">S</div>
                <div class="tiny-sqaure">C</div>
                <div class="tiny-sqaure">O</div>
                <div class="tiny-sqaure tiny-dark">U</div>
                <div class="tiny-sqaure">T</div>
            </div>
            <p class="text">Grey means that a letter does not appear in the word.</p>
        </div>
    </div>
    `;
}

/*Main*/
if(userData["played"] == 0){ //shows rules if a user is new
    showRules();
}

setSecret();
setActiveRow();
makeAllRows();
generateKeyboard();
setSucces();

document.addEventListener("keydown", action);