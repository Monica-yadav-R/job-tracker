
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit",async function(event){
    event.preventDefault();
    console.log("LOGINFORM IS SUBMITTED");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value;
    const password = passwordInput.value;
    const response = await fetch(`${API_BASE_URL}/login`, {
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
    if (Array.isArray(data.detail)) {
        alert(data.detail[0].msg);
    } else {
        alert(data.detail);
    }

    return;
    }
    localStorage.setItem("access_token", data.access_token);
    window.location.href = "index.html";
});

// login-test@example.com
// TestPass123
// 200

//test2-login@example.com
//login123

//userb-test@example.com
//password

//usera-test@example.com
//password
