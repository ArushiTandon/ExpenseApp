async function forgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    
    const apiUrl = 'http://localhost:3000/forgotpassword';

    try {

        if (email === '') {
            alert('Please enter your email');
        }

        const response = await axios.post(apiUrl, { email });
        alert('Password reset link has been sent to your email');
        
    } catch (error) {
        console.error('Error sending password reset link:', error);
        alert('There was an error processing your request. Please try again.');   
    }
}