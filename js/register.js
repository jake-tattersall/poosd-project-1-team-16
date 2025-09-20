function doRegister() {
    
    let fName = document.getElementById("firstName").value;
    let lname = document.getElementById("lastName").value;
    let loginName = document.getElementById("loginName").value.trim();
    let loginPassword = document.getElementById("loginPassword").value;

    // Clear previous result message and input error outlines
    const resultEl = document.getElementById("registerResult");
    resultEl.innerHTML = "";
    resultEl.classList.remove('error-text');
    ["firstName","lastName","loginName","loginPassword"].forEach(function(id){
        var el = document.getElementById(id);
        if (el) el.classList.remove('input-error');
    });

    // Basic validation
    if (!fName || !lname || !loginName || !loginPassword) {
        const msg = "Please fill in all fields.";
        resultEl.classList.add('error-text');
        resultEl.textContent = msg;
        resultEl.style.color = '#f43f5e';
        resultEl.style.fontSize = '0.8em';
        ["firstName","lastName","loginName","loginPassword"].forEach(function(id){
            var el = document.getElementById(id);
            if (el && !el.value) el.classList.add('input-error');
        });
        return;
    }
    // No email format validation; username is treated as a plain login

    let tmp = {firstName:fName, lastName:lname, login:loginName, password:loginPassword};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/register.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            try {
                let jsonObject = JSON.parse(xhr.responseText);
                if (xhr.status == 200 && jsonObject.error === "") {
                    // On successful registration, auto-login then transition to colors page
                    let loginPayload = JSON.stringify({ login: loginName, password: loginPassword });
                    let loginUrl = urlBase + '/Login.' + extension;
                    let xhr2 = new XMLHttpRequest();
                    xhr2.open("POST", loginUrl, true);
                    xhr2.setRequestHeader("Content-type", "application/json; charset=UTF-8");
                    xhr2.onreadystatechange = function(){
                        if (this.readyState == 4) {
                            try {
                                let loginObj = JSON.parse(xhr2.responseText);
                                if (xhr2.status == 200 && loginObj && loginObj.id && loginObj.id > 0) {
                                    // Set globals defined in code.js then persist and navigate
                                    userId = loginObj.id;
                                    firstName = loginObj.firstName;
                                    lastName = loginObj.lastName;
                                    saveCookie();
                                    // Do not show a success message; transition like login
                                    smoothTransition('color.html');
                                } else {
                                    // Fallback: show error if auto-login fails
                                    document.getElementById('registerResult').innerHTML = (loginObj && loginObj.error) ? loginObj.error : 'Auto-login failed.';
                                }
                            } catch(e) {
                                document.getElementById('registerResult').innerHTML = 'Auto-login failed.';
                            }
                        }
                    };
                    xhr2.send(loginPayload);
                } else {
                    // Style error cohesively and, if duplicate account, highlight inputs
                    var err = jsonObject.error || "Registration failed.";
                    resultEl.classList.add('error-text');
                    resultEl.textContent = err;
                    resultEl.style.color = '#f43f5e';
                    resultEl.style.fontSize = '0.8em';
                    if (/username already exists/i.test(err)){
                        ["firstName","lastName","loginName","loginPassword"].forEach(function(id){
                            var el = document.getElementById(id);
                            if (el) el.classList.add('input-error');
                        });
                    }
                }
            } catch (e) {
                resultEl.classList.add('error-text');
                resultEl.textContent = "Registration failed.";
                resultEl.style.color = '#f43f5e';
                resultEl.style.fontSize = '0.8em';
            }
        }
    };
    xhr.send(jsonPayload);
}

// Remove error outline as the user types
document.addEventListener('DOMContentLoaded', function(){
    ["firstName","lastName","loginName","loginPassword"].forEach(function(id){
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function(){
            el.classList.remove('input-error');
        });
    });
});

// Enter key handler for registration form
function handleRegisterKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        doRegister();
    }
}