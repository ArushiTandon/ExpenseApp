const apiUrl = "http://localhost:3000/user";

async function register(event) {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const user = { username, email, password }

    try {
      const response =  await axios.post(`${apiUrl}/signup`, user);
        console.log("User created successfully");
        alert(response.data.message);
        
    } catch (error) {
        console.error("Unable to SignUp:", error);
    }

    event.target.reset();
}

async function login(event) {
    event.preventDefault();
    
    const username = event.target.loginusername.value;
    const password = event.target.loginpassword.value;
    
    console.log('Sending Login Request(scriptf):', { username, password });

    try {
        const response = await axios.post(`${apiUrl}/login`, { username, password });
        console.log('Login Response:', response.data);

        if (response.status === 200) {
            console.log("User logged in successfully");
            alert(response.data.message);
        }
        window.location.href = "/addExpense";
          
    } catch (error) {
        console.error("Unable to Login:", error);
    }

    event.target.reset();
}


