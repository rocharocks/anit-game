const quizQuestions = [
    {
        question: "What was Dr. Fauci's main message in the interview?",
        options: [
            "Wear a chicken suit to stay safe",
            "COVID-19 is a hoax",
            "Follow public health guidelines and get vaccinated",
            "The world will end next month"
        ],
        correctAnswer: 2 // The index of the correct answer in the options array
    },
    {
        question: "How did Dr. Fauci describe the current state of the pandemic?",
        options: [
            "Everything is back to normal",
            "We are making progress, but caution is still necessary",
            "Aliens are controlling the virus",
            "The pandemic never happened"
        ],
        correctAnswer: 1
    },
    {
        question: "What steps did Dr. Fauci recommend for individuals to protect themselves?",
        options: [
            "Dance in the rain every day",
            "Follow preventive measures like mask-wearing and vaccination",
            "Build a bunker underground",
            "Avoid all human contact permanently"
        ],
        correctAnswer: 1
    },
    {
        question: "What are the key differences between the current vaccines available?",
        options: [
            "Some vaccines turn you into a superhero",
            "Different vaccines have varying levels of efficacy and storage requirements",
            "One vaccine is a magic potion",
            "Vaccines are made from moon rocks"
        ],
        correctAnswer: 1
    },
    {
        question: "How did Dr. Fauci address concerns about vaccine safety?",
        options: [
            "He ignored the question",
            "By explaining the rigorous testing and approval process",
            "By saying it's a government experiment",
            "By recommending eating more vegetables"
        ],
        correctAnswer: 1
    },
    {
        question: "What new treatments did Dr. Fauci discuss during the interview?",
        options: [
            "Magic healing crystals",
            "New antiviral medications and monoclonal antibody treatments",
            "Drinking dragon's blood",
            "Using garlic and silver bullets"
        ],
        correctAnswer: 1
    },
    {
        question: "What advice did Dr. Fauci give for the upcoming flu season?",
        options: [
            "Hide in a cave",
            "Get the flu vaccine and follow COVID-19 precautions",
            "Eat more chocolate",
            "Wear sunglasses indoors"
        ],
        correctAnswer: 1
    },
    {
        question: "How did Dr. Fauci respond to questions about booster shots?",
        options: [
            "Booster shots are needed to enhance and prolong immunity",
            "Booster shots make you immune to everything",
            "Booster shots are unnecessary",
            "Booster shots are only for superheroes"
        ],
        correctAnswer: 0
    },
    {
        question: "What did Dr. Fauci say about the future of the pandemic?",
        options: [
            "The pandemic will end next week",
            "Continued vigilance is required to control the virus",
            "The pandemic is a myth",
            "The virus will disappear magically"
        ],
        correctAnswer: 1
    },
    {
        question: "How did Dr. Fauci respond to misinformation about COVID-19?",
        options: [
            "He danced to avoid answering",
            "By emphasizing the importance of following credible sources",
            "By saying misinformation is fun",
            "By encouraging people to ignore all news"
        ],
        correctAnswer: 1
    },
    {
        question: "What are the long-term effects of COVID-19 according to Dr. Fauci?",
        options: [
            "Turning into a zombie",
            "Potential long-term health issues like lung and heart problems",
            "Gaining superpowers",
            "Becoming immortal"
        ],
        correctAnswer: 1
    },
    {
        question: "How did Dr. Fauci describe the impact of COVID-19 on children?",
        options: [
            "Children are immune to COVID-19",
            "Children can get infected and develop serious complications",
            "COVID-19 makes children taller",
            "Children should not be worried at all"
        ],
        correctAnswer: 1
    },
    {
        question: "What measures did Dr. Fauci suggest for reopening schools safely?",
        options: [
            "Organizing school on the moon",
            "Implementing safety measures like masks, ventilation, and regular testing",
            "Giving every child a pet dragon",
            "Having school only outdoors"
        ],
        correctAnswer: 1
    },
    {
        question: "What did Dr. Fauci say about the importance of mask-wearing?",
        options: [
            "Masks make you invisible",
            "Masks are critical in reducing virus transmission",
            "Masks are unnecessary if you sing loudly",
            "Masks should be worn only at night"
        ],
        correctAnswer: 1
    },
    {
        question: "How did Dr. Fauci address the issue of vaccine hesitancy?",
        options: [
            "He suggested hypnosis",
            "By providing factual information and addressing concerns",
            "By saying it’s okay to be hesitant",
            "By ignoring the question"
        ],
        correctAnswer: 1
    },
    {
        question: "What progress did Dr. Fauci mention regarding new vaccine developments?",
        options: [
            "New vaccines are made from magic potions",
            "Development of vaccines for new variants and improving existing ones",
            "Vaccines that make you fly",
            "Vaccines are now available as candies"
        ],
        correctAnswer: 1
    },
    {
        question: "How did Dr. Fauci describe the collaboration between different health agencies?",
        options: [
            "Collaboration was done via telepathy",
            "Effective collaboration is crucial for a coordinated response",
            "Agencies are working independently without coordination",
            "Collaboration was non-existent"
        ],
        correctAnswer: 1
    },
    {
        question: "What did Dr. Fauci say about the impact of COVID-19 on mental health?",
        options: [
            "COVID-19 has no impact on mental health",
            "COVID-19 has significantly affected mental health and needs attention",
            "COVID-19 improves mental health",
            "COVID-19 makes you forget everything"
        ],
        correctAnswer: 1
    },
    {
        question: "How did Dr. Fauci suggest the public can stay informed about COVID-19 updates?",
        options: [
            "By reading ancient scrolls",
            "Following updates from credible sources like health departments and CDC",
            "By watching movies",
            "By ignoring the news"
        ],
        correctAnswer: 1
    },
    {
        question: "What were Dr. Fauci's final remarks and advice to the public?",
        options: [
            "Stay indoors forever",
            "Continue following public health measures and stay informed",
            "Do whatever you feel like",
            "Stop worrying about COVID-19"
        ],
        correctAnswer: 1
    }
];

function getRandomQuestions(count) {
    const shuffled = quizQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function startQuiz() {
    quizActive = true;
    correctAnswers = 0;
    const questions = getRandomQuestions(1);
    displayQuiz(questions);
}

function displayQuiz(questions) {
    const quizContainer = document.createElement('div');
    quizContainer.classList.add('quiz-container');
    document.body.appendChild(quizContainer);

    const message = document.createElement('p');
    message.textContent = "EARN AN EXTRA LIFE BY ANSWERING ONE QUESTION CORRECTLY!";
    quizContainer.appendChild(message);

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        quizContainer.appendChild(questionElement);

        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${question.question}`;
        questionElement.appendChild(questionText);

        question.options.forEach((option, i) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => handleAnswer(question.correctAnswer, i, quizContainer));
            questionElement.appendChild(optionButton);
        });
    });
}

function handleAnswer(correctAnswer, selectedAnswer, quizContainer) {
    if (correctAnswer === selectedAnswer) {
        player.lives++;
        const successMessage = document.createElement('p');
        successMessage.textContent = "YOU EARNED AN EXTRA LIFE!";
        quizContainer.appendChild(successMessage);
        setTimeout(() => {
            quizActive = false;
            quizContainer.remove();
        }, 2000);
    } else {
        quizActive = false;
        quizContainer.remove();
    }
}
