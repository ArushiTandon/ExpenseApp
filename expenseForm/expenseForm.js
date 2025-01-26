const e = require("express");
const Razorpay = require("razorpay");

const apiUrl = 'http://localhost:3000/expense';

async function saveOrUpdate(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');

    const amount = event.target.amount.value;
    const description = event.target.text.value;
    const category = event.target.expense.value;
    const expenseId = event.target.dataset.id;
    const date = event.target.date;

    // if (token) {
    //     localStorage.setItem('token', token); // Save token to local storage
    //     console.log('Login successful. Token saved to local storage.');
    // } else {
    //     console.error('No token found in local storage.');
    //     return;
    // }

    const headers = {
        Authorization: token,
    };

    
    try {
      if (expenseId) {
        await axios.put(`${apiUrl}/${expenseId}`, {
                amount,
                description,
                category,
                date,
            }, { headers: headers}
        );
            event.target.dataset.id = ''; // Clear the ID

        } else {
                await axios.post(apiUrl, { amount, description, category, date}, {Headers: headers});
                console.log('Expense added successfully.');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            alert('Failed to save or update expense. Please try again later.');
        }

        event.target.reset();
        loadExpenses();
    }


    async function premium(event) {
        event.preventDefault(); 
    
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get(apiUrl, { headers: { "Authorization": token } });
    
            const options = {
                key: data.key_id,
                order_id: data.order_id,
                handler: async function (response) {
                    try {
                        // Resolve payment by sending data to the server
                        const [paymentResponse] = await Promise.all([
                            axios.post(apiUrl, {
                                order_id: options.order_id,
                                payment_id: response.razorpay_payment_id,
                            }, { headers: { "Authorization": token } })
                        ]);
    
                        alert('You are a premium user Now');
                        console.log('Payment successful:', paymentResponse.data);
                    } catch (error) {
                        console.error('Error in payment processing:', error);
                        alert('Payment processing failed.');
                    }
                }
            };
    
            const rzp1 = new Razorpay(options);
    
            // Open Razorpay modal
            rzp1.open();
    
            // Handle payment failures
            rzp1.on('payment.failed', async function (response) {
                console.error('Payment failed:', response);
    
                // Update order status to 'FAILED'
                try {
                    await axios.post(apiUrl + "/transactionstatus", {
                        order_id: options.order_id,
                        status: "FAILED"
                    }, { headers: { "Authorization": token } });
    
                    alert('Transaction failed. Order status updated to FAILED.');
                } catch (error) {
                    console.error('Error updating order status:', error);
                    alert('Failed to update order status.');
                }
            });
        } catch (error) {
            console.error('Error fetching payment details:', error);
            alert('Something went wrong while initiating the payment.');
        }
    }
    
    
async function searchExpense(event) {
    event.preventDefault();

    const token = localStorage.getItem('authToken');
    const date = document.getElementById("date").value;
    try {
      const response = await axios.get(`${apiUrl}/${date}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
     
      const expenseData = response.data;
      displayExpense(expenseData);
    } catch (error) {
      console.error("CAN'T SEARCH EXPENSE JS:", error);
    }
  }

async function loadExpenses() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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
                    await axios.delete(`${apiUrl}/${expense.id}`, {
                        headers: { Authorization: `Bearer ${token}` }, // Attach token
                    });
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
