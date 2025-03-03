async function viewExpense(event) {
    const reportType = event.target.value;
    const apiUrl = "http://localhost:3000/report";
    const token = localStorage.getItem("authToken");

    try {
        const response = await axios.get(`${apiUrl}/${reportType}`, {
            headers: { "x-auth-token": `Bearer ${token}` }
        });

        const expenseData = response.data;
        const reportTable = document.getElementById("reportOutputTable");

        if (expenseData.length === 0) {
            reportTable.innerHTML = `<tr><td colspan="5">No expenses found for ${reportType} Expense.</td></tr>`;
            return;
        }

        let reportHTML = "";
        expenseData.forEach((expense, index) => {
            reportHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td>$${expense.amount}</td>
                    <td>${expense.date}</td>
                </tr>
            `;
        });

        reportTable.innerHTML = reportHTML;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to load expenses. Please try again.");
    }
}


document.querySelectorAll("input[name='reportType']").forEach(radio => {
    radio.addEventListener("change", viewExpense);
});