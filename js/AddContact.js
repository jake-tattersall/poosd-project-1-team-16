function addContact() {

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;
    let userId = localStorage.getItem("ID");

    alert(userId)
    /*
    let url = urlBase + '/AddContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify({firstName:firstName, lastName:lastName, phone:phone, email:email, address:address, userId:userId}));
*/

}