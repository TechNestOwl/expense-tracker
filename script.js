document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const expenseForm = document.getElementById('expenseForm');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseCategoryInput = document.getElementById('expenseCategory');
    const expenseDateInput = document.getElementById('expenseDate');
    const expensesContainer = document.getElementById('expenses');
    const totalExpensesElement = document.getElementById('total-expenses');
    const filterCategoryInput = document.getElementById('filterCategory');
    const budgetGoalInput = document.getElementById('budgetGoal');
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenseForm.addEventListener('submit', addExpense);

    // Function to update the UI
    function updateUI(filterCategory = 'All') {
        expensesContainer.innerHTML = '';
        let total = 0;

        // Render expenses based on filter
        expenses.forEach((expense, index) => {
            if (filterCategory === 'All' || expense.category === filterCategory) {
                total += expense.amount;
                const expenseItem = document.createElement('div');
                expenseItem.classList.add('expense-item');
                expenseItem.innerHTML = `
                    <p>${expense.name}: $${expense.amount.toFixed(2)} (${expense.category})</p>
                    <button id="removeBtn" onclick="removeExpense(${index})">Remove</button>
                `;
                expensesContainer.appendChild(expenseItem);
            }
        });

        totalExpensesElement.innerText = total.toFixed(2);
        renderChart();
    }

    // add an expense
    function addExpense(event) {
        event.preventDefault(); // Prevent form from reloading the page
        const name = expenseNameInput.value;
        const amount = parseFloat(expenseAmountInput.value);
        const category = expenseCategoryInput.value;
        const date = new Date(expenseDateInput.value);
    
        if (name && !isNaN(amount)) {
            expenses.push({ name, amount, category, date });
            localStorage.setItem('expenses', JSON.stringify(expenses));
            expenseForm.reset(); // Clear form inputs
            updateUI(); // Refresh UI to show new expense
            checkBudget();
        }
    }

    // Function to remove an expense
    window.removeExpense = function(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateUI(); // Refresh UI
    };

    // check budget
    function checkBudget() {
        const budgetGoal = parseFloat(budgetGoalInput.value);
        const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);

        if (budgetGoal && totalSpent > budgetGoal) {
            alert('You have exceeded your budget!');
        }
    }

    // Filter expenses
    filterCategoryInput.addEventListener('change', () => {
        const category = filterCategoryInput.value;
        updateUI(category);
    });

    // Clear all expenses
    document.getElementById('clearAll').addEventListener('click', () => {
        expenses = [];
        localStorage.removeItem('expenses');
        updateUI();
    });

    // Render chart with Chart.js
    function renderChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        const categoryTotals = calculateCategorySummary();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Expenses by Category',
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                },
            },
        });
    }

    // Calculate category summary
    function calculateCategorySummary() {
        const categoryTotals = {};

        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        return categoryTotals;
    }

    // Initial call to populate UI on load
    updateUI();
});
