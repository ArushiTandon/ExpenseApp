async function forgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    
    const apiUrl = 'http://localhost:3000/password/forgotpassword';

    try {

        if (email === '') {
            alert('Please enter your email');
            return;
        }

        const response = await axios.post(apiUrl, { email });
        alert(response.data.message || 'Password reset link has been sent to your email.');
        
        const resetId = response.data.resetId;

        window.location.href = `resetpassword.html?id=${resetId}`;  

    } catch (error) {
        console.error('Error sending password reset link:', error);
        alert('There was an error processing your request. Please try again.');   
    }
}