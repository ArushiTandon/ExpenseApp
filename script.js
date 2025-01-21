const container = document.querySelector('.container');
const signUpBtn= document.querySelector('.signUp-btn');  
const loginBtn = document.querySelector('.login-btn'); 

signUpBtn.addEventListener('click', () => {
    container.classList.add('active');
}); 

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
}); 