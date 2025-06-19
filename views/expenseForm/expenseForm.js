const cashfree = Cashfree({
  mode: "sandbox",
});

async function saveOrUpdate(event) {
  event.preventDefault();

  const apiUrl = "http://localhost:3000/expense";

  const token = localStorage.getItem("authToken");

  const amount = event.target.amount.value;
  const description = event.target.text.value;
  const category = event.target.expense.value;
  const expenseId = event.target.dataset.id;
  const date = document.getElementById("date").value;

  const headers = {
    ["x-auth-token"]: `Bearer ${token}`,
  };

  try {
    if (expenseId) {
      await axios.put(
        `${apiUrl}/${expenseId}`,
        {
          amount,
          description,
          category,
          date,
        },
        { headers: headers }
      );
      event.target.dataset.id = ""; // Clear the ID
    } else {
      await axios.post(
        apiUrl,
        { amount, description, category, date },
        { headers: headers }
      );
      // console.log("Expense added successfully.");
    }
  } catch (error) {
    // console.error("Error updating expense:", error);
    alert("Failed to save or update expense. Please try again later.");
  }

  event.target.reset();
  loadExpenses();
}

async function premium(event) {
  event.preventDefault();

  const apiUrl = "http://localhost:3000/purchase";
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.post(
      `${apiUrl}/premiummembership`,
      {},
      {
        headers: { "x-auth-token": `Bearer ${token}` },
      }
    );

    //retrieving session id from response
    const resdata = response.data;

    const paymentSessionId = resdata.paymentSessionId;
    const orderId = resdata.orderId;
    if (!paymentSessionId || !orderId) {
      throw new Error("Payment session ID or Order ID not found");
    }

    // Configuring payment checkout options
    let checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirect: "redirect",
    };

    // Initiating payment
    const result = await cashfree.checkout(checkoutOptions);
    console.log("Cashfree checkout completed!", result);
    // console.log("Payment process completed");

      fetchUserInfo(token);
    
  } catch (error) {
    console.error("Error during purchase:", error);
  }
}

async function loadExpenses() {
  const apiUrl = "http://localhost:3000/expense";

  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(apiUrl, {
      headers: {
        ["x-auth-token"]: `Bearer ${token}`,
      },
    });
    const expenses = response.data;

    const expenseListTableElement = document.getElementById("expenseListTable");

    expenseListTableElement.innerHTML = "";

    expenses.forEach((expense, index) => {

      
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const td5 = document.createElement("td");
      th.scope = "row";
      th.textContent = index + 1;
      td1.textContent = expense.description;
      td2.textContent = expense.category;
      td3.textContent = expense.amount;
      td4.textContent = expense.date;
    
      
      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn btn btn-danger";
      deleteBtn.onclick = async () => {
        try {
          await axios.delete(`${apiUrl}/${expense._id}`, {
            headers: { ["x-auth-token"]: `Bearer ${token}` }, // Attach token
          });
          loadExpenses();
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      };

      // Edit Button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn btn btn-primary";
      editBtn.onclick = () => {
        document.getElementById("amount").value = expense.amount;
        document.getElementById("text").value = expense.description;
        document.getElementById("expense").value = expense.category;
        document.getElementById("Tracker").dataset.id = expense._id;
        document.getElementById("date").value = expense.date;
      };

      td5.appendChild(deleteBtn);
      td5.appendChild(editBtn);
      tr.appendChild(td5);
      expenseListTableElement.appendChild(tr);

    });
  } catch (error) {
    console.error("Error loading expenses:", error);
  }
}

async function displayExpense(expenseData) {
  try {
    const userListElement = document.getElementById("userList");
    userListElement.innerHTML = "";

    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.textContent = `${expenseData.amount} - ${expenseData.description} - ${expenseData.category} - ${expenseData.date}`;

    userListElement.appendChild(listItem);
  } catch (error) {
    console.error("Error displaying expense:", error);
  }
}

function displayPremiumMessage() {
  // Hide the Buy Premium button
  const premiumBtn = document.getElementById("premium-btn");
  if (premiumBtn) {
    premiumBtn.style.display = "none";
  }

  // Display the premium user
  const premiumBox = document.querySelector("#expenseFormHeader");
  if (premiumBox) {
    premiumBox.innerHTML += `<button type="button" class="btn fw-bold btn-primary">Premium</button>`;
  }
}

function displayBuyPremiumButton() {
  const premiumBtn = document.getElementById("premium-btn");
  if (premiumBtn) {
    premiumBtn.style.display = "block";
  }
}

async function fetchUserInfo(token) {
  try {
    // console.log("INSIDE FETCH USER INFO");

    const response = await axios.get("http://localhost:3000/user/userinfo", {
      headers: { "x-auth-token": `Bearer ${token}` },
    });
    const user = response.data;

    if (user.isPremium) {
      displayPremiumMessage();
    } else {
      displayBuyPremiumButton();
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    alert("Failed to fetch user information.");
  }
}

async function leaderboardDisplay(event) {
  event.preventDefault();

  const apiUrl = "http://localhost:3000/expense";
  const token = localStorage.getItem("authToken");

  try {
    // Fetch user info to check if premium
    const userResponse = await axios.get(
      "http://localhost:3000/user/userinfo",
      {
        headers: {
          ["x-auth-token"]: `Bearer ${token}`,
        },
      }
    );
    const user = userResponse.data;

    if (!user.isPremium) {
      alert("Access denied. Premium users only.");
      return;
    }

    // Fetch leaderboard data
    const response = await axios.get(`${apiUrl}/leaderboard`, {
      headers: {
        ["x-auth-token"]: `Bearer ${token}`,
      },
    });
    const leaderboardData = response.data;

    const leaderboardElement = document.getElementById("leadlist");
    leaderboardElement.innerHTML = " ";
    leaderboardData.forEach((user, index) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = `${index + 1}. ${user.username} - ${
        user.totalexpense
      }`;
      leaderboardElement.appendChild(listItem);
    });
    
  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
}

  function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'http://localhost:3000/user';
  }


document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = `http://localhost:3000/user`;
    alert("Please log in to access the expense tracker.");
  } else {
    fetchUserInfo(token);
    loadExpenses();
  }
});
