# Guess and Learn Wordle Style 
See the working product here: https://indecisive613.github.io/  

## Overview
Guess and Learn Wordle Style is a game where users try to guess a 5-letter word within six tries. Guesses must be valid five-letter words. After each guess, the letters will change color to indicate the accuracy of the guess. Green means that a letter is in the correct spot. Yellow means that a letter is in the word but not in the right location. Grey means that the letter does not appear in the word.

## Description
Users new to the site are automatically shown the instructions, which can also be found by clicking the question mark in the top bar.
![image](https://user-images.githubusercontent.com/83597131/181023913-0ca7ae25-d394-4118-806e-e1ab9572925c.png)

Guesses can be entered either from the user's keyboard, or the keyboard provided onscreen.
![image](https://user-images.githubusercontent.com/83597131/181024468-9372fea2-8578-463c-8111-5573bb858c8f.png)

After hitting enter, the letters on the guessing area and the keyboard will change color to reflect the accuracy of the guess. 
![image](https://user-images.githubusercontent.com/83597131/181025123-98c01f36-4215-45e9-a1db-c7fc521656c5.png)

Once the user has correctly guessed the secret word, a message of congratulations appears at the top of the screen.
![image](https://user-images.githubusercontent.com/83597131/181025539-5480be93-dd4d-414d-ba9e-029786775aac.png)

Two seconds later, the statistics appear. The statistics can also be accessed from the bar chart symbol in the top bar.
![image](https://user-images.githubusercontent.com/83597131/181025886-3224676f-dcfb-49ce-b28d-95afb8682efb.png)

Pressing the clipboard icon copies the results to the user's clipboard in the following format:  
I guessed the word occur in 3/6 tries.

⬛🟨⬛⬛⬛  
⬛🟩🟨🟩🟩  
🟩🟩🟩🟩🟩  

Pressing 'Definition' shows the user the definition of the secret word.
![image](https://user-images.githubusercontent.com/83597131/181026023-a1e1ec79-d68f-4e67-9928-379fb3427478.png)

Pressing 'Play Again' after correctly guessing the secret will generate a new game with a new secret. If the user has not correctly guessed the secret word, there is an intermediate screen which asks the user if they are sure they would like to quit, and damage their statistics.
![image](https://user-images.githubusercontent.com/83597131/181027145-663655d4-3cc0-4a7c-b052-a3d398fdeecc.png)

If a word is not valid, the letters will remain uncolored and the user will get a message saying that their guess is invalid.
![image](https://user-images.githubusercontent.com/83597131/181028654-7a87c112-0ab1-474f-b2d3-6c9e2b1500a9.png)

When a user fails to guess the secret word within six tries, they are shown the correct answer in place of the congratulatory message.
![image](https://user-images.githubusercontent.com/83597131/181028848-6d015174-8f9d-45ae-9941-c19a6f649c06.png)

## Languages
This project uses HTML, CSS and JavaScript.

## Components
* index.html - Defines the web structure for webpage.
* main.js - Script that programs the behavior of index.html.
* data.js - Script containing wordBank, the list of possible secret words.
* style.css - Sytlesheet used for formatting.

## Credits  
Developer: Fiona Cheng  
Last edit: July 26, 2022  
