# poosd-project-1-team-16

## About

This is Project 1 Team 16's repo.

## Database

There are two tables: Users and Contacts

- The Users table contains the following:
    - `ID` INT NOT NULL AUTO_INCREMENT (This is the Primary Key)
    - `FirstName` VARCHAR(50) NOT NULL DEFAULT ''
    - `LastName` VARCHAR(50) NOT NULL DEFAULT ''
    - `Login` VARCHAR(50) NOT NULL DEFAULT '' , 
    - `Password` VARCHAR(50) NOT NULL DEFAULT ''
- The Contacts table contains the following:
    - `ID` INT NOT NULL AUTO_INCREMENT (This is the Primary key)
    - `FirstName` VARCHAR(50) NOT NULL DEFAULT ''
    - `LastName` VARCHAR(50) NOT NULL DEFAULT ''
    - `Phone` VARCHAR(50) NOT NULL DEFAULT ''
    - `Email` VARCHAR(50) NOT NULL DEFAULT ''
    - `Address` VARCHAR(100) NOT NULL DEFAULT ''
    - `UserID` INT NOT NULL DEFAULT '0' (Foreign Key to Users.ID)

## API

## Front-End
