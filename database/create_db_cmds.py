INITIAL_CMDS = """create database Project1;

use Project1;

CREATE TABLE `Project1`.`Contacts` ( `ID` INT NOT NULL AUTO_INCREMENT , `FirstName` VARCHAR(50) NOT NULL DEFAULT '' , `LastName` VARCHAR(50) NOT NULL DEFAULT '' , `Phone` VARCHAR(50) NOT NULL DEFAULT '' , `Email` VARCHAR(50) NOT NULL DEFAULT '' , `Address` VARCHAR(100) NOT NULL DEFAULT '', `UserID` INT NOT NULL DEFAULT '0' , PRIMARY KEY (`ID`) ) ENGINE = InnoDB;

CREATE TABLE `Project1`.`Users` ( `ID` INT NOT NULL AUTO_INCREMENT , `FirstName` VARCHAR(50) NOT NULL DEFAULT '' , `LastName` VARCHAR(50) NOT NULL DEFAULT '' , `Login` VARCHAR(50) NOT NULL DEFAULT '' , `Password` VARCHAR(50) NOT NULL DEFAULT '' , PRIMARY KEY (`ID`)) ENGINE = InnoDB;

"""

Users = [
    ('Rick','Leinecker','RickL','COP4331'),
    ('Admin','Admin','Admin','Admin'),
    ('test','test','test','test'),
    ('John','Doe','username','password'),
    ('Jake','Tattersall','jake','password123')
]

Contacts = [
    ('Alice', 'Smith', '321-654-9870', 'alice@ucf.edu', '789 Blvd, City, State', 1),
    ('Amara', 'Lopez', '555-234-1111', 'amara@ucf.edu', '12 Sunset Dr, City, State', 1),
    ('Bob', 'Johnson', '555-111-2222', 'bob@ucf.edu', '', 1),
    ('Charlie', 'Brown', '555-333-4444', '', '222 Drive, City, State', 1),
    ('Diana', 'Prince', '', 'diana@ucf.edu', '333 Court, City, State', 1),
    ('Eve', 'Adams', '555-666-7777', 'eve@ucf.edu', '', 1),
    ('Frank', 'Miller', '555-888-9999', 'frank@ucf.edu', '555 Parkway, City, State', 1),
    ('Grace', 'Hopper', '555-000-1111', 'grace@ucf.edu', '666 Street, City, State', 4),
    ('Henry', 'Ford', '', '', '777 Avenue, City, State', 1),
    ('Ivy', 'Taylor', '555-444-5555', '', '888 Blvd, City, State', 1),
    ('Jack', 'Black', '555-777-8888', 'jack@ucf.edu', '999 Lane, City, State', 1),
    ('Jack', 'Black', '555-777-8888', 'jack@ucf.edu', '999 Lane, City, State', 4),
    ('Jane', 'Doe', '987-654-3210', 'other@ucf.edu', '456 Avenue, City, State', 1),
    ('Jane', 'Doe', '987-654-3210', 'other@ucf.edu', '456 Avenue, City, State', 2),
    ('Jane', 'Doe', '987-654-3210', 'other@ucf.edu', '456 Avenue, City, State', 3),
    ('Jasper', 'Nguyen', '555-112-3344', 'jasper@ucf.edu', '88 Market St, City, State', 1),
    ('John', 'Doe', '123-456-7890', 'example@ucf.edu', '123 Street, City, State', 1),
    ('John', 'Doe', '123-456-7890', 'example@ucf.edu', '123 Street, City, State', 2),
    ('John', 'Doe', '123-456-7890', 'example@ucf.edu', '123 Street, City, State', 3),
    ('Karen', 'White', '555-999-0000', 'karen@ucf.edu', '', 1),
    ('Leo', 'King', '555-121-2121', 'leo@ucf.edu', '2020 Court, City, State', 1),
    ('Mia', 'Queen', '555-343-4343', '', '3030 Terrace, City, State', 1),
    ('Nadia', 'Khan', '555-777-2323', 'nadia@ucf.edu', '321 Oak St, City, State', 2),
    ('Olivia', 'Brown', '555-101-0101', 'olivia@ucf.edu', '404 Road, City, State', 2),
    ('Peter', 'Parker', '555-202-0202', 'peter@ucf.edu', '505 Street, City, State', 2),
    ('Quincy', 'Adler', '555-303-0303', 'quincy@ucf.edu', '', 3),
    ('Rachel', 'Green', '', 'rachel@ucf.edu', '707 Drive, City, State', 3),
    ('Samira', 'Velasquez', '555-898-4545', 'samira@ucf.edu', '900 Grove Rd, City, State', 4),
    ('UniqueTo', 'Admin', '444-555-6666', '2@ucf.edu', '2 Avenue, City, State', 2),
    ('UniqueTo', 'Rick', '111-222-3333', '1@ucf.edu', '1 Street, City, State', 1),
    ('UniqueTo', 'Test', '777-888-9999', '3@ucf.edu', '3 Boulevard, City, State', 3),
    ('Yara', 'Singh', '555-321-7654', 'yara@ucf.edu', '1212 Palm Ct, City, State', 1),
    ('Alice', 'Smith', '321-654-9870', 'alice@ucf.edu', '789 Blvd, City, State', 5),
    ('Bob', 'Johnson', '555-111-2222', 'bob@ucf.edu', '', 5),
    ('Charlie', 'Brown', '555-333-4444', '', '222 Drive, City, State', 5),
    ('Diana', 'Prince', '', 'diana@ucf.edu', '333 Court, City, State', 5),
    ('Eve', 'Adams', '555-666-7777', 'eve@ucf.edu', '', 5),
    ('Frank', 'Miller', '555-888-9999', 'frank@ucf.edu', '555 Parkway, City, State', 5),
    ('Grace', 'Hopper', '555-000-1111', 'grace@ucf.edu', '666 Street, City, State', 5),
    ('Henry', 'Ford', '', '', '777 Avenue, City, State', 5),
    ('Ivy', 'Taylor', '555-444-5555', '', '888 Blvd, City, State', 5),
    ('Jake', 'Tattersall', '555-555-5555', 'jake@ucf.edu', '123 Main St, City, State', 5)
]

with open('database\\create_db_cmds.txt', 'w') as f:
    f.write(INITIAL_CMDS)
    for user in Users:
        f.write(f"INSERT INTO Users (`FirstName`, `LastName`, `Login`, `Password`) VALUES ('{user[0]}', '{user[1]}', '{user[2]}', '{user[3]}');\n")
    f.write("\n")
    for contact in Contacts:
        f.write(f"INSERT INTO Contacts (`FirstName`, `LastName`, `Phone`, `Email`, `Address`, `UserID`) VALUES ('{contact[0]}', '{contact[1]}', '{contact[2]}', '{contact[3]}', '{contact[4]}', {contact[5]});\n")

print("Done!")