// Data Entry:
// I need to capture input values when the user submits the form.
// Validate entries

// Expense Object:
// Create an object or array to store each expense (e.g., amount, category, description, date).

// Local Storage:
// Save expenses to localStorage so data persists even if the page is refreshed.
// Retrieve and display stored data on page load.

//considering using DOMContentLoaded to ensure all DOMelements are loaded before function fires

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const expenseForm = document.getElementById('expenseForm');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expensesContainer = document.getElementById('expenses');
    const totalExpensesElement = document.getElementById('total-expenses');

    // Initialize expenses array from local storage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Function to update the UI
    function updateUI() {
        // Clear current expenses display
        expensesContainer.innerHTML = '';
        let total = 0;

        // Render expenses
        expenses.forEach((expense, index) => {
            total += expense.amount;

            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            expenseItem.innerHTML = `
                <p>${expense.name}: $${expense.amount.toFixed(2)}</p>
                <button onclick="removeExpense(${index})">Remove</button>
            `;
            expensesContainer.appendChild(expenseItem);
        });

        // Update total expenses
        totalExpensesElement.innerText = total.toFixed(2);
    }

    // Function to add an expense
    function addExpense(event) {
        event.preventDefault();

        const name = expenseNameInput.value;
        const amount = parseFloat(expenseAmountInput.value);

        if (name && !isNaN(amount)) {
            expenses.push({ name, amount });
            localStorage.setItem('expenses', JSON.stringify(expenses));
            expenseForm.reset(); // Clear form inputs
            updateUI(); // Refresh UI to show new expense
        }
    }

    // Function to remove an expense
    window.removeExpense = function(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateUI(); // Refresh UI
    };

    // Event listener for form submission
    expenseForm.addEventListener('submit', addExpense);

    // Initial call to populate UI on load
    updateUI();
});
