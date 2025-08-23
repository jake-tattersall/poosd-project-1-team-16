<?php

    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;

    //establishes connection to the database
    $conn = new mysqli("localhost", "TheShark", "GreatWhite16", "Project1");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        //searches for contacts that match the search string in either first or last name
        $stmt = $conn->prepare("SELECT FirstName, LastName FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
        
        //search for any partcial matches
        $contactName = "%" . $inData["search"] . "%";
        
        
        $stmt->bind_param("sss", $contactName, $contactName, $inData["userId"]);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc())
        {
            if( $searchCount > 0 )
            {
                $searchResults .= ",";
            }
            $searchCount++;
            
            //returns the first and last names of the matching contacts
            $searchResults .= '{"firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '"}';
        }
        
        //if no records were found, return an error message
        if( $searchCount == 0 )
        {
            returnWithError( "No Records Found" );
        }
        else
        {
            returnWithInfo( $searchResults );
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
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    
    function returnWithInfo( $searchResults )
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }
    
?>

