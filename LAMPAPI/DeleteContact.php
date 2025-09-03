<?php
    $inData = getRequestInfo();

    $id = $inData["id"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheShark", "GreatWhite16", "Project1");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
        $stmt->bind_param("si", $id, $userId);
        if($stmt->execute()) {
            returnWithInfo("Contact deleted successfully");
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