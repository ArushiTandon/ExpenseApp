async function transactionStatus() {

    const token = localStorage.getItem("authToken");
    const pathSegments = window.location.pathname.split('/');
    const orderId = pathSegments[pathSegments.length - 1];

    try {

      const statusresponse = await axios.get(`http://localhost:3000/purchase/transactionstatus/${orderId}`, {
        headers: {
           "x-auth-token": `Bearer ${token}`
        },
      });

      // const orderStatusElement = document.getElementById("orderStatusP");
      
    
      // if (payment_status === "SUCCESS") {
      //   window.location.href = "http://localhost:3000/addExpense";
      // } else {
      //   alert("Payment was not successful. Please try again.");
      // }

    } catch (error) {
      console.error("Error during purchase:", error);
    }
}

// document.addEventListener("DOMContentLoaded", () => {
//   const token = localStorage.getItem("authToken");
//   if (!token) {
//     window.location.href = `http://localhost:3000`;
//   } else {
//     transactionStatus();
//   }
// });

window.onload = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = `http://localhost:3000`;
  } else {
    transactionStatus();
  }
}