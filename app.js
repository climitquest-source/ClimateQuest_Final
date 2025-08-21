// Game logic for Cli‑Mit Quest host screen.
// This script defines the questions pack, sets up the scoreboard and board,
// and handles user interactions for displaying questions and scoring teams.

// Data: Categories, questions, answers and values.
const PACK = {
  categories: [
    {
      name: "Waste Management",
      questions: [
        {
          value: 200,
          question: "What are three Rs for waste management?",
          answer: "Reuse, Reduce and Recycle"
        },
        {
          value: 400,
          question: "How does one dispose of batteries?",
          answer: "City of Toronto’s Drop‑off Depots or drop off on a community environment day"
        },
        {
          value: 600,
          question: "True or false: contaminated pizza boxes go in the green bin?",
          answer: "True"
        },
        {
          value: 800,
          question: "Which bin do coffee cups go in Toronto?",
          answer: "Green bin"
        },
        {
          value: 1000,
          question: "How should you deal with a small amount of used cooking oil?",
          answer: "Wipe with kitchen towels and leave the kitchen towels in the green bin"
        }
      ]
    },
    {
      name: "Prepare for Climate Emergencies",
      questions: [
        {
          value: 200,
          question: "Climate Crisis comes as a result of Global…",
          answer: "Warming"
        },
        {
          value: 400,
          question: "Which climate emergency often leads to ‘cooling centres’ being opened in cities?",
          answer: "Heatwaves"
        },
        {
          value: 600,
          question: "What is the largest source of electricity generated in Ontario today?",
          answer: "Nuclear"
        },
        {
          value: 800,
          question: "What is the safest place to shelter during a tornado?",
          answer: "A basement or an interior room on the lowest floor, away from windows."
        },
        {
          value: 1000,
          question: "Where should the downspouts connect to?",
          answer: "Disconnect to the city's sewer system; better at 2 metres away from the foundation"
        }
      ]
    },
    {
      name: "Community Gardens",
      questions: [
        {
          value: 200,
          question: "What is the best way to have a sustainable source of food in your community?",
          answer: "Community Gardens"
        },
        {
          value: 400,
          question: "What is called to add food scraps and yard waste back into the soil to enrich gardens?",
          answer: "Composting"
        },
        {
          value: 600,
          question: "What are the most common vegetables that grow in Community Gardens in Toronto? Name three:",
          answer: "Leafy greens like lettuce, kale, and swiss chard, as well as tomatoes, peppers, and beans. Root vegetables like beets and carrots are also popular choices. Additionally, cucumbers, squash, and zucchini are frequently cultivated"
        },
        {
          value: 800,
          question: "Can you give some examples of Community Gardens in the City of Toronto?",
          answer: "Wychwood Barns, MFRC Gardens, Eglinton Park Community Garden and the Rockcliffe Demonstration and Teaching Garden and Greenhouses. Other locations include Emmett Ave. Community Garden, New Horizons Community Garden, and Gate House Transformational Healing Garden."
        },
        {
          value: 1000,
          question: "What would you do if you were to start a Community Garden?",
          answer: "When considering a Community garden, key questions include site suitability (sunlight, soil, and space), resource availability (water, tools, and materials), and community engagement (participation, accessibility, and maintenance). Additionally, understanding the purpose of the garden (personal enjoyment, food production, or community building) and budgeting for its development are crucial"
        }
      ]
    },
    {
      name: "Sustainability",
      questions: [
        {
          value: 200,
          question: "Urban gardens also support biodiversity by attracting these important pollinators.",
          answer: "Bees"
        },
        {
          value: 400,
          question: "Growing food locally reduces greenhouse gases which results in a lower:",
          answer: "Carbon footprint"
        },
        {
          value: 600,
          question: "What are the top 3 green commute options?",
          answer: "Walking, biking, and using public transportation"
        },
        {
          value: 800,
          question: "The UN created these 17 goals in 2015 to guide global efforts toward a more sustainable future.",
          answer: "Sustainable Development Goals (SDGs)"
        },
        {
          value: 1000,
          question: "What type of economy focuses on designing out waste and keeping products and materials in use?",
          answer: "Circular Economy"
        }
      ]
    },
    {
      name: "Food Security",
      questions: [
        {
          value: 200,
          question: "True/False: Food Security entails that people don’t have access to affordable food sources?",
          answer: "False"
        },
        {
          value: 400,
          question: "What is the difference between ‘food insecurity’ and ‘hunger’?",
          answer: "Food insecurity is the lack of reliable access to sufficient, affordable, nutritious food; hunger is the physical sensation of not having enough food."
        },
        {
          value: 600,
          question: "What is Food Security?",
          answer: "Food security is defined as a situation that exists when all people, at all times, have physical, social and economic access to sufficient, safe and nutritious food that meets their dietary needs and food preferences for an active and healthy life."
        },
        {
          value: 800,
          question: "Which areas have potential food security challenges?",
          answer: "Inner City Suburbs, particularly Priority Investment Neighbourhoods (PINs)"
        },
        {
          value: 1000,
          question: "Which groups in the city are most prone to being food insecure?",
          answer: "The risk of food insecurity is higher for individuals and families that are racialized (especially Black people), are Indigenous, are part of the 2SLGBTQIA+ community, have a low income, receive social assistance such as Ontario Works or Ontario Disability Support Program, live with a disability, rent their home, live in households led by lone parents (especially female lone parents), or are new to Canada."
        }
      ]
    }
  ],
  final_question: {
    question: "This Canadian program, started in 2019, aims to reduce household food insecurity by improving access to healthy food for school‑aged children.",
    answer: "What is the Canada Food Policy / School Food Program?"
  }
};

// Team definitions: names and colours.
const TEAMS = [
  { name: "Green", color: "#2d6a4f", score: 0 },
  { name: "Blue", color: "#386fa4", score: 0 },
  { name: "Yellow", color: "#e9c46a", score: 0 },
  { name: "Red", color: "#e76f51", score: 0 }
];

// State variables
let currentQuestion = null;
let selectedTeamIdx = null;

// Initialize the game once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  buildScoreboard();
  buildBoard();
  setupModalHandlers();
});

// Build the scoreboard
function buildScoreboard() {
  const scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = '';
  TEAMS.forEach((team, index) => {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.dataset.teamIndex = index;
    card.innerHTML = `
      <div class="team-name" style="color:${team.color}">${team.name}</div>
      <div class="team-score" id="team-score-${index}">${team.score}</div>
    `;
    scoreboard.appendChild(card);
  });
}

// Build the board with categories and values
function buildBoard() {
  const board = document.getElementById('board');
  // Clear board
  board.innerHTML = '';
  // Create category headers
  PACK.categories.forEach((cat) => {
    const cell = document.createElement('div');
    cell.className = 'cell category';
    cell.textContent = cat.name;
    board.appendChild(cell);
  });
  // For each row of values (assuming all categories have the same number of questions)
  const numRows = PACK.categories[0].questions.length;
  for (let row = 0; row < numRows; row++) {
    PACK.categories.forEach((cat, col) => {
      const q = cat.questions[row];
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = q.value;
      cell.dataset.cat = col;
      cell.dataset.row = row;
      cell.addEventListener('click', () => openQuestion(cat, q, cell));
      board.appendChild(cell);
    });
  }
}

// Open a question in the modal
function openQuestion(category, questionObj, cellEl) {
  currentQuestion = { category, questionObj, cellEl };
  selectedTeamIdx = null;
  // Populate modal
  document.getElementById('modal-category').textContent = `${category.name} – ${questionObj.value} points`;
  document.getElementById('modal-question').textContent = questionObj.question;
  document.getElementById('modal-answer').textContent = questionObj.answer;
  document.getElementById('answer-block').classList.add('hidden');
  // Setup team select buttons
  const teamSelect = document.getElementById('team-select');
  teamSelect.innerHTML = '';
  TEAMS.forEach((team, idx) => {
    const btn = document.createElement('button');
    btn.className = 'team-button';
    btn.style.backgroundColor = team.color;
    btn.textContent = team.name;
    btn.addEventListener('click', () => {
      selectedTeamIdx = idx;
      // mark selected
      document.querySelectorAll('.team-button').forEach(el => el.classList.remove('selected'));
      btn.classList.add('selected');
    });
    teamSelect.appendChild(btn);
  });
  // Show modal
  document.getElementById('modal').classList.remove('hidden');
}

// Modal button handlers
function setupModalHandlers() {
  const showAnsBtn = document.getElementById('show-answer');
  const correctBtn = document.getElementById('correct-btn');
  const wrongBtn = document.getElementById('wrong-btn');
  const closeBtn = document.getElementById('close-btn');
  showAnsBtn.addEventListener('click', () => {
    document.getElementById('answer-block').classList.remove('hidden');
    showAnsBtn.disabled = true;
  });
  correctBtn.addEventListener('click', () => {
    if (currentQuestion && selectedTeamIdx !== null) {
      TEAMS[selectedTeamIdx].score += currentQuestion.questionObj.value;
      updateScores();
    }
    finishQuestion();
  });
  wrongBtn.addEventListener('click', () => {
    finishQuestion();
  });
  closeBtn.addEventListener('click', () => {
    finishQuestion(false);
  });
}

// Update the scoreboard UI
function updateScores() {
  TEAMS.forEach((team, idx) => {
    const el = document.getElementById(`team-score-${idx}`);
    if (el) {
      el.textContent = team.score;
    }
  });
}

// Finish a question: mark cell used and hide modal
function finishQuestion(markUsed = true) {
  if (currentQuestion) {
    if (markUsed && currentQuestion.cellEl) {
      currentQuestion.cellEl.classList.add('used');
      currentQuestion.cellEl.textContent = '';
    }
  }
  // Reset state
  currentQuestion = null;
  selectedTeamIdx = null;
  // Hide modal and reset answer button
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('show-answer').disabled = false;
}