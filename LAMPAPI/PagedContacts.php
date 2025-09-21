<?php

    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;
    $totalContacts = 0;
    $totalPages = 0;
    $currentPage = 1;
    $contactsPerPage = 5;

    //establishes connection to the database
    $conn = new mysqli("localhost", "TheShark", "GreatWhite16", "Project1");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        // Get page number from input (default to 1)
        $currentPage = isset($inData["page"]) ? max(1, (int)$inData["page"]) : 1;
        $userId = (int)$inData["userId"];
        
        // First, count total contacts for this user
        $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM Contacts WHERE UserID = ?");
        $countStmt->bind_param("i", $userId);
        $countStmt->execute();
        $countResult = $countStmt->get_result();
        $countRow = $countResult->fetch_assoc();
        $totalContacts = (int)$countRow["total"];
        $countStmt->close();
        
        // Calculate total pages
        $totalPages = max(1, ceil($totalContacts / $contactsPerPage));
        
        // Ensure current page doesn't exceed total pages
        $currentPage = min($currentPage, $totalPages);
        
        // Calculate offset for LIMIT clause
        $offset = ($currentPage - 1) * $contactsPerPage;
        
        // Get contacts for current page
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email, Address 
                                FROM Contacts 
                                WHERE UserID = ?
                                ORDER BY FirstName ASC, LastName ASC
                                LIMIT ? OFFSET ?");
        
        $stmt->bind_param("iii", $userId, $contactsPerPage, $offset);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc())
        {
            if( $searchCount > 0 )
            {
                $searchResults .= ",";
            }
            $searchCount++;
            
            //return contact details including ID for frontend actions
            $searchResults .= '{"id": ' . $row["ID"] . ', "firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '", "phone": "' . $row["Phone"] . '", "email": "' . $row["Email"] . '", "address": "' . $row["Address"] . '"}';
        }
        
        //if no records were found and it's page 1, return an error message
        if( $searchCount == 0 && $currentPage == 1)
        {
            returnWithError( "No Contacts Found" );
        }
        else
        {
            returnWithPagedInfo( $searchResults, $currentPage, $totalPages, $totalContacts );
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
        $retValue = '{"results":[],"currentPage":1,"totalPages":0,"totalContacts":0,"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    
    function returnWithPagedInfo( $searchResults, $currentPage, $totalPages, $totalContacts )
    {
        $retValue = '{"results":[' . $searchResults . '],"currentPage":' . $currentPage . ',"totalPages":' . $totalPages . ',"totalContacts":' . $totalContacts . ',"error":""}';
        sendResultInfoAsJson( $retValue );
    }
    
?>