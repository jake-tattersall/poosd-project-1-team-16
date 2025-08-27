
INITIAL_CMDS = """create database Project1;

use Project1;

CREATE TABLE `Project1`.`Contacts` ( `ID` INT NOT NULL AUTO_INCREMENT , `FirstName` VARCHAR(50) NOT NULL DEFAULT '' , `LastName` VARCHAR(50) NOT NULL DEFAULT '' , `Phone` VARCHAR(50) NOT NULL DEFAULT '' , `Email` VARCHAR(50) NOT NULL DEFAULT '' , `Address` VARCHAR(100) NOT NULL DEFAULT '', `UserID` INT NOT NULL DEFAULT '0' , PRIMARY KEY (`ID`) ) ENGINE = InnoDB;

CREATE TABLE `Project1`.`Users` ( `ID` INT NOT NULL AUTO_INCREMENT , `FirstName` VARCHAR(50) NOT NULL DEFAULT '' , `LastName` VARCHAR(50) NOT NULL DEFAULT '' , `Login` VARCHAR(50) NOT NULL DEFAULT '' , `Password` VARCHAR(50) NOT NULL DEFAULT '' , PRIMARY KEY (`ID`)) ENGINE = InnoDB;

"""

Users = [
    ('Rick','Leinecker','RickL','COP4331'),
    ('Admin','Admin','Admin','Admin'),
    ('Test','Test','Test','Test'),
    ('John','Doe','JohnD','DoeJohn'),
]

Contacts = [
    ('John', 'Doe', '123-456-7890', 'example@ucf.edu', '123 Street, City, State', 1),
    ('John', 'Doe', '123-456-7890', 'example@ucf.edu', '123 Street, City, State', 2),
    ('John', 'Doe', '123-456-7890', 'example@ucf.edu', '123 Street, City, State', 3),
    ('Jane', 'Doe', '987-654-3210', 'other@ucf.edu', '456 Avenue, City, State', 1),
    ('Jane', 'Doe', '987-654-3210', 'other@ucf.edu', '456 Avenue, City, State', 2),
    ('Jane', 'Doe', '987-654-3210', 'other@ucf.edu', '456 Avenue, City, State', 3),
    ('UniqueTo', 'Rick', '111-222-3333', '1@ucf.edu', '1 Street, City, State', 1),
    ('UniqueTo', 'Admin', '444-555-6666', '2@ucf.edu', '2 Avenue, City, State', 2),
    ('UniqueTo', 'Test', '777-888-9999', '3@ucf.edu', '3 Boulevard, City, State', 3),
]

with open('jake\\create_db_cmds.txt', 'w') as f:
    f.write(INITIAL_CMDS)
    for user in Users:
        f.write(f"INSERT INTO Users (`FirstName`, `LastName`, `Login`, `Password`) VALUES ('{user[0]}', '{user[1]}', '{user[2]}', '{user[3]}');\n")
    f.write("\n")
    for contact in Contacts:
        f.write(f"INSERT INTO Contacts (`FirstName`, `LastName`, `Phone`, `Email`, `Address`, `UserID`) VALUES ('{contact[0]}', '{contact[1]}', '{contact[2]}', '{contact[3]}', '{contact[4]}', {contact[5]});\n")

print("Done!")