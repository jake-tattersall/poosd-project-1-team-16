const urlBase = 'https://seacontacts.org/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let theme = localStorage.getItem('theme') || 'light'; // Default to light mode

document.addEventListener('DOMContentLoaded', function() {
    // Apply saved theme on load
    if (theme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
    // Ensure initial page load does not animate sun/moon
    document.body.classList.remove('theme-animated');
    // Wire checkbox switch if present
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.checked = (theme === 'light');
        toggle.addEventListener('change', function(e) {
            // Temporarily enable animations during user-initiated toggle
            document.body.classList.add('theme-animated');
            if (e.target.checked) {
                document.body.classList.add('light');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light');
                localStorage.setItem('theme', 'dark');
            }
            // Remove the animation flag after the transition window
            setTimeout(function(){
                document.body.classList.remove('theme-animated');
            }, 2200);
        });
    }

    // Clickable sun/moon toggles
    var sunHit = document.querySelector('.sun-hit');
    var moonHit = document.querySelector('.moon-hit');

    function setThemeLight(){
        // Play icon animations on explicit toggle
        document.body.classList.add('theme-animated');
        document.body.classList.add('light');
        localStorage.setItem('theme', 'light');
        setTimeout(function(){ document.body.classList.remove('theme-animated'); }, 1400);
    }
    function setThemeDark(){
        document.body.classList.add('theme-animated');
        document.body.classList.remove('light');
        localStorage.setItem('theme', 'dark');
        setTimeout(function(){ document.body.classList.remove('theme-animated'); }, 1400);
    }

    function syncToggleCheckbox(){
        var t = document.getElementById('themeToggle');
        if (t) t.checked = document.body.classList.contains('light');
    }

    // Hover glow via body classes to apply drop-shadow on icons
    function addHoverClass(cls){ document.body.classList.add(cls); }
    function removeHoverClass(cls){ document.body.classList.remove(cls); }

    if (sunHit){
        sunHit.addEventListener('click', function(){ setThemeDark(); syncToggleCheckbox(); });
        sunHit.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setThemeDark(); syncToggleCheckbox(); }});
        sunHit.addEventListener('mouseenter', function(){ addHoverClass('icon-hover-sun'); });
        sunHit.addEventListener('mouseleave', function(){ removeHoverClass('icon-hover-sun'); });
        sunHit.addEventListener('focus', function(){ addHoverClass('icon-hover-sun'); });
        sunHit.addEventListener('blur', function(){ removeHoverClass('icon-hover-sun'); });
    }
    if (moonHit){
        moonHit.addEventListener('click', function(){ setThemeLight(); syncToggleCheckbox(); });
        moonHit.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setThemeLight(); syncToggleCheckbox(); }});
        moonHit.addEventListener('mouseenter', function(){ addHoverClass('icon-hover-moon'); });
        moonHit.addEventListener('mouseleave', function(){ removeHoverClass('icon-hover-moon'); });
        moonHit.addEventListener('focus', function(){ addHoverClass('icon-hover-moon'); });
        moonHit.addEventListener('blur', function(){ removeHoverClass('icon-hover-moon'); });
    }
    // Ensure checkbox reflects initial state on pages where it exists
    syncToggleCheckbox();
    
    // Clear login field error highlighting when user starts typing (like register page)
    ["loginName","loginPassword"].forEach(function(id){
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function(){
            el.classList.remove('input-error');
        });
    });
});

// Enter key handlers for forms
function handleLoginKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        doLogin();
    }
}

function handleRegisterKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        doRegister();
    }
}

function handleSearchKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchContacts();
    }
}

function handleAddContactKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addContact();
    }
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value.trim();
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";
	// Clear any previous input error highlighting
	document.getElementById("loginName").classList.remove('input-error');
	document.getElementById("loginPassword").classList.remove('input-error');
	
	// Basic validation
	if (!login || !password)
	{
		document.getElementById("loginResult").innerHTML = "Please enter username and password.";
		// Highlight empty fields in red
		if (!login) document.getElementById("loginName").classList.add('input-error');
		if (!password) document.getElementById("loginPassword").classList.add('input-error');
		return;
	}

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
					// Highlight both fields since we don't know which is wrong
					document.getElementById("loginName").classList.add('input-error');
					document.getElementById("loginPassword").classList.add('input-error');
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				// Smooth transition to color.html
				smoothTransition("color.html");
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
	
	var path = (typeof window !== 'undefined') ? window.location.pathname : '';
	if( userId < 0 )
	{
		// Allow access to register page when not logged in
		if (path.includes('register.html')) {
			return;
		}
		// Redirect unauthenticated users away from protected pages
		if (path.includes('color.html')) {
			smoothTransition("index.html");
			return;
		}
	}
	else
	{
		if (document.getElementById("userName")) {
			document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
		}
		// On colors page, move Logout into the hamburger menu
		if (path.includes('color.html')) {
			var menu = document.getElementById('menuDropdown');
			if (menu && !document.getElementById('logoutMenuButton')) {
				var btn = document.createElement('button');
				btn.id = 'logoutMenuButton';
				btn.type = 'button';
				btn.className = 'menu-item';
				btn.textContent = 'Log Out';
				btn.addEventListener('click', function(){ doLogout(); });
				menu.appendChild(btn);
			}
			var logoutContainer = document.getElementById('logoutContainer');
			if (logoutContainer && logoutContainer.parentNode) {
				logoutContainer.parentNode.removeChild(logoutContainer);
			}
		}
	}
}

function smoothTransition(url) {
    // Persist ball position if present before navigating
    try {
        var ballEl = document.getElementById('ball');
        if (ballEl) {
            var left = parseInt(ballEl.style.left || '0', 10);
            var top = parseInt(ballEl.style.top || '0', 10);
            if (!isNaN(left) && !isNaN(top)) {
                localStorage.setItem('ballX', String(left));
                localStorage.setItem('ballY', String(top));
            }
        }
    } catch(e) {}

    // Special scene transition for moving to color.html
    if (url.indexOf('color.html') !== -1) {
        document.body.classList.add('scene-transition', 'to-colors');
        setTimeout(() => {
            window.location.href = url;
        }, 950);
        return;
    }
    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	smoothTransition("index.html");
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor, userId:userId};
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
	document.getElementById("contactSearchResult").innerHTML = "";
	document.getElementById("contactListResults").innerHTML = "";
	
	if (srch == "") {
			document.getElementById("contactSearchResult").innerHTML = "Please enter search term(s)";
			return;
	}

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
						if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
					
					// Check if there's an error (no results found)
					if (jsonObject.error && jsonObject.error !== "") {
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					document.getElementById("contactListResults").innerHTML = "";
				}
				// Check if we have results
				else if (jsonObject.results && jsonObject.results.length > 0) {
					// Create grid header
					contactList = `
						<div class="contacts-grid">
							<div class="grid-header">
								<div class="grid-cell header-cell">Photo</div>
								<div class="grid-cell header-cell">Name</div>
								<div class="grid-cell header-cell">Phone</div>
								<div class="grid-cell header-cell">Email</div>
								<div class="grid-cell header-cell">Address</div>
								<div class="grid-cell header-cell">Actions</div>
							</div>
					`;
					
					// Add each contact as a grid row
					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let contact = jsonObject.results[i]; // Already parsed, no need for JSON.parse
						contactList += `
							<div class="grid-row">
								<div class="grid-cell photo-cell"><img class="icon" src="../images/Icon.svg" alt="Avatar"></div>
								<div class="grid-cell name-cell">${contact.firstName} ${contact.lastName}</div>
								<div class="grid-cell phone-cell">${contact.phone}</div>
								<div class="grid-cell email-cell">${contact.email}</div>
								<div class="grid-cell address-cell">${contact.address}</div>
								<div class="grid-cell actions-cell">
								  <button type="button" style="display:inline-block" class="buttons" onclick="deleteContact(${contact.id});">
                                                                                <img src="../images/Delete.svg" width="30" height="30">
                                                                        </button>
                                                                        <button type="button" style="display:inline-block" class="buttons" onclick="modifyContact(${contact.id}, '${contact.firstName}', '${contact.lastName}', '${contact.phone}', '${contact.email}', '${contact.address}');">
                                                                                 <img src="../images/Edit.svg" width="30" height="30">
                                                                        </button>   
								</div>
							</div>
						`;
					}
					
					contactList += `</div>`; // Close contacts-grid
					
					document.getElementById("contactSearchResult").innerHTML = `Found ${jsonObject.results.length} contact(s)`;
					document.getElementById("contactListResults").innerHTML = contactList;
				}
				// Fallback case
				else {
					document.getElementById("contactSearchResult").innerHTML = "No contacts found.";
					document.getElementById("contactListResults").innerHTML = "";
				}
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
	//document.getElementById("contactsError").innerHTML = "";
	//document.getElementById("contactsList").innerHTML = "";
	
	let dropdown = document.getElementById('contactsList');
    	let button = document.getElementById('listContactsButton');
    
   	 // Check if dropdown is currently hidden
	 // Check if dropdown is currently hidden
    	if (dropdown.style.display === 'block') {
			dropdown.style.display = 'none';
        	button.innerHTML = 'List My Contacts';
        	return;
    	} else {
        	dropdown.style.display = 'block';
        	button.innerHTML = 'Hide My Contacts';
    	}    	

  	document.getElementById("contactsError").innerHTML = "";
        document.getElementById("contactsList").innerHTML = "";

	let contactList = "";
	let tmp = {search: "", userId: userId}; // Empty search to get all contacts
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
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.results && jsonObject.results.length > 0) {
					// Create grid header
					contactList = `
						<div class="contacts-grid">
							<div class="grid-header">
								<div class="grid-cell header-cell">Photo</div>
								<div class="grid-cell header-cell">Name</div>
								<div class="grid-cell header-cell">Phone</div>
								<div class="grid-cell header-cell">Email</div>
								<div class="grid-cell header-cell">Address</div>
								<div class="grid-cell header-cell">Actions</div>
							</div>
					`;

					let imagesArray = ["../images/fish1.png", "../images/fish2.png", "../images/fish3.png"];
					// Add each contact as a grid row
					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let num = Math.floor(Math.random() * 3); // 0...2
						let img = imagesArray[num];

						let contact = jsonObject.results[i]; // Already parsed, no need for JSON.parse
						contactList += `
							<div class="grid-row">
								<div class="grid-cell photo-cell"><img class="icon" src=${img} alt="Avatar"></div>
								<div class="grid-cell name-cell">${contact.firstName} ${contact.lastName}</div>
								<div class="grid-cell phone-cell">${contact.phone}</div>
								<div class="grid-cell email-cell">${contact.email}</div>
								<div class="grid-cell address-cell">${contact.address}</div>
								<div class="grid-cell actions-cell">
									<button type="button" style="display:inline-block" class="buttons" onclick="deleteContact(${contact.id});">
                                                                                <img src="../images/Delete.svg" width="30" height="30">
                                                                        </button>
                                                                        <button type="button" style="display:inline-block" class="buttons" onclick="modifyContact(${contact.id}, '${contact.firstName}', '${contact.lastName}', '${contact.phone}', '${contact.email}', '${contact.address}');">
                                                                                 <img src="../images/Edit.svg" width="30" height="30">
                                                                        </button>   
								</div>
							</div>
						`;
					}

					
					contactList += `</div>`; // Close contacts-grid
				} else {
					contactList = "No contacts found.";
					document.getElementById("contactsError").innerHTML = "No contacts found.";
				}
				document.getElementById("contactsList").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactsError").innerHTML = err.message;
	}
}

// Delete a contact by ID and refresh the lists
function deleteContact(contactId)
{
    if (!confirm('Delete this contact?')) return;
    readCookie();
    let tmp = { id: contactId, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            try {
                let jsonObject = JSON.parse(xhr.responseText);
                if (this.status == 200 && jsonObject.error === "") {
                    // Refresh visible lists if present
                    if (document.getElementById('contactsList')) {
                        listContacts();
                    }
                    if (document.getElementById('contactListResults')) {
                        searchContacts();
                    }
                } else {
                    alert(jsonObject.error || 'Failed to delete contact.');
                }
            } catch(e) {
                alert('Failed to delete contact.');
            }
        }
    };
    xhr.send(jsonPayload);
}

// Modify contact functions
function modifyContact(contactId, firstName, lastName, phone, email, address) {
    // Show popup and fill fields
    document.getElementById('modifyContactId').value = contactId;
    document.getElementById('modifyFirstName').value = firstName || '';
    document.getElementById('modifyLastName').value = lastName || '';
    document.getElementById('modifyPhone').value = phone || '';
    document.getElementById('modifyEmail').value = email || '';
    document.getElementById('modifyAddress').value = address || '';
    document.getElementById('modifyContactPopup').style.display = 'block';
}

function closeModifyContactPopup() {
    document.getElementById('modifyContactPopup').style.display = 'none';
}

function submitModifyContact(event) {
    event.preventDefault();
    var id = document.getElementById('modifyContactId').value;
    var firstName = document.getElementById('modifyFirstName').value;
    var lastName = document.getElementById('modifyLastName').value;
    var phone = document.getElementById('modifyPhone').value;
    var email = document.getElementById('modifyEmail').value;
    var address = document.getElementById('modifyAddress').value;
    var tmp = {
        id: id,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        address: address
    };
    var jsonPayload = JSON.stringify(tmp);
    var url = urlBase + '/ModifyContact.' + extension;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert('Contact modified.');
            closeModifyContactPopup();
            // Refresh both list and search views
            if (typeof listContacts === 'function') listContacts();
            if (typeof searchContacts === 'function') searchContacts();
        }
    };
    xhr.send(jsonPayload);
}

// --- Beach Ball Code ---
// Function to detect mobile viewport (global scope)
function isMobileViewport() {
    return window.innerWidth <= 768;
}

document.addEventListener('DOMContentLoaded', function() {
    // Only create ball on index.html (login page) and NOT on mobile viewport
    if (!window.location.pathname.includes('color.html') && !isMobileViewport()) {
    // Ball physics variables - start in water on left side
    let ballX = 50; // start on left side, in water
    let ballY = window.innerHeight * 0.8; // start in water area (80% down screen)
    let velocityX = 12; // good initial momentum to the right
    let velocityY = -3; // slight upward movement initially
    const gravity = 0.8; // gravity acceleration per frame
    const bounce = 0.72; // slightly less bouncy for more realistic damping
    const friction = 0.985; // a bit more air resistance so it slows more naturally
    
    // Water physics variables
    const waterBuoyancy = 0.18; // Stronger buoyancy for floatier behavior
    const waterDragBase = 0.65; // Base water drag (used for vertical damping)
    const waterDragXSurface = 0.5; // Stronger horizontal surface friction
    let inWater = true; // Start in water since ball spawns in water
    let prevInWater = false; // Track water entry for splash behavior
    let waterEntryAt = 0; // Timestamp of when we entered water
    let restoredFromStorage = false; // Track if we restored position across pages
    let skipSplash = false; // Skip the water-entry splash after restore
    
    // Simplified wave surface calculation for reliable collision
    function getWaterSurfaceAt(x, containerBounds) {
        // Start with waves container at 50% of screen height
        const wavesStartY = containerBounds.height * 0.5;
        
        // Add simple animated wave effect for testing
        const time = Date.now() / 1000;
        const waveOffset = Math.sin(time + x * 0.01) * 20; // smaller 20px wave amplitude
        
        // Base water level near bottom half container plus wave motion
        const waterSurface = containerBounds.height * 0.9 + waveOffset;
        
        return waterSurface;
    }
    
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    // Momentum tracking for drag release
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseHistory = []; // Store recent mouse positions for momentum calculation
    
    // Create the ball element
    const ball = document.createElement("div");
    ball.id = "ball";
    
    // Add to waves container to control layering relative to waves
    const wavesContainer = document.querySelector('.waves-container');
    if (wavesContainer) {
        wavesContainer.appendChild(ball);
    } else {
        document.body.appendChild(ball);
    }

    // Restore persisted ball position if available (login/register navigation)
    try {
        var persistedX = parseInt(localStorage.getItem('ballX') || '', 10);
        var persistedY = parseInt(localStorage.getItem('ballY') || '', 10);
        if (!isNaN(persistedX) && !isNaN(persistedY)) {
            ballX = persistedX;
            ballY = persistedY;
            updateBallPosition();
            // Do not reapply initial motion when restored between pages
            velocityX = 0;
            velocityY = 0;
            restoredFromStorage = true;
            skipSplash = true;
        }
    } catch(e) {}

    // Get container dimensions - use full viewport
    function getContainerBounds() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    
    // Update ball position on screen
    function updateBallPosition() {
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";
    }
    
    // Mouse event handlers for dragging
    ball.addEventListener("mousedown", function(e) {
        isDragging = true;
        const rect = ball.getBoundingClientRect();
        
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        
        // Initialize mouse tracking
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        mouseHistory = [];
        
        ball.style.cursor = "grabbing";
        velocityX = 0; // Stop physics while dragging
        velocityY = 0;
        e.preventDefault();
    });

    document.addEventListener("mousemove", function(e) {
        if (isDragging) {
            const bounds = getContainerBounds();
            
            // Track mouse movement for momentum calculation
            const currentTime = Date.now();
            mouseHistory.push({
                x: e.clientX,
                y: e.clientY,
                time: currentTime
            });
            
            // Keep only recent history (last 100ms)
            mouseHistory = mouseHistory.filter(point => currentTime - point.time < 100);
            
            ballX = e.clientX - dragOffsetX;
            ballY = e.clientY - dragOffsetY;
            
            // Keep ball within bounds
            ballX = Math.max(0, Math.min(bounds.width - 100, ballX));
            ballY = Math.max(0, Math.min(bounds.height - 100, ballY));
            
            updateBallPosition();
        }
    });
    
    document.addEventListener("mouseup", function() {
        if (isDragging) {
        isDragging = false;
        ball.style.cursor = "grab";
            
            // Calculate momentum from mouse movement history
            if (mouseHistory.length >= 2) {
                // Use more recent points for better responsiveness
                const recent = mouseHistory[mouseHistory.length - 1];
                const older = mouseHistory[Math.max(0, mouseHistory.length - 3)]; // Look at last few points
                const timeDiff = recent.time - older.time;
                
                if (timeDiff > 0) {
                    // Calculate velocity based on mouse movement (higher responsiveness)
                    const momentumScale = 1.8; // Increased for better responsiveness
                    const rawVelX = ((recent.x - older.x) / timeDiff) * momentumScale;
                    const rawVelY = ((recent.y - older.y) / timeDiff) * momentumScale;
                    
                    // Convert to pixels per frame (assuming 60fps)
                    velocityX = rawVelX * 16.67; // 1000ms / 60fps Ã¢â€°Ë† 16.67ms per frame
                    velocityY = rawVelY * 16.67;
                    
                    // Cap maximum velocity to prevent ball from going crazy
                    const maxVelocity = 30; // Increased for more responsive feel
                    velocityX = Math.max(-maxVelocity, Math.min(maxVelocity, velocityX));
                    velocityY = Math.max(-maxVelocity, Math.min(maxVelocity, velocityY));
                }
            }
        }
    });
    
    // Main physics animation loop
    function animate() {
        if (!isDragging) {
            const bounds = getContainerBounds();
            const ballSize = 100;
            const ballCenterX = ballX + ballSize / 2;
            const ballCenterY = ballY + ballSize / 2;
            const ballBottomY = ballY + ballSize; // bottom of ball for wave contact
            

            
            // Get dynamic water surface at ball's X position
            const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
            const currentWaterSurface = getWaterSurfaceAt(ballCenterX, bounds);
            
            // Ball considered in water when its bottom touches the surface
            inWater = ballBottomY >= currentWaterSurface;
            
            // On water entry, cut horizontal speed and add a small upward splash
            if (!prevInWater && inWater && !skipSplash) {
                velocityX *= 0.8; // allow initial glide
                velocityY *= 0.5;
                velocityY -= 2.0; // small lift
                waterEntryAt = now;
            }
            // Only skip splash once after a restore
            if (skipSplash) {
                skipSplash = false;
            }
            
            if (inWater) {
                // Water physics - noticeable slowdown
                // Apply buoyancy proportional to submerged portion using bottom contact
                const submersionDepth = Math.max(0, ballBottomY - currentWaterSurface);
                const submersionRatio = Math.min(1, submersionDepth / ballSize);
                const buoyancyForce = waterBuoyancy * submersionRatio;
                velocityY -= buoyancyForce; // Upward force
                
                // Apply water drag scaled by submersion depth
                // Stronger horizontal damping near the surface to reduce sliding
                const scaledDragY = 1 - (1 - waterDragBase) * submersionRatio;
                const surfaceFactor = Math.sqrt(Math.min(1, submersionRatio + 0.05));
                const scaledDragXStrong = 1 - (1 - waterDragXSurface) * surfaceFactor;
                const isGrace = (now - waterEntryAt) < 500; // ~0.5s of normal sliding
                const scaledDragX = isGrace ? 0.98 : scaledDragXStrong;
                velocityX *= scaledDragX;
                velocityY *= scaledDragY;
                
                // Reduced gravity in water (more realistic floating)
                velocityY += gravity * 0.15; // gentler gravity effect while submerged
            } else {
                // Air physics (normal)
                velocityY += gravity;
                velocityX *= friction;
                velocityY *= friction;
            }
            
            // Stop very small movements to prevent infinite gliding
            if (Math.abs(velocityX) < 0.1) velocityX = 0;
            if (Math.abs(velocityY) < 0.1 && ballY >= bounds.height - 110) velocityY = 0; // Only stop Y when near ground
            
            // Update position with both horizontal and vertical velocity
            ballX += velocityX;
            ballY += velocityY;
            
            // Water surface collision - enforce the barrier
            const finalWaterSurface = getWaterSurfaceAt(ballCenterX, bounds);
            
            // Prevent the ball from sinking unrealistically below the surface
            if (ballBottomY > finalWaterSurface) {
                ballY = finalWaterSurface - ballSize; // sit on the surface
                if (velocityY > 0) {
                    velocityY = -velocityY * bounce * 0.35; // slightly bouncier beach-ball feel on water
                }
            }
            
            // Check for wall collisions (horizontal bounds)
            if (ballX <= 0) {
                ballX = 0;
                velocityX = -velocityX * bounce; // Bounce off left wall
            } else if (ballX >= bounds.width - ballSize) {
                ballX = bounds.width - ballSize;
                velocityX = -velocityX * bounce; // Bounce off right wall
            }
            
            // Check for ground collision (bottom of container)
            const ground = bounds.height - ballSize;
            if (ballY >= ground) {
                ballY = ground;
                velocityY = -velocityY * bounce; // Bounce with damping
                
                // Stop tiny bounces
                if (Math.abs(velocityY) < 2) {
                    velocityY = 0;
                }
            }
            
            // Check for ceiling collision
            if (ballY <= 0) {
                ballY = 0;
                velocityY = -velocityY * bounce;
            }
            
            // Remember water state for next frame
            prevInWater = inWater;
            
            updateBallPosition();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const bounds = getContainerBounds();
        const ballSize = 100;
        
        // Hide/show ball based on mobile viewport
        if (isMobileViewport()) {
            ball.style.display = 'none';
        } else {
            ball.style.display = 'block';
            // Adjust position if ball is out of bounds
            ballX = Math.max(0, Math.min(bounds.width - ballSize, ballX));
            ballY = Math.max(0, Math.min(bounds.height - ballSize, ballY));
            updateBallPosition();
        }
    });
    
    // Set initial position and start animation
    updateBallPosition();
    animate();
    } // End of ball creation conditional
});

// Initialize dropdown state on page load
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('searchDropdown');
    const button = document.getElementById('searchToggleButton');
    
    // Ensure dropdown starts hidden and button shows correct text
    if (dropdown && button) {
        dropdown.style.display = 'block';
        button.innerHTML = 'Hide Contact Management';
    }
});

// On entering colors page, fade in underwater cap/fill to feel "under the wave"
document.addEventListener('DOMContentLoaded', function(){
    if (window.location.pathname.includes('color.html')){
        var fill = document.querySelector('.ocean-fill');
        var cap = document.querySelector('.ocean-cap');
        if (fill){
            fill.style.opacity = '0';
            setTimeout(function(){ fill.style.transition = 'opacity 400ms ease'; fill.style.opacity = '0.7'; }, 60);
        }
        if (cap){
            cap.style.opacity = '0';
            setTimeout(function(){ cap.style.transition = 'opacity 400ms ease'; cap.style.opacity = '0.7'; }, 60);
        }
    }
});

// Dropdown toggle function for contact management
function toggleSearchDropdown() {
    const dropdown = document.getElementById('searchDropdown');
    const button = document.getElementById('searchToggleButton');
    
    // Check if dropdown is currently hidden
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        button.innerHTML = 'Hide Contact Management';
    } else {
        dropdown.style.display = 'none';
        button.innerHTML = 'Contact Management';
    }
}

// Menu toggle function
function toggleMenu() {
    const menu = document.getElementById('menuDropdown');
    menu.classList.toggle('show');
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!e.target.closest('.menu-button') && !e.target.closest('.menu-dropdown')) {
            menu.classList.remove('show');
            document.removeEventListener('click', closeMenu);
        }
    });
}
