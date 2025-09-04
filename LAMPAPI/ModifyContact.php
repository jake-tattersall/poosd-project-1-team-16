<?php
    $inData = getRequestInfo();

    $id = $inData["id"];
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $address = $inData["address"];

    $conn = new mysqli("localhost", "TheShark", "GreatWhite16", "Project1");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=?, Address=? WHERE ID=? AND UserID=?");
        $stmt->bind_param("ssssssi", $firstName, $lastName, $phone, $email, $address, $id, $userId);
        if($stmt->execute()) {
            returnWithInfo("Contact modified successfully");
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
