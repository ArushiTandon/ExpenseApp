let currentPage = 1;
let expensesPerPage = localStorage.getItem("expensesPerPage") 
    ? parseInt(localStorage.getItem("expensesPerPage")) 
    : 10;  // Default is 10

// Set dropdown to saved preference
document.getElementById("expenseLimit").value = expensesPerPage;

async function viewExpense(event, page = 1) {
    const reportType = event?.target 
        ? event.target.value 
        : document.querySelector("input[name='reportType']:checked")?.value;

    if (!reportType) return;

    const apiUrl = `http://localhost:3000/report/${reportType}?page=${page}&limit=${expensesPerPage}`;
    const token = localStorage.getItem("authToken");

    try {
        const response = await axios.get(apiUrl, {
            headers: { "x-auth-token": `Bearer ${token}` }
        });

        const { expenses, totalPages } = response.data;

        const reportTable = document.getElementById("reportOutputTable");
        const paginationElement = document.getElementById("pagination");

        if (expenses.length === 0) {
            reportTable.innerHTML = `<tr><td colspan="5">No expenses found for ${reportType} Expense.</td></tr>`;
            paginationElement.innerHTML = "";
            return;
        }

        let reportHTML = "";
        expenses.forEach((expense, index) => {
            reportHTML += `
                <tr>
                    <td>${(page - 1) * expensesPerPage + (index + 1)}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.date}</td>
                </tr>
            `;
        });

        reportTable.innerHTML = reportHTML;

        generatePagination(page, totalPages, reportType);
        currentPage = page;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to load expenses. Please try again.");
    }
}

function generatePagination(currentPage, totalPages, reportType) {
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = "";

    if (totalPages > 1) {
        let paginationHTML = `<nav><ul class="pagination">`;

        if (currentPage > 1) {
            paginationHTML += `<li class="page-item">
                <a class="page-link" href="#" onclick="viewExpense(null, ${currentPage - 1})">Previous</a>
            </li>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" onclick="viewExpense(null, ${i})">${i}</a>
            </li>`;
        }

        if (currentPage < totalPages) {
            paginationHTML += `<li class="page-item">
                <a class="page-link" href="#" onclick="viewExpense(null, ${currentPage + 1})">Next</a>
            </li>`;
        }

        paginationHTML += `</ul></nav>`;
        paginationElement.innerHTML = paginationHTML;
    }
}

// Update Expense Limit and Store in LocalStorage
function updateExpenseLimit() {
    expensesPerPage = parseInt(document.getElementById("expenseLimit").value);
    localStorage.setItem("expensesPerPage", expensesPerPage);
    viewExpense(null, 1);  // Refresh with new limit
}

// Load default expenses on page load
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("input[name='reportType']").forEach(radio => {
        radio.addEventListener("change", (event) => {
            currentPage = 1;
            viewExpense(event, currentPage);
        });
    });
});
