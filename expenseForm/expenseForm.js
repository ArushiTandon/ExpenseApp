const apiUrl = 'http://localhost:3000/expenses';

async function saveOrUpdate(event) {
    event.preventDefault();

    const amount = event.target.amount.value;
    const description = event.target.text.value;
    const category = event.target.expense.value;
    const expenseId = event.target.dataset.id;
    
    if (expenseId) {
        // Update Expense
        try {
             await axios.put(`${apiUrl}/${expenseId}`, {
                amount,
                description,
                category,
            });
            event.target.dataset.id = ''; // Clear the ID
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    } else {
        // Add New Expense
        try {
            await axios.post(apiUrl, { amount, description, category });
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    }

    event.target.reset();
    loadExpenses();
}

// Fetch and Display Expenses
async function loadExpenses() {
    try {
        const response = await axios.get(apiUrl);
        const expenses = response.data;

        const userListElement = document.getElementById('userList');
        userListElement.innerHTML = ''; 

        expenses.forEach(expense => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn btn-danger btn-sm ms-2';
            deleteBtn.onclick = async () => {
                try {
                    await axios.delete(`${apiUrl}/${expense.id}`);
                    loadExpenses();
                } catch (error) {
                    console.error('Error deleting expense:', error);
                }
            };

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'btn btn-secondary btn-sm ms-2';
            editBtn.onclick = () => {
                document.getElementById('amount').value = expense.amount;
                document.getElementById('text').value = expense.description;
                document.getElementById('expense').value = expense.category;
                document.getElementById('Tracker').dataset.id = expense.id; 
            };

            listItem.appendChild(deleteBtn);
            listItem.appendChild(editBtn);
            userListElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

// Attach Event Listeners
document.getElementById('Tracker').addEventListener('submit', saveOrUpdate);

// Load expenses when the page loads
window.onload = loadExpenses;
