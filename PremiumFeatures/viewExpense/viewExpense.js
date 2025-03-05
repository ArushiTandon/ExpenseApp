let currentPage = 1;
const expensesPerPage = 10;

async function viewExpense(event = null, page = 1) {
    const reportType = event?.target?.value || document.querySelector("input[name='reportType']:checked")?.value;
    if (!reportType) return;

    const apiUrl = `http://localhost:3000/report/${reportType}?page=${page}&limit=${expensesPerPage}`;
    const token = localStorage.getItem("authToken");

    try {
        const response = await axios.get(apiUrl, {
            headers: { "x-auth-token": `Bearer ${token}` }
        });

        const { expenses, totalExpenses } = response.data;
        const totalPages = Math.ceil(totalExpenses / expensesPerPage);

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

        // Pagination Controls
        paginationElement.innerHTML = "";
        if (totalPages > 1) {
            let paginationHTML = `<nav><ul class="pagination justify-content-center">`;

            if (page > 1) {
                paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="viewExpense(null, ${page - 1})">Previous</a></li>`;
            }

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <li class="page-item ${i === page ? "active" : ""}">
                        <a class="page-link" href="#" onclick="viewExpense(null, ${i})">${i}</a>
                    </li>`;
            }

            if (page < totalPages) {
                paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="viewExpense(null, ${page + 1})">Next</a></li>`;
            }

            paginationHTML += `</ul></nav>`;
            paginationElement.innerHTML = paginationHTML;
        }

        currentPage = page;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to load expenses. Please try again.");
    }
}

document.querySelectorAll("input[name='reportType']").forEach(radio => {
    radio.addEventListener("change", (event) => {
        currentPage = 1; 
        viewExpense(event, currentPage);
    });
});
