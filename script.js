// Game State
const gameState = {
    day: 0,
    cash: 500,
    savings: 0,
    creditBalance: 0,
    creditLimit: 1000,
    creditScore: 700,
    transactions: [],
    achievements: new Set(),
    consecutiveGoodDays: 0,
    difficulty: 'normal', // easy, normal, hard
    dailyGoal: null,
    goalCompleted: false
};

// Win/Lose Conditions
const LOSE_CONDITIONS = {
    CREDIT_SCORE_TOO_LOW: 400,
    BANKRUPTCY: -500, // Negative cash + high debt
    DEBT_TOO_HIGH: 1500 // Debt exceeds limit significantly
};

// Achievements
const achievements = {
    'SAVER': { name: 'Saver', desc: 'Save $200+ in savings account', unlocked: false },
    'DEBT_FREE': { name: 'Debt Free', desc: 'Pay off all credit card debt', unlocked: false },
    'EXCELLENT_CREDIT': { name: 'Excellent Credit', desc: 'Maintain 750+ credit score', unlocked: false },
    'RESIST_TEMPTATION': { name: 'Strong Will', desc: 'Skip 5 temptations', unlocked: false },
    'GOOD_STREAK': { name: 'On a Roll', desc: '5 consecutive good decisions', unlocked: false },
    'BUDGET_MASTER': { name: 'Budget Master', desc: 'Complete 3 daily goals', unlocked: false },
    'EMERGENCY_FUND': { name: 'Emergency Fund', desc: 'Save $500+ in savings', unlocked: false },
    'NO_INTEREST': { name: 'Interest Free', desc: 'Avoid all interest charges', unlocked: false }
};

// Event types
const eventTypes = {
    EXPENSE: 'Expense',
    TEMPTATION: 'Temptation',
    INCOME: 'Income',
    INTEREST: 'Interest Charge',
    EMERGENCY: 'Emergency',
    BONUS: 'Bonus',
    OPPORTUNITY: 'Opportunity'
};

// Events pool
const events = [
    // Expenses
    {
        type: eventTypes.EXPENSE,
        title: 'Ugh, Textbooks...',
        description: 'Your professor just announced you need the new edition of the textbook. Of course it\'s $120 and you can\'t use the old one. Classic move.',
        cost: 120,
        options: [
            { text: 'Use cash (ouch)', action: 'cash', impact: { cash: -120 } },
            { text: 'Put it on the card (future me problem)', action: 'credit', impact: { creditBalance: 120, creditScore: -5 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Lab Supplies',
        description: 'Chemistry lab needs you to buy goggles, a lab coat, and some other stuff. Total comes to $45. At least you\'ll look like a real scientist?',
        cost: 45,
        options: [
            { text: 'Pay cash', action: 'cash', impact: { cash: -45 } },
            { text: 'Credit card it', action: 'credit', impact: { creditBalance: 45, creditScore: -2 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Meal Plan Renewal',
        description: 'Time to pay for your meal plan again. $200 for another month of dining hall food. At least you won\'t starve?',
        cost: 200,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -200 } },
            { text: 'Put it on the card', action: 'credit', impact: { creditBalance: 200, creditScore: -8 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Parking Permit',
        description: 'You need a parking permit to avoid getting tickets. It\'s $75 and honestly feels like a scam, but what can you do?',
        cost: 75,
        options: [
            { text: 'Pay cash', action: 'cash', impact: { cash: -75 } },
            { text: 'Credit card', action: 'credit', impact: { creditBalance: 75, creditScore: -3 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Printing Credits',
        description: 'You\'re out of printing credits and need to print your essay. $25 to refill. Why is printing so expensive in 2024?',
        cost: 25,
        options: [
            { text: 'Pay cash', action: 'cash', impact: { cash: -25 } },
            { text: 'Use card', action: 'credit', impact: { creditBalance: 25, creditScore: -1 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Gym Membership',
        description: 'The campus gym wants $50 for the month. You keep telling yourself you\'ll actually go this time...',
        cost: 50,
        options: [
            { text: 'Pay cash (maybe I\'ll go?)', action: 'cash', impact: { cash: -50 } },
            { text: 'Card it', action: 'credit', impact: { creditBalance: 50, creditScore: -2 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Software License',
        description: 'Your CS professor says you need this specific software license. It\'s $90 and you\'re pretty sure there\'s a free alternative, but...',
        cost: 90,
        options: [
            { text: 'Pay cash', action: 'cash', impact: { cash: -90 } },
            { text: 'Credit card', action: 'credit', impact: { creditBalance: 90, creditScore: -4 } }
        ]
    },
    // Temptations
    {
        type: eventTypes.TEMPTATION,
        title: 'Concert Alert',
        description: 'Your favorite artist is playing nearby and tickets are only $80! Your friends are all going. You could totally make it work... right?',
        cost: 80,
        options: [
            { text: 'Nah, I\'ll pass (adulting mode)', action: 'skip', impact: { creditScore: 5 }, isGood: true },
            { text: 'YOLO, pay cash', action: 'cash', impact: { cash: -80 } },
            { text: 'Put it on the card (no regrets)', action: 'credit', impact: { creditBalance: 80, creditScore: -10 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'New Gaming Console',
        description: 'The new console just dropped and it\'s on sale for $300! All your friends are getting it and you\'re feeling left out. Your current one still works though...',
        cost: 300,
        options: [
            { text: 'Skip it (be responsible)', action: 'skip', impact: { creditScore: 8 }, isGood: true },
            { text: 'Buy it with cash', action: 'cash', impact: { cash: -300 } },
            { text: 'Credit card it (bad idea but...)', action: 'credit', impact: { creditBalance: 300, creditScore: -15 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'Those Sneakers',
        description: 'Those limited edition sneakers you\'ve been stalking online are finally in stock! $150 and they\'ll probably sell out in minutes. Your current shoes are fine but...',
        cost: 150,
        options: [
            { text: 'Nope, not today (wise choice)', action: 'skip', impact: { creditScore: 5 }, isGood: true },
            { text: 'Treat myself with cash', action: 'cash', impact: { cash: -150 } },
            { text: 'Card it (future me will understand)', action: 'credit', impact: { creditBalance: 150, creditScore: -12 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'Weekend Getaway',
        description: 'Your friends are planning a spontaneous weekend trip and want you to come! It\'ll be around $200 for your share. You have that paper due Monday though...',
        cost: 200,
        options: [
            { text: 'Stay home (adult decision)', action: 'skip', impact: { creditScore: 5 }, isGood: true },
            { text: 'Go! Pay cash', action: 'cash', impact: { cash: -200 } },
            { text: 'Go! Put it on the card', action: 'credit', impact: { creditBalance: 200, creditScore: -10 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'Fancy Dinner',
        description: 'Your friends want to try that new restaurant everyone\'s talking about. Your share is $60. Dining hall food is free though...',
        cost: 60,
        options: [
            { text: 'Pass, dining hall it is', action: 'skip', impact: { creditScore: 3 }, isGood: true },
            { text: 'Sure, pay cash', action: 'cash', impact: { cash: -60 } },
            { text: 'Why not, card it', action: 'credit', impact: { creditBalance: 60, creditScore: -5 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'New Laptop Temptation',
        description: 'That new laptop is on sale for $800 and it looks so nice... Your current one is slow but still works. Do you really need it?',
        cost: 800,
        options: [
            { text: 'Nah, mine\'s fine (smart move)', action: 'skip', impact: { creditScore: 10 }, isGood: true },
            { text: 'Buy it with cash', action: 'cash', impact: { cash: -800 } },
            { text: 'Put it on the card (risky!)', action: 'credit', impact: { creditBalance: 800, creditScore: -20 } }
        ]
    },
    // Emergencies
    {
        type: eventTypes.EMERGENCY,
        title: 'Unexpected Medical Bill',
        description: 'You had to go to the campus health center (nothing serious, don\'t worry!). The bill came to $150. Oof.',
        cost: 150,
        options: [
            { text: 'Pay cash', action: 'cash', impact: { cash: -150 } },
            { text: 'Put it on the card', action: 'credit', impact: { creditBalance: 150, creditScore: -3 } }
        ]
    },
    {
        type: eventTypes.EMERGENCY,
        title: 'Phone Screen Disaster',
        description: 'You dropped your phone and the screen is completely shattered. Repair is $100. This is why we can\'t have nice things...',
        cost: 100,
        options: [
            { text: 'Pay cash', action: 'cash', impact: { cash: -100 } },
            { text: 'Card it', action: 'credit', impact: { creditBalance: 100, creditScore: -3 } }
        ]
    },
    {
        type: eventTypes.EMERGENCY,
        title: 'Car Trouble',
        description: 'Your car started making weird noises and the mechanic says it needs $250 in repairs. Can\'t really avoid this one...',
        cost: 250,
        options: [
            { text: 'Pay cash', action: 'cash', impact: { cash: -250 } },
            { text: 'Use the card', action: 'credit', impact: { creditBalance: 250, creditScore: -5 } }
        ]
    },
    {
        type: eventTypes.EMERGENCY,
        title: 'Laptop Died',
        description: 'Your laptop just blue-screened and won\'t turn back on. The repair shop says it\'ll be $180 to fix. You need this for class!',
        cost: 180,
        options: [
            { text: 'Pay cash', action: 'cash', impact: { cash: -180 } },
            { text: 'Card it', action: 'credit', impact: { creditBalance: 180, creditScore: -4 } }
        ]
    },
    // Income
    {
        type: eventTypes.INCOME,
        title: 'Paycheck',
        description: 'Your part-time job paycheck just hit! $200 for all those hours you worked. Time to decide what to do with it.',
        cost: -200,
        options: [
            { text: 'Add to my account', action: 'income', impact: { cash: 200 } }
        ]
    },
    {
        type: eventTypes.INCOME,
        title: 'Birthday Money',
        description: 'Your family sent you $100 for your birthday! They know you need it. Thanks, fam!',
        cost: -100,
        options: [
            { text: 'Add to account', action: 'income', impact: { cash: 100 } }
        ]
    },
    {
        type: eventTypes.INCOME,
        title: 'Tutoring Money',
        description: 'You helped a classmate with calculus and they paid you $75! Side hustle paying off.',
        cost: -75,
        options: [
            { text: 'Add to account', action: 'income', impact: { cash: 75 } }
        ]
    },
    {
        type: eventTypes.INCOME,
        title: 'Freelance Project Done!',
        description: 'You finished that freelance project you\'ve been working on and got paid $150! Nice work!',
        cost: -150,
        options: [
            { text: 'Add to account', action: 'income', impact: { cash: 150 } }
        ]
    },
    // Opportunities
    {
        type: eventTypes.OPPORTUNITY,
        title: 'Weekend Gig Opportunity',
        description: 'Your friend has a weekend gig that pays $120. It\'ll take up your Saturday, but that\'s decent money for a day\'s work.',
        cost: -120,
        options: [
            { text: 'Yeah, I\'ll take it!', action: 'income', impact: { cash: 120 }, isGood: true },
            { text: 'Nah, I need a break', action: 'skip', impact: {} }
        ]
    },
    {
        type: eventTypes.OPPORTUNITY,
        title: 'Scholarship Opportunity',
        description: 'There\'s a $300 scholarship you could apply for! It\'ll take some time to write the essay, but free money is free money, right?',
        cost: -300,
        options: [
            { text: 'Apply for it!', action: 'income', impact: { cash: 300, creditScore: 5 }, isGood: true },
            { text: 'Too busy, skip it', action: 'skip', impact: {} }
        ]
    },
    // Bonuses
    {
        type: eventTypes.BONUS,
        title: 'Found Money',
        description: 'You found $50 in an old jacket pocket! Score! This is like finding money in the laundry, but better.',
        cost: -50,
        options: [
            { text: 'Add to account', action: 'income', impact: { cash: 50 } }
        ]
    },
    {
        type: eventTypes.BONUS,
        title: 'Cashback Reward!',
        description: 'Your credit card company just gave you a $25 cashback reward! They noticed you\'ve been responsible. Nice!',
        cost: -25,
        options: [
            { text: 'Add to account', action: 'income', impact: { cash: 25, creditScore: 2 } }
        ]
    }
];

// DOM Elements
const dayEl = document.getElementById('day');
const cashEl = document.getElementById('cash');
const savingsEl = document.getElementById('savings');
const balanceEl = document.getElementById('balance');
const creditScoreEl = document.getElementById('creditScore');
const scoreChangeEl = document.getElementById('scoreChange');
const eventCardEl = document.getElementById('eventCard');
const eventTypeEl = document.getElementById('eventType');
const eventDayEl = document.getElementById('eventDay');
const eventTitleEl = document.getElementById('eventTitle');
const eventDescriptionEl = document.getElementById('eventDescription');
const eventOptionsEl = document.getElementById('eventOptions');
const nextDayBtn = document.getElementById('nextDayBtn');
const logEntriesEl = document.getElementById('logEntries');
const gameOverEl = document.getElementById('gameOver');
const gameOverTitleEl = document.getElementById('gameOverTitle');
const gameOverContentEl = document.getElementById('gameOverContent');
const finalScoreEl = document.getElementById('finalScore');
const finalBalanceEl = document.getElementById('finalBalance');
const finalSavingsEl = document.getElementById('finalSavings');
const finalMessageEl = document.getElementById('finalMessage');
const finalAchievementsEl = document.getElementById('finalAchievements');
const restartBtn = document.getElementById('restartBtn');
const payDebtBtn = document.getElementById('payDebtBtn');
const achievementsListEl = document.getElementById('achievementsList');
const dailyGoalEl = document.getElementById('dailyGoal');
const goalTextEl = document.getElementById('goalText');
const goalRewardEl = document.getElementById('goalReward');
const difficultyBtn = document.getElementById('difficultyBtn');
const notificationEl = document.getElementById('notification');

let skippedTemptations = 0;
let goodDecisions = 0;
let goalsCompleted = 0;
let interestCharges = 0;

// Initialize game
function initGame() {
    gameState.day = 0;
    gameState.cash = 500;
    gameState.savings = 0;
    gameState.creditBalance = 0;
    gameState.creditScore = 700;
    gameState.transactions = [];
    gameState.achievements.clear();
    gameState.consecutiveGoodDays = 0;
    gameState.dailyGoal = null;
    gameState.goalCompleted = false;
    
    skippedTemptations = 0;
    goodDecisions = 0;
    goalsCompleted = 0;
    interestCharges = 0;
    
    updateUI();
    updateAchievements();
    logEntriesEl.innerHTML = '';
    gameOverEl.style.display = 'none';
    nextDayBtn.textContent = 'Let\'s Go!';
    nextDayBtn.disabled = false;
    payDebtBtn.style.display = 'none';
    dailyGoalEl.style.display = 'none';
}

// Update UI
function updateUI() {
    dayEl.textContent = gameState.day;
    cashEl.textContent = `$${gameState.cash}`;
    savingsEl.textContent = `$${gameState.savings}`;
    balanceEl.textContent = `$${gameState.creditBalance}`;
    creditScoreEl.textContent = gameState.creditScore;
    
    // Show/hide pay debt button
    if (gameState.creditBalance > 0 && gameState.cash > 0) {
        payDebtBtn.style.display = 'block';
    } else {
        payDebtBtn.style.display = 'none';
    }
    
    // Add pulse animation
    [cashEl, savingsEl, balanceEl, creditScoreEl].forEach(el => {
        el.classList.add('updated');
        setTimeout(() => el.classList.remove('updated'), 500);
    });
    
    // Check for lose conditions
    checkLoseConditions();
}

// Check lose conditions
function checkLoseConditions() {
    if (gameState.creditScore < LOSE_CONDITIONS.CREDIT_SCORE_TOO_LOW) {
        loseGame('Yikes... your credit score dropped below 400. Banks are basically ghosting you now. Maybe try again and make better choices?');
        return;
    }
    
    if (gameState.cash < LOSE_CONDITIONS.BANKRUPTCY && gameState.creditBalance > gameState.creditLimit) {
        loseGame('Well, you\'ve officially gone broke. Your debt is way more than you can handle. Time to call it quits and try again!');
        return;
    }
    
    if (gameState.creditBalance > LOSE_CONDITIONS.DEBT_TOO_HIGH) {
        loseGame('Your debt got completely out of hand! You\'re drowning in it now. Maybe next time be a bit more careful?');
        return;
    }
}

// Lose game
function loseGame(message) {
    gameOverEl.style.display = 'flex';
    gameOverTitleEl.textContent = 'Game Over';
    gameOverContentEl.classList.add('lose');
    gameOverContentEl.classList.remove('win');
    finalScoreEl.textContent = gameState.creditScore;
    finalBalanceEl.textContent = `$${gameState.creditBalance}`;
    finalSavingsEl.textContent = `$${gameState.savings}`;
    finalMessageEl.textContent = message;
    finalMessageEl.style.color = '#f5576c';
    showFinalAchievements();
}

// Calculate credit score change
function calculateCreditScoreChange() {
    const utilization = (gameState.creditBalance / gameState.creditLimit) * 100;
    let change = 0;
    
    // High utilization hurts credit score
    if (utilization > 80) {
        change -= 10;
    } else if (utilization > 50) {
        change -= 5;
    } else if (utilization > 30) {
        change -= 2;
    }
    
    // Low utilization helps
    if (utilization < 10 && gameState.creditBalance > 0) {
        change += 2;
    }
    
    return change;
}

// Apply interest charges
function applyInterest() {
    if (gameState.creditBalance > 0) {
        const monthlyRate = gameState.difficulty === 'easy' ? 0.015 : gameState.difficulty === 'hard' ? 0.03 : 0.02;
        const interest = Math.round(gameState.creditBalance * monthlyRate);
        gameState.creditBalance += interest;
        interestCharges++;
        
        addTransaction({
            type: eventTypes.INTEREST,
            description: `Monthly interest charge (${(monthlyRate * 100).toFixed(1)}%): $${interest}`,
            amount: interest,
            class: 'interest'
        });
    }
}

// Pay off debt
function payOffDebt() {
    if (gameState.creditBalance === 0) {
        showNotification('You\'re already debt-free! Nice!', 'success');
        return;
    }
    
    const amount = Math.min(gameState.cash, gameState.creditBalance);
    if (amount === 0) {
        showNotification('Oops, you don\'t have enough cash right now.', 'error');
        return;
    }
    
    gameState.cash -= amount;
    gameState.creditBalance -= amount;
    gameState.creditScore += Math.min(10, Math.floor(amount / 50)); // Bonus for paying debt
    
    addTransaction({
        type: 'Payment',
        description: `Paid $${amount} towards credit card debt`,
        amount: -amount,
        class: 'income'
    });
    
    showNotification(`Nice! Paid $${amount} off your debt. Your credit score is looking better!`, 'success');
    checkAchievement('DEBT_FREE');
    updateUI();
}

// Add to savings
function addToSavings(amount) {
    if (amount > gameState.cash) {
        showNotification('Insufficient cash!', 'error');
        return;
    }
    
    gameState.cash -= amount;
    gameState.savings += amount;
    gameState.creditScore += 2; // Small boost for saving
    
    addTransaction({
        type: 'Savings',
        description: `Deposited $${amount} to savings`,
        amount: -amount,
        class: 'income'
    });
    
    showNotification(`Sweet! You just saved $${amount}. Future you will thank you!`, 'success');
    checkAchievement('SAVER');
    checkAchievement('EMERGENCY_FUND');
    updateUI();
}

// Withdraw from savings
function withdrawFromSavings(amount) {
    if (amount > gameState.savings) {
        showNotification('Insufficient savings!', 'error');
        return;
    }
    
    gameState.savings -= amount;
    gameState.cash += amount;
    
    addTransaction({
        type: 'Savings',
        description: `Withdrew $${amount} from savings`,
        amount: amount,
        class: 'expense'
    });
    
    updateUI();
}

// Add transaction to log
function addTransaction(transaction) {
    gameState.transactions.push(transaction);
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${transaction.class || ''}`;
    entry.innerHTML = `
        <div><strong>${transaction.type}</strong></div>
        <div>${transaction.description}</div>
        <div class="log-amount">${transaction.amount > 0 ? '+' : ''}$${transaction.amount}</div>
    `;
    
    logEntriesEl.insertBefore(entry, logEntriesEl.firstChild);
}

// Show notification
function showNotification(message, type = 'success') {
    notificationEl.textContent = message;
    notificationEl.className = `notification ${type} show`;
    setTimeout(() => {
        notificationEl.classList.remove('show');
    }, 3000);
}

// Check achievements
function checkAchievement(key) {
    if (gameState.achievements.has(key)) return;
    
    let unlocked = false;
    
    switch(key) {
        case 'SAVER':
            unlocked = gameState.savings >= 200;
            break;
        case 'DEBT_FREE':
            unlocked = gameState.creditBalance === 0 && gameState.transactions.some(t => t.type === 'Payment');
            break;
        case 'EXCELLENT_CREDIT':
            unlocked = gameState.creditScore >= 750;
            break;
        case 'RESIST_TEMPTATION':
            unlocked = skippedTemptations >= 5;
            break;
        case 'GOOD_STREAK':
            unlocked = gameState.consecutiveGoodDays >= 5;
            break;
        case 'BUDGET_MASTER':
            unlocked = goalsCompleted >= 3;
            break;
        case 'EMERGENCY_FUND':
            unlocked = gameState.savings >= 500;
            break;
        case 'NO_INTEREST':
            unlocked = interestCharges === 0 && gameState.day >= 30;
            break;
    }
    
    if (unlocked) {
        gameState.achievements.add(key);
        showNotification(`Achievement Unlocked: ${achievements[key].name}! You're doing great!`, 'achievement');
        updateAchievements();
    }
}

// Update achievements display
function updateAchievements() {
    achievementsListEl.innerHTML = '';
    Object.keys(achievements).forEach(key => {
        const achievement = achievements[key];
        const div = document.createElement('div');
        div.className = `achievement ${gameState.achievements.has(key) ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
            <span>${gameState.achievements.has(key) ? '✓' : '○'}</span>
            <span>${achievement.name}</span>
        `;
        achievementsListEl.appendChild(div);
    });
}

// Generate daily goal
function generateDailyGoal() {
    const goals = [
        { text: 'Keep your credit card usage under 30% today', check: () => (gameState.creditBalance / gameState.creditLimit) * 100 < 30, reward: '$50 + 5 credit score' },
        { text: 'Save at least $50 today (future you will thank you!)', check: () => {
            const savedToday = gameState.transactions.filter(t => t.type === 'Savings' && t.description.includes('Deposited')).reduce((sum, t) => sum + Math.abs(t.amount), 0);
            return savedToday >= 50;
        }, reward: '$75 + 3 credit score' },
        { text: 'Make a smart money move today', check: () => gameState.consecutiveGoodDays > 0, reward: '$30 + 2 credit score' },
        { text: 'Don\'t touch that credit card today', check: () => {
            const today = gameState.transactions.filter(t => t.description.includes('credit card'));
            return today.length === 0;
        }, reward: '$40 + 4 credit score' }
    ];
    
    const goal = goals[Math.floor(Math.random() * goals.length)];
    gameState.dailyGoal = goal;
    dailyGoalEl.style.display = 'block';
    goalTextEl.textContent = goal.text;
    goalRewardEl.textContent = `Reward: ${goal.reward}`;
    gameState.goalCompleted = false;
}

// Check daily goal
function checkDailyGoal() {
    if (!gameState.dailyGoal || gameState.goalCompleted) return;
    
    if (gameState.dailyGoal.check()) {
        gameState.goalCompleted = true;
        goalsCompleted++;
        const reward = 50; // Base reward
        gameState.cash += reward;
        gameState.creditScore += 5;
        showNotification(`Daily goal crushed! You got $${reward} and your credit score went up by 5!`, 'success');
        checkAchievement('BUDGET_MASTER');
        dailyGoalEl.style.display = 'none';
    }
}

// Handle option selection
function handleOption(option, event) {
    // Check if credit limit would be exceeded
    if (option.action === 'credit') {
        const newBalance = gameState.creditBalance + event.cost;
        if (newBalance > gameState.creditLimit) {
            showNotification('Whoa there! Your credit limit says no. Can\'t make this purchase on the card.', 'error');
            return;
        }
    }
    
    // Check if cash is sufficient
    if (option.action === 'cash' && gameState.cash < event.cost) {
        showNotification('Not enough cash! You\'ll need to use your card or skip this one.', 'error');
        return;
    }
    
    // Track good decisions
    if (option.isGood) {
        gameState.consecutiveGoodDays++;
        goodDecisions++;
        checkAchievement('GOOD_STREAK');
    } else if (option.action === 'credit' && event.type === eventTypes.TEMPTATION) {
        gameState.consecutiveGoodDays = 0;
    }
    
    // Track skipped temptations
    if (option.action === 'skip' && event.type === eventTypes.TEMPTATION) {
        skippedTemptations++;
        checkAchievement('RESIST_TEMPTATION');
    }
    
    // Apply impacts
    if (option.impact.cash !== undefined) {
        gameState.cash += option.impact.cash;
    }
    if (option.impact.creditBalance !== undefined) {
        gameState.creditBalance += option.impact.creditBalance;
    }
    if (option.impact.creditScore !== undefined) {
        gameState.creditScore = Math.max(300, Math.min(850, gameState.creditScore + option.impact.creditScore));
    }
    if (option.impact.savings !== undefined) {
        gameState.savings += option.impact.savings;
    }
    
    // Add transaction log
    if (option.action !== 'skip') {
        const amount = option.action === 'cash' ? -event.cost : event.cost;
        addTransaction({
            type: event.type,
            description: `${event.title}: ${option.text}`,
            amount: amount,
            class: option.action === 'cash' ? 'expense' : 'expense'
        });
    } else {
        addTransaction({
            type: event.type,
            description: `${event.title}: Skipped`,
            amount: 0,
            class: 'income'
        });
    }
    
    // Update credit score based on utilization
    const utilizationChange = calculateCreditScoreChange();
    if (utilizationChange !== 0) {
        gameState.creditScore = Math.max(300, Math.min(850, gameState.creditScore + utilizationChange));
    }
    
    updateUI();
    showScoreChange(option.impact.creditScore || 0);
    checkDailyGoal();
    checkAchievement('EXCELLENT_CREDIT');
    
    // Hide options and show next day button
    eventOptionsEl.innerHTML = '';
    nextDayBtn.disabled = false;
    nextDayBtn.textContent = gameState.day < 30 ? `On to Day ${gameState.day + 1} →` : 'Finish the Month';
}

// Show credit score change
function showScoreChange(change) {
    if (change !== 0) {
        scoreChangeEl.textContent = change > 0 ? `+${change}` : `${change}`;
        scoreChangeEl.style.color = change > 0 ? '#4facfe' : '#f5576c';
        setTimeout(() => {
            scoreChangeEl.textContent = '';
        }, 2000);
    }
}

// Show event
function showEvent(event) {
    eventTypeEl.textContent = event.type;
    eventDayEl.textContent = gameState.day;
    eventTitleEl.textContent = event.title;
    eventDescriptionEl.textContent = event.description;
    
    eventOptionsEl.innerHTML = '';
    event.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        
        if (option.action === 'skip' || option.isGood) {
            btn.classList.add('success');
        } else if (option.action === 'credit' && event.type === eventTypes.TEMPTATION) {
            btn.classList.add('danger');
        }
        
        btn.textContent = option.text;
        btn.onclick = () => handleOption(option, event);
        eventOptionsEl.appendChild(btn);
    });
    
    // Add savings options if applicable
    if (gameState.cash > 0 && (event.type === eventTypes.INCOME || event.type === eventTypes.BONUS)) {
        const saveBtn = document.createElement('button');
        saveBtn.className = 'option-btn success';
        saveBtn.textContent = `Put $${Math.min(50, gameState.cash)} in savings (be smart!)`;
        saveBtn.onclick = () => {
            const amount = Math.min(50, gameState.cash);
            addToSavings(amount);
            eventOptionsEl.innerHTML = '';
            nextDayBtn.disabled = false;
        };
        eventOptionsEl.appendChild(saveBtn);
    }
}

// Get random event
function getRandomEvent() {
    let availableEvents = [...events];
    
    // Adjust based on difficulty
    if (gameState.difficulty === 'easy') {
        availableEvents = availableEvents.filter(e => e.type !== eventTypes.EMERGENCY || Math.random() > 0.3);
    } else if (gameState.difficulty === 'hard') {
        // More emergencies and temptations
        if (Math.random() < 0.3) {
            availableEvents = availableEvents.filter(e => e.type === eventTypes.EMERGENCY || e.type === eventTypes.TEMPTATION);
        }
    }
    
    // More income events early in the month
    if (gameState.day <= 10) {
        availableEvents = availableEvents.filter(e => e.type === eventTypes.INCOME || 
            e.type === eventTypes.EXPENSE || e.type === eventTypes.TEMPTATION || e.type === eventTypes.OPPORTUNITY);
    }
    
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

// Next day
function nextDay() {
    if (gameState.day >= 30) {
        endGame();
        return;
    }
    
    gameState.day++;
    updateUI();
    
    // Apply interest on day 15 and 30
    if (gameState.day === 15 || gameState.day === 30) {
        applyInterest();
    }
    
    // Generate daily goal (30% chance)
    if (Math.random() < 0.3) {
        generateDailyGoal();
    }
    
    // Show event
    const event = getRandomEvent();
    showEvent(event);
    
    nextDayBtn.disabled = true;
    nextDayBtn.textContent = gameState.day < 30 ? `On to Day ${gameState.day + 1} →` : 'Finish the Month';
}

// End game
function endGame() {
    // Check all achievements one last time
    checkAchievement('EXCELLENT_CREDIT');
    checkAchievement('NO_INTEREST');
    
    gameOverEl.style.display = 'flex';
    const isWin = gameState.creditScore >= 650 && gameState.creditBalance <= gameState.creditLimit;
    
    gameOverTitleEl.textContent = isWin ? 'You Made It!' : 'Month\'s Over';
    gameOverContentEl.classList.remove('lose');
    gameOverContentEl.classList.add(isWin ? 'win' : '');
    
    finalScoreEl.textContent = gameState.creditScore;
    finalBalanceEl.textContent = `$${gameState.creditBalance}`;
    finalSavingsEl.textContent = `$${gameState.savings}`;
    
    let message = '';
    if (gameState.creditScore >= 750) {
        message = 'Wow! You crushed it! Your credit score is amazing. You\'re basically a financial wizard!';
    } else if (gameState.creditScore >= 700) {
        message = 'Nice work! You kept your credit score solid. You\'re doing pretty well at this adulting thing!';
    } else if (gameState.creditScore >= 650) {
        message = 'Not too shabby! Your credit score is okay, but there\'s room to improve. Maybe watch that credit card usage a bit more?';
    } else {
        message = 'Oof, your credit score took some hits. Remember: only use credit when you really need it, and pay it off fast!';
    }
    
    if (gameState.creditBalance > 0) {
        message += ` You still owe $${gameState.creditBalance} on your card though...`;
    }
    
    if (gameState.savings > 0) {
        message += ` But hey, you saved $${gameState.savings}! That\'s awesome!`;
    }
    
    finalMessageEl.textContent = message;
    finalMessageEl.style.color = isWin ? '#4facfe' : '#666';
    showFinalAchievements();
}

// Show final achievements
function showFinalAchievements() {
    if (gameState.achievements.size > 0) {
        finalAchievementsEl.innerHTML = '<h4>Achievements Unlocked:</h4>';
        gameState.achievements.forEach(key => {
            const badge = document.createElement('span');
            badge.className = 'achievement-badge';
            badge.textContent = achievements[key].name;
            finalAchievementsEl.appendChild(badge);
        });
    }
}

// Toggle difficulty
function toggleDifficulty() {
    const difficulties = ['easy', 'normal', 'hard'];
    const currentIndex = difficulties.indexOf(gameState.difficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    gameState.difficulty = difficulties[nextIndex];
    
    const labels = { easy: 'Easy', normal: 'Normal', hard: 'Hard' };
    difficultyBtn.textContent = `Difficulty: ${labels[gameState.difficulty]}`;
    
    // Adjust starting values based on difficulty
    if (gameState.day === 0) {
        if (gameState.difficulty === 'easy') {
            gameState.cash = 700;
            gameState.creditLimit = 1500;
        } else if (gameState.difficulty === 'hard') {
            gameState.cash = 300;
            gameState.creditLimit = 800;
        } else {
            gameState.cash = 500;
            gameState.creditLimit = 1000;
        }
        updateUI();
    }
}

// Event listeners
nextDayBtn.addEventListener('click', nextDay);
restartBtn.addEventListener('click', () => {
    initGame();
});
payDebtBtn.addEventListener('click', payOffDebt);
difficultyBtn.addEventListener('click', toggleDifficulty);

// Initialize
initGame();
