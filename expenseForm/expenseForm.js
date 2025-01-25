const apiUrl = 'http://localhost:3000/expense';

async function saveOrUpdate(event) {
    event.preventDefault();

    const amount = event.target.amount.value;
    const description = event.target.text.value;
    const category = event.target.expense.value;
    const expenseId = event.target.dataset.id;
    const date = event.target.date;
    
    if (expenseId) {
        // Update Expense
        try {
             await axios.put(`${apiUrl}/${expenseId}`, {
                amount,
                description,
                category,
                date,
            });
            event.target.dataset.id = ''; // Clear the ID
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    } else {
        // Add New Expense
        try {
            await axios.post(apiUrl, { amount, description, category, date});
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    }

    event.target.reset();
    loadExpenses();
}

async function searchExpense(event) {
    event.preventDefault();
  
    const date = document.getElementById("date").value;
    try {
      const response = await axios.get(`${apiUrl}/${date}`);
     
      const expenseData = response.data;
      displayExpense(expenseData);
    } catch (error) {
      console.error("CAN'T SEARCH EXPENSE JS:", error);
    }
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
            listItem.textContent = `${expense.amount} - ${expense.description} - ${expense.category} - ${expense.date}`;

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
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
            editBtn.className = 'edit-btn';
            editBtn.onclick = () => {
                document.getElementById('amount').value = expense.amount;
                document.getElementById('text').value = expense.description;
                document.getElementById('expense').value = expense.category;
                document.getElementById('Tracker').dataset.id = expense.id;
                document.getElementById('date').value = expense.date;
            };

            listItem.appendChild(deleteBtn);
            listItem.appendChild(editBtn);
            userListElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

async function displayExpense (expenseData) {

    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = '';

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = `${expenseData.amount} - ${expenseData.description} - ${expenseData.category} - ${expenseData.date}`;

    userListElement.appendChild(listItem);
};

// Attach Event Listeners
// document.getElementById('Tracker').addEventListener('submit', saveOrUpdate);

window.onload = loadExpenses;
