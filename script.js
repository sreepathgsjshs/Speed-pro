document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements

    const textDisplay = document.getElementById('text-display');

    const textInput = document.getElementById('text-input');

    const startBtn = document.getElementById('start-btn');

    const resetBtn = document.getElementById('reset-btn');

    const difficultySelect = document.getElementById('difficulty');

    const timeElement = document.getElementById('time');

    const wpmElement = document.getElementById('wpm');

    const accuracyElement = document.getElementById('accuracy');

    const levelElement = document.getElementById('level');

    const resultModal = document.getElementById('result-modal');

    const finalWpmElement = document.getElementById('final-wpm');

    const finalAccuracyElement = document.getElementById('final-accuracy');

    const finalTimeElement = document.getElementById('final-time');

    const closeModalBtn = document.getElementById('close-modal');

    // Game variables

    let timer;

    let timeLeft = 60;

    let isPlaying = false;

    let currentText = '';

    let currentCharIndex = 0;

    let correctChars = 0;

    let totalTypedChars = 0;

    let startTime;

    let level = 1;

    let mistakes = 0;

    let extraChars = 0;

    // Sample texts for different difficulty levels

    const sampleTexts = {

        easy: [

            "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",

            "Learning to type quickly and accurately is an essential skill in today's digital world. Practice makes perfect.",

            "The sun shines brightly in the clear blue sky. Birds are singing and the wind is gently blowing through the trees."

        ],

        medium: [

            "Touch typing is the ability to type without looking at the keyboard. This skill can significantly improve your typing speed and accuracy over time.",

            "Programming requires precise typing skills. Developers often need to type complex code with special characters and syntax.",

            "Effective communication in the digital age relies heavily on written text. Being able to type quickly allows you to express your thoughts more efficiently."

        ],

        hard: [

            "The pursuit of knowledge in the field of computer science demands proficiency in keyboarding. Algorithms, data structures, and computational theory all require precise documentation.",

            "According to research conducted by cognitive psychologists, the average typing speed for adults is approximately 40 words per minute. Professional typists often exceed 65-75 WPM.",

            "Quantum computing represents a paradigm shift in information processing. Unlike classical computers which use bits, quantum computers utilize qubits that can exist in superposition states."

        ],

        expert: [

            "Pneumonoultramicroscopicsilicovolcanoconiosis, a lung disease caused by inhaling very fine silicate or quartz dust, is often cited as the longest word in major dictionaries.",

            "The cryptographic protocol known as Transport Layer Security (TLS) employs sophisticated algorithms including elliptic-curve cryptography and advanced encryption standards.",

            "Neuroscientific studies utilizing functional magnetic resonance imaging (fMRI) have demonstrated that proficient typists exhibit decreased activation in the prefrontal cortex."

        ]

    };

    // Initialize the game

    function init() {

        textInput.value = '';

        currentCharIndex = 0;

        correctChars = 0;

        totalTypedChars = 0;

        mistakes = 0;

        extraChars = 0;

        timeLeft = 60;

        timeElement.textContent = timeLeft;

        wpmElement.textContent = '0';

        accuracyElement.textContent = '0';

        

        // Get random text based on difficulty

        const difficulty = difficultySelect.value;

        const texts = sampleTexts[difficulty];

        currentText = texts[Math.floor(Math.random() * texts.length)];

        

        // Display the text with highlighting

        renderText();

    }

    // Render the text with highlighting

    function renderText() {

        let html = '';

        

        currentText.split('').forEach((char, index) => {

            if (index < currentCharIndex) {

                const isCorrect = textInput.value[index] === currentText[index];

                const charClass = isCorrect ? 'correct' : 'incorrect';

                html += `<span class="${charClass}">${char}</span>`;

            } else if (index === currentCharIndex) {

                html += `<span class="current">${char}</span>`;

            } else {

                html += `<span>${char}</span>`;

            }

        });

        

        textDisplay.innerHTML = html;

        

        // Scroll to keep current character in view

        const currentCharElement = textDisplay.querySelector('.current');

        if (currentCharElement) {

            currentCharElement.scrollIntoView({

                behavior: 'smooth',

                block: 'center',

                inline: 'nearest'

            });

        }

    }

    // Start the game

    function startGame() {

        if (isPlaying) return;

        

        isPlaying = true;

        startBtn.disabled = true;

        resetBtn.disabled = false;

        textInput.disabled = false;

        textInput.focus();

        

        init();

        

        // Start timer

        startTime = new Date().getTime();

        timer = setInterval(updateTimer, 1000);

    }

    // Update timer

    function updateTimer() {

        timeLeft--;

        timeElement.textContent = timeLeft;

        

        if (timeLeft <= 0) {

            endGame();

        } else {

            // Update WPM and accuracy in real-time

            updateStats();

        }

    }

    // Update WPM and accuracy stats

    function updateStats() {

        const currentTime = new Date().getTime();

        const timeElapsed = (currentTime - startTime) / 60000; // in minutes

        

        // Calculate WPM (5 characters = 1 word)

        const wordsTyped = correctChars / 5;

        const wpm = Math.round(wordsTyped / timeElapsed) || 0;

        wpmElement.textContent = wpm;

        

        // Calculate accuracy (penalize for extra characters)

        const accuracy = totalTypedChars > 0 

            ? Math.round(((correctChars - extraChars) / totalTypedChars) * 100) 

            : 0;

        accuracyElement.textContent = Math.max(0, accuracy);

        

        // Update level based on performance

        updateLevel(wpm, accuracy);

    }

    // Update player level

    function updateLevel(wpm, accuracy) {

        let newLevel = 1;

        

        if (wpm >= 80 && accuracy >= 98) newLevel = 5;

        else if (wpm >= 60 && accuracy >= 95) newLevel = 4;

        else if (wpm >= 40 && accuracy >= 90) newLevel = 3;

        else if (wpm >= 20 && accuracy >= 80) newLevel = 2;

        

        if (newLevel > level) {

            level = newLevel;

            levelElement.textContent = level;

        }

    }

    // End the game

    function endGame() {

        clearInterval(timer);

        isPlaying = false;

        textInput.disabled = true;

        startBtn.disabled = false;

        

        // Calculate final stats

        const wpm = parseInt(wpmElement.textContent);

        const accuracy = parseInt(accuracyElement.textContent);

        

        // Show results

        showResults(wpm, accuracy, 60 - timeLeft);

    }

    // Show results modal

    function showResults(wpm, accuracy, timeTaken) {

        finalWpmElement.textContent = wpm;

        finalAccuracyElement.textContent = `${Math.max(0, accuracy)}%`;

        finalTimeElement.textContent = `${timeTaken}s`;

        

        resultModal.classList.add('active');

    }

    // Event Listeners

    startBtn.addEventListener('click', startGame);

    

    resetBtn.addEventListener('click', () => {

        clearInterval(timer);

        isPlaying = false;

        startBtn.disabled = false;

        resetBtn.disabled = true;

        textInput.disabled = true;

        init();

    });

    

    closeModalBtn.addEventListener('click', () => {

        resultModal.classList.remove('active');

    });

    

    textInput.addEventListener('input', (e) => {

        const inputValue = e.target.value;

        const inputLength = inputValue.length;

        

        // Handle backspace

        if (inputLength < currentCharIndex) {

            currentCharIndex = inputLength;

            renderText();

            return;

        }

        

        // Check for extra characters

        if (inputLength > currentText.length) {

            extraChars = inputLength - currentText.length;

            currentCharIndex = currentText.length;

            renderText();

            updateStats();

            return;

        }

        

        // Process each new character

        for (let i = currentCharIndex; i < inputLength; i++) {

            if (i < currentText.length) {

                if (inputValue[i] === currentText[i]) {

                    correctChars++;

                } else {

                    mistakes++;

                }

                totalTypedChars++;

            }

            currentCharIndex++;

        }

        

        renderText();

        updateStats();

        

        // Check if all text has been typed

        if (currentCharIndex >= currentText.length) {

            endGame();

        }

    });

    

    difficultySelect.addEventListener('change', () => {

        if (!isPlaying) {

            init();

        }

    });

    

    // Handle virtual keyboard on mobile devices

    textInput.addEventListener('focus', () => {

        if (isPlaying) {

            setTimeout(() => {

                const currentCharElement = textDisplay.querySelector('.current');

                if (currentCharElement) {

                    currentCharElement.scrollIntoView({

                        behavior: 'smooth',

                        block: 'center',

                        inline: 'nearest'

                    });

                }

            }, 300);

        }

    });

    

    // Initialize the game on load

    init();

});