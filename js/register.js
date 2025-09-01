function doRegister() {



    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let loginName = document.getElementById("loginName").value;
    let loginPassword = document.getElementById("loginPassword").value;

    document.getElementById("registerResult").innerHTML = ""; // Clear previous result message

    let tmp = {firstName:firstName, lastName:lastName, login:loginName, password:loginPassword};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/register.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            let result = "";
            try {
                let jsonObject = JSON.parse(xhr.responseText);
                if (xhr.status == 200 && jsonObject.error === "") {
                    result = jsonObject.message || "Registration successful!";
                } else {
                    result = jsonObject.error || "Registration failed.";
                }
            } catch (e) {
                result = "Registration failed.";
            }
            document.getElementById("registerResult").innerHTML = result;
        }
    };
    xhr.send(jsonPayload);
}