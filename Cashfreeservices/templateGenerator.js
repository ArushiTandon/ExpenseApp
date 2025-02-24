

const jsTemp = `
<script>
setTimeout(() => { window.location.href = "http://localhost:3000/addExpense"; }, 5000);
</script>`;


templateGenerator = (orderId, orderAmount, orderStatus) => {

`<html>

<head> <title> ORDER STATUS </title> </head>
<body>
<div class="container">
<h1> Your Order Status </h1>
<p> Order ID : ${orderId} </p>
<p> Order Amount : ${orderAmount} </p>
<p> Order Status : ${orderStatus} </p>
<p>Redirecting to home page...</p>
</div> ${jsTemp}
</body>

<html/>`
};

module.exports = templateGenerator;