function doRegister() {



    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let loginName = document.getElementById("loginName").value.trim().toLowerCase();
    let loginPassword = document.getElementById("loginPassword").value;

    document.getElementById("registerResult").innerHTML = ""; // Clear previous result message

    // Basic validation
    if (!firstName || !lastName || !loginName || !loginPassword) {
        document.getElementById("registerResult").innerHTML = "Please fill in all fields.";
        return;
    }
    // If username is used as email, validate email format
    const emailLike = loginName;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLike)) {
        document.getElementById("registerResult").innerHTML = "Please enter a valid email address.";
        return;
    }

    let tmp = {firstName:firstName, lastName:lastName, login:loginName, password:loginPassword};
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
                                    firstName = loginObj.firstName || firstName;
                                    lastName = loginObj.lastName || lastName;
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
                    document.getElementById("registerResult").innerHTML = jsonObject.error || "Registration failed.";
                }
            } catch (e) {
                document.getElementById("registerResult").innerHTML = "Registration failed.";
            }
        }
    };
    xhr.send(jsonPayload);
}