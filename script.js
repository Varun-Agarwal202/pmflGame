// Game State
const gameState = {
    day: 0,
    cash: 500,
    creditBalance: 0,
    creditLimit: 1000,
    creditScore: 700,
    transactions: []
};

// Event types
const eventTypes = {
    EXPENSE: 'Expense',
    TEMPTATION: 'Temptation',
    INCOME: 'Income',
    INTEREST: 'Interest Charge',
    EMERGENCY: 'Emergency'
};

// Events pool
const events = [
    // Expenses
    {
        type: eventTypes.EXPENSE,
        title: 'Textbook Purchase',
        description: 'Your professor requires a new textbook for the course. It costs $120.',
        cost: 120,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -120 } },
            { text: 'Pay with credit card', action: 'credit', impact: { creditBalance: 120, creditScore: -5 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Lab Materials',
        description: 'You need to buy lab materials for your chemistry class. Cost: $45.',
        cost: 45,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -45 } },
            { text: 'Pay with credit card', action: 'credit', impact: { creditBalance: 45, creditScore: -2 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Meal Plan',
        description: 'Time to renew your meal plan for the month. It costs $200.',
        cost: 200,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -200 } },
            { text: 'Pay with credit card', action: 'credit', impact: { creditBalance: 200, creditScore: -8 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Parking Permit',
        description: 'You need a parking permit for the semester. Cost: $75.',
        cost: 75,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -75 } },
            { text: 'Pay with credit card', action: 'credit', impact: { creditBalance: 75, creditScore: -3 } }
        ]
    },
    {
        type: eventTypes.EXPENSE,
        title: 'Printing Credits',
        description: 'You need to add printing credits to your student account. Cost: $25.',
        cost: 25,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -25 } },
            { text: 'Pay with credit card', action: 'credit', impact: { creditBalance: 25, creditScore: -1 } }
        ]
    },
    // Temptations
    {
        type: eventTypes.TEMPTATION,
        title: 'Concert Tickets',
        description: 'Your favorite artist is performing nearby! Tickets are $80. Do you really need this?',
        cost: 80,
        options: [
            { text: 'Skip it - save money', action: 'skip', impact: { creditScore: 5 } },
            { text: 'Buy with cash', action: 'cash', impact: { cash: -80 } },
            { text: 'Buy with credit card', action: 'credit', impact: { creditBalance: 80, creditScore: -10 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'New Gaming Console',
        description: 'The latest gaming console is on sale for $300! Your friends are all getting it.',
        cost: 300,
        options: [
            { text: 'Skip it - not essential', action: 'skip', impact: { creditScore: 8 } },
            { text: 'Buy with cash', action: 'cash', impact: { cash: -300 } },
            { text: 'Buy with credit card', action: 'credit', impact: { creditBalance: 300, creditScore: -15 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'Designer Sneakers',
        description: 'Limited edition sneakers you\'ve been eyeing are available for $150.',
        cost: 150,
        options: [
            { text: 'Skip it - save money', action: 'skip', impact: { creditScore: 5 } },
            { text: 'Buy with cash', action: 'cash', impact: { cash: -150 } },
            { text: 'Buy with credit card', action: 'credit', impact: { creditBalance: 150, creditScore: -12 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'Weekend Trip',
        description: 'Your friends invite you on a weekend trip. Estimated cost: $200.',
        cost: 200,
        options: [
            { text: 'Skip it - focus on studies', action: 'skip', impact: { creditScore: 5 } },
            { text: 'Go and pay with cash', action: 'cash', impact: { cash: -200 } },
            { text: 'Go and pay with credit', action: 'credit', impact: { creditBalance: 200, creditScore: -10 } }
        ]
    },
    {
        type: eventTypes.TEMPTATION,
        title: 'Restaurant Dinner',
        description: 'Your friends want to go to an expensive restaurant. Your share: $60.',
        cost: 60,
        options: [
            { text: 'Skip it - eat at dining hall', action: 'skip', impact: { creditScore: 3 } },
            { text: 'Go and pay with cash', action: 'cash', impact: { cash: -60 } },
            { text: 'Go and pay with credit', action: 'credit', impact: { creditBalance: 60, creditScore: -5 } }
        ]
    },
    // Emergencies
    {
        type: eventTypes.EMERGENCY,
        title: 'Medical Bill',
        description: 'You had to visit the campus health center. The bill is $150.',
        cost: 150,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -150 } },
            { text: 'Pay with credit card', action: 'credit', impact: { creditBalance: 150, creditScore: -3 } }
        ]
    },
    {
        type: eventTypes.EMERGENCY,
        title: 'Phone Repair',
        description: 'Your phone screen cracked! Repair costs $100.',
        cost: 100,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -100 } },
            { text: 'Pay with credit card', action: 'credit', impact: { creditBalance: 100, creditScore: -3 } }
        ]
    },
    {
        type: eventTypes.EMERGENCY,
        title: 'Car Repair',
        description: 'Your car needs urgent repairs. Cost: $250.',
        cost: 250,
        options: [
            { text: 'Pay with cash', action: 'cash', impact: { cash: -250 } },
            { text: 'Pay with credit card', action: 'credit', impact: { creditBalance: 250, creditScore: -5 } }
        ]
    },
    // Income
    {
        type: eventTypes.INCOME,
        title: 'Part-time Job Paycheck',
        description: 'You received your bi-weekly paycheck: $200.',
        cost: -200,
        options: [
            { text: 'Deposit to account', action: 'income', impact: { cash: 200 } }
        ]
    },
    {
        type: eventTypes.INCOME,
        title: 'Birthday Money',
        description: 'Your family sent you $100 for your birthday!',
        cost: -100,
        options: [
            { text: 'Add to account', action: 'income', impact: { cash: 100 } }
        ]
    },
    {
        type: eventTypes.INCOME,
        title: 'Tutoring Payment',
        description: 'You earned $75 from tutoring a classmate.',
        cost: -75,
        options: [
            { text: 'Add to account', action: 'income', impact: { cash: 75 } }
        ]
    }
];

// DOM Elements
const dayEl = document.getElementById('day');
const cashEl = document.getElementById('cash');
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
const finalScoreEl = document.getElementById('finalScore');
const finalBalanceEl = document.getElementById('finalBalance');
const finalMessageEl = document.getElementById('finalMessage');
const restartBtn = document.getElementById('restartBtn');

// Initialize game
function initGame() {
    gameState.day = 0;
    gameState.cash = 500;
    gameState.creditBalance = 0;
    gameState.creditScore = 700;
    gameState.transactions = [];
    
    updateUI();
    logEntriesEl.innerHTML = '';
    gameOverEl.style.display = 'none';
    nextDayBtn.textContent = 'Start Day 1';
    nextDayBtn.disabled = false;
}

// Update UI
function updateUI() {
    dayEl.textContent = gameState.day;
    cashEl.textContent = `$${gameState.cash}`;
    balanceEl.textContent = `$${gameState.creditBalance}`;
    creditScoreEl.textContent = gameState.creditScore;
    
    // Add pulse animation
    [cashEl, balanceEl, creditScoreEl].forEach(el => {
        el.classList.add('updated');
        setTimeout(() => el.classList.remove('updated'), 500);
    });
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
        const monthlyRate = 0.02; // 2% monthly (24% APR)
        const interest = Math.round(gameState.creditBalance * monthlyRate);
        gameState.creditBalance += interest;
        
        addTransaction({
            type: eventTypes.INTEREST,
            description: `Monthly interest charge (2%): $${interest}`,
            amount: interest,
            class: 'interest'
        });
    }
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

// Handle option selection
function handleOption(option, event) {
    // Check if credit limit would be exceeded
    if (option.action === 'credit') {
        const newBalance = gameState.creditBalance + event.cost;
        if (newBalance > gameState.creditLimit) {
            alert('Credit limit exceeded! You cannot make this purchase with your credit card.');
            return;
        }
    }
    
    // Check if cash is sufficient
    if (option.action === 'cash' && gameState.cash < event.cost) {
        alert('Insufficient cash! You need to use your credit card or skip this expense.');
        return;
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
    
    // Hide options and show next day button
    eventOptionsEl.innerHTML = '';
    nextDayBtn.disabled = false;
    nextDayBtn.textContent = gameState.day < 30 ? `Continue to Day ${gameState.day + 1}` : 'Finish Month';
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
        
        if (option.action === 'skip') {
            btn.classList.add('success');
        } else if (option.action === 'credit' && event.type === eventTypes.TEMPTATION) {
            btn.classList.add('danger');
        }
        
        btn.textContent = option.text;
        btn.onclick = () => handleOption(option, event);
        eventOptionsEl.appendChild(btn);
    });
}

// Get random event
function getRandomEvent() {
    // Weight events based on day
    let availableEvents = [...events];
    
    // More income events early in the month
    if (gameState.day <= 10) {
        availableEvents = availableEvents.filter(e => e.type === eventTypes.INCOME || 
            e.type === eventTypes.EXPENSE || e.type === eventTypes.TEMPTATION);
    }
    
    // More emergencies and temptations later
    if (gameState.day > 20) {
        availableEvents = [...events];
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
    
    // Show event
    const event = getRandomEvent();
    showEvent(event);
    
    nextDayBtn.disabled = true;
    nextDayBtn.textContent = gameState.day < 30 ? `Continue to Day ${gameState.day + 1}` : 'Finish Month';
}

// End game
function endGame() {
    gameOverEl.style.display = 'flex';
    finalScoreEl.textContent = gameState.creditScore;
    finalBalanceEl.textContent = `$${gameState.creditBalance}`;
    
    let message = '';
    if (gameState.creditScore >= 750) {
        message = 'Excellent! You maintained a great credit score. You\'re financially responsible! 🌟';
    } else if (gameState.creditScore >= 700) {
        message = 'Good job! You kept a decent credit score. Keep making smart financial decisions! 👍';
    } else if (gameState.creditScore >= 650) {
        message = 'Not bad, but you could improve. Try to keep your credit utilization lower next time. 💡';
    } else {
        message = 'Your credit score took a hit. Remember: only use credit for essentials and pay it off quickly! 📚';
    }
    
    if (gameState.creditBalance > 0) {
        message += ` You still have a balance of $${gameState.creditBalance} to pay off.`;
    }
    
    finalMessageEl.textContent = message;
}

// Event listeners
nextDayBtn.addEventListener('click', nextDay);
restartBtn.addEventListener('click', () => {
    initGame();
});

// Initialize
initGame();
