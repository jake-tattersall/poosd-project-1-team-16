
const urlBase = 'http://167.71.243.49/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	//document.getElementById("contactSearchResult").innerHTML = "";
	//document.getElementById("contactListResults").innerHTML = "";

	let contactList = "";
	let tmp = {search: srch, userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved.";
				let jsonObject = JSON.parse(xhr.responseText);
				const container = document.getElementById("contactListResults");
				const table = document.createElement("table");
				const tblBody = document.createElement("tbody");
				
				if (jsonObject.results && jsonObject.results.length > 0) {
					document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved.";

					var row = document.createElement("tr");
					for (let i = 0; i < 5; i++) {
						const cell = document.createElement("th");
						const names = ['First Name', 'Last Name', 'Phone', 'Email', 'Address'];
						const cellText = document.createTextNode(`${names[i]}`);
						cell.appendChild(cellText);
						row.appendChild(cell);
					}
					tblBody.appendChild(row);
					
					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let contact = jsonObject.results[i];
						const row = document.createElement("tr");
						for (let j = 0; j < 5; j++) {           
							const cell = document.createElement("td");   
							const fields = [contact.firstName,contact.lastName,contact.phone,contact.email,contact.address];
							const cellText = document.createTextNode(`${fields[j]}`);            
							cell.appendChild(cellText);            
							row.appendChild(cell);        
						}
						tblBody.appendChild(row);
						contactList += `Name: ${contact.firstName} ${contact.lastName}, Phone: ${contact.phone}, Email: ${contact.email}, Address: ${contact.address}`;
						if (i < jsonObject.results.length - 1)
						{
							contactList += "<br />\r\n";
						}
					}
				} else {
					contactList = "No contacts found.";
					//document.getElementById("contactSearchResult").innerHTML = "No contacts found.";
				}
				//document.getElementsByTagName("p")[0].innerHTML = contactList;
				//document.getElementById("contactListResults").innerHTML = contactList;
				table.appendChild(tblBody);   
				container.appendChild(table);
				table.setAttribute("border", "1");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function listContacts()
{
	//let srch = document.getElementById("searchText").value;
	//document.getElementById("contactSearchResult").innerHTML = "";
	//document.getElementById("contactListResults").innerHTML = "";

	let contactList = "";
	let tmp = {search: "", userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//document.getElementById("contactsList").innerHTML = "Contact(s) have been retrieved.";
				let jsonObject = JSON.parse(xhr.responseText);
				const container = document.getElementById("contactListResults");
				const table = document.createElement("table");
				const tblBody = document.createElement("tbody");
				
				if (jsonObject.results && jsonObject.results.length > 0) {
					document.getElementById("contactsList").innerHTML = "Contact(s) have been retrieved.";

					var row = document.createElement("tr");
					for (let i = 0; i < 5; i++) {
						const cell = document.createElement("th");
						const names = ['First Name', 'Last Name', 'Phone', 'Email', 'Address'];
						const cellText = document.createTextNode(`${names[i]}`);
						cell.appendChild(cellText);
						row.appendChild(cell);
					}
					tblBody.appendChild(row);
					
					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let contact = jsonObject.results[i];
						const row = document.createElement("tr");
						for (let j = 0; j < 5; j++) {           
							const cell = document.createElement("td");   
							const fields = [contact.firstName,contact.lastName,contact.phone,contact.email,contact.address];
							const cellText = document.createTextNode(`${fields[j]}`);            
							cell.appendChild(cellText);            
							row.appendChild(cell);        
						}
						tblBody.appendChild(row);
						contactList += `Name: ${contact.firstName} ${contact.lastName}, Phone: ${contact.phone}, Email: ${contact.email}, Address: ${contact.address}`;
						if (i < jsonObject.results.length - 1)
						{
							contactList += "<br />\r\n";
						}
					}
				} else {
					contactList = "No contacts found.";
					//document.getElementById("contactsList").innerHTML = "No contacts found.";
				}
				//document.getElementsByTagName("p")[0].innerHTML = contactList;
				//document.getElementById("contactListResults").innerHTML = contactList;
				table.appendChild(tblBody);   
				container.appendChild(table);
				table.setAttribute("border", "1");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactsList").innerHTML = err.message;
	}
}



