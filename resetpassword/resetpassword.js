async function resetPassword(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const resetId = urlParams.get('id');
    const newPassword = document.getElementById('password').value;

    try {
        const response = await axios.post(`http://localhost:3000/resetpassword/${resetId}`, { password: newPassword });
        alert(response.data.message || 'Password reset successfully.');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Failed to reset password. Please try again.');
        console.error(error);
    }
}