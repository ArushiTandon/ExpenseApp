const { Cashfree } = require("cashfree-pg");
const e = require("express");

const cashfree = Cashfree({
    mode: "sandbox",
})


async function saveOrUpdate(event) {
    event.preventDefault();

    const apiUrl = 'http://localhost:3000/expense';

    const token = localStorage.getItem('authToken');

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
    console.log('Token:', token);

    const headers = {
        ['x-auth-token']: `Bearer ${token}`,
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
                await axios.post(apiUrl, { amount, description, category, date}, {headers: headers});
                console.log('Expense added successfully.');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            alert('Failed to save or update expense. Please try again later.');
        }

        event.target.reset();
        // loadExpenses();
    }


    async function premium(event) {
        event.preventDefault();
    
        const apiUrl = 'http://localhost:3000/expense';

        try {
            const response = await axios.post(`${apiUrl}/pay`);
            const resdata = response.data;
    
            const paymentSessionId = resdata.paymentSessionId;
            if (!paymentSessionId) {
                throw new Error("Payment session ID not found");
            }
    
            // Configuring payment checkout options
            let checkoutOptions = {
                paymentSessionId: paymentSessionId,
                redirectTarget: "_modal",
            };
    
            // Initiating payment using cashfree
            const result = await cashfree.checkout(checkoutOptions);
            console.log("Payment process completed");
    
            if (result.error) {
                console.error("Payment Error:", result.error);
            } else if (result.redirect) {
                console.log("Redirect URL:", result.redirect);
            } else if (result.paymentDetails) {
                console.log("Payment Message:", result.paymentDetails.paymentMessage);
    
                const orderId = resdata.orderId; 
                if (!orderId) {
                    throw new Error("Order ID not found");
                }
    
                // Sending payment status update
                const statusResponse = await axios.post(`${apiUrl}/payment-status/${orderId}`);
                const statusData = statusResponse.data;
                const payment_status = statusData.orderStatus;
    
                alert("Your payment is " + statusData.orderStatus);

                displayPremium(payment_status);
            }
        } catch (error) {
            console.error("Error during purchase:", error);
        }
    }   
    
async function searchExpense(event) {
    event.preventDefault();

    const apiUrl = 'http://localhost:3000/expense';

    const token = localStorage.getItem('authToken');
    const date = document.getElementById("date").value;
    try {
      const response = await axios.get(`${apiUrl}/${date}`, {
            headers: {
                ['x-auth-token']: `Bearer ${token}`,
            },
        });
     
      const expenseData = response.data;
      displayExpense(expenseData);
    } catch (error) {
      console.error("CAN'T SEARCH EXPENSE JS:", error);
    }
  }

async function loadExpenses() {
    const apiUrl = 'http://localhost:3000/expense';

    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(apiUrl, {
            headers: {
                ['x-auth-token']: `Bearer ${token}`,
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
                        headers: { ['x-auth-token']: `Bearer ${token}` }, // Attach token
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

async function displayExpense(expenseData) {

   try { const userListElement = document.getElementById('userList');
    userListElement.innerHTML = '';

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = `${expenseData.amount} - ${expenseData.description} - ${expenseData.category} - ${expenseData.date}`;

    userListElement.appendChild(listItem);
} catch(error){
    console.error('Error displaying expense:', error);
}
};

async function displayPremium(paymentStatus) {

    try{
        if (paymentStatus === 'SUCCESS') {
            const premiumbtn = document.getElementById('rzp-btn');
            if (premiumbtn) {
                premiumbtn.remove();
            }
            
            const premiumElement = document.createElement('p');
            premiumElement.className = 'premium';
            premiumElement.textContent = 'You are a premium user!';
            
            const premiumDiv = document.getElementById('premium-box');
            if (premiumDiv) {
                premiumDiv.appendChild(premiumElement);
            }
        }
    } catch (error) {
        console.error('Error displaying premium:', error);
    }
}

async function leaderboardDisplay() {
    const apiUrl = 'http://localhost:3000/expense';

    try {
        const response = await axios.get(`${apiUrl}/leaderboard`);
        const leaderboardData = response.data;

        const leaderboardElement = document.getElementById('leadlist');
        leaderboardElement.innerHTML =' ';
        leaderboardData.forEach((user, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${index + 1}. ${user.name} - ${user.totalExpense}`;

            leaderboardElement.appendChild(listItem);
        });
        
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Attach Event Listeners
// document.getElementById('Tracker').addEventListener('submit', saveOrUpdate);

// window.onload = loadExpenses;
document.addEventListener('DOMContentLoaded', displayPremium);
