const registerForm = document.getElementById("register-form");


registerForm.addEventListener("submit",async function(event){
    event.preventDefault();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value;
    const password = passwordInput.value;

    const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
});

    const data = await response.json();

    if (!response.ok) {
    alert(data.detail);
    return;
    }

    window.location.href = "login.html";
});