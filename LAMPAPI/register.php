<?php
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = strtolower(trim($inData["login"]));
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheShark", "GreatWhite16", "Project1");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Check for duplicate login, login now treated like unique identifier
		$check = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
		$check->bind_param("s", $login);
		$check->execute();
		$res = $check->get_result();
		if ($res && $res->num_rows > 0) {
			$check->close();
			$conn->close();
			returnWithError("Username Already Exists");
			exit;
		}
		$check->close();

		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
		if($stmt->execute()) {
			returnWithInfo("Registration successful");
		} else {
			returnWithError($stmt->error);
		}
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $msg )
	{
		$retValue = '{"error":"", "message":"' . $msg . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>