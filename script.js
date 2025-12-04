function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    if (email === "" || password === "") {
        errorMsg.style.display = "block";
        return;
    }

    errorMsg.style.display = "none";

    alert("Login Successful! (Connect this to backend API)");
}
