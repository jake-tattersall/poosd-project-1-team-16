function addContact() {

    let add_firstName = document.getElementById("firstName").value;
    let add_lastName = document.getElementById("lastName").value;
    let add_phone = document.getElementById("phone").value;
    let add_email = document.getElementById("email").value;
    let add_address = document.getElementById("address").value;
    readCookie(); // This will update UserID

    document.getElementById("contactAddResult").innerHTML = ""; // Clear previous result

    let tmp = {
        firstName: add_firstName,
        lastName: add_lastName,
        phone: add_phone,
        email: add_email,
        address: add_address,
        userId: userId // assumes UserID is set globally by readCookie()
    };
    
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            let result = "";
            try {
                let jsonObject = JSON.parse(xhr.responseText);
                if (xhr.status == 200 && jsonObject.error === "") {
                    result = jsonObject.message || "Contact added successfully!";
                } else {
                    result = jsonObject.error || "Failed to add contact.";
                }
            } catch (e) {
                result = "Failed to add contact.";
            }
            document.getElementById("contactAddResult").innerHTML = result;
        }
    };
    xhr.send(jsonPayload);
}
