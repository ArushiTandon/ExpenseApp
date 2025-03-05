let currentPage = 1;
const expensesPerPage = 10;

async function viewExpense(event, page = 1) {
    const reportType = event?.target ? event.target.value : document.querySelector("input[name='reportType']:checked")?.value;
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

        // Display expenses
        let reportHTML = "";
        expenses.forEach((expense, index) => {
            reportHTML += `
                <tr>
                    <td>${(page - 1) * expensesPerPage + (index + 1)}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td>${expense.amount}</td>
                    <td>${new Date(expense.date).toLocaleDateString()}</td>
                </tr>
            `;
        });
        reportTable.innerHTML = reportHTML;

        paginationElement.innerHTML = generatePagination(page, totalPages, reportType);

        currentPage = page;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to load expenses. Please try again.");
    }
}

function generatePagination(currentPage, totalPages, reportType) {
    let paginationHTML = `<nav><ul class="pagination justify-content-center">`;

    if (currentPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="viewExpense({ target: { value: '${reportType}' } }, ${currentPage - 1})">Previous</a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" onclick="viewExpense({ target: { value: '${reportType}' } }, ${i})">${i}</a>
            </li>
        `;
    }

    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="viewExpense({ target: { value: '${reportType}' } }, ${currentPage + 1})">Next</a></li>`;
    }

    paginationHTML += `</ul></nav>`;
    return paginationHTML;
}

document.querySelectorAll("input[name='reportType']").forEach(radio => {
    radio.addEventListener("change", (event) => {
        currentPage = 1; 
        viewExpense(event, currentPage);
    });
});
