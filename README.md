# poosd-project-1-team-16

## About

This is Project 1 Team 16's repo.

## To-Do

Week 2
- [ ] All website features work
    - [X] Create
    - [X] Read (Search, List)
    - [ ] Update
    - [X] Delete
    - [x] Login
    - [x] Registration

Week 3

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

There are 6 API endpoints: CRUD + Login, Register.
- **C**reate: AddContact.php
- **R**ead: SearchContacts.php, ListContacts.php
- **U**pdate: UpdateContact.php
- **D**elete: DeleteContact.php
- Login: Login.php
- Register: register.php

## Front-End

**Current HTTP Verbs (Javascript)**
- **C**: POST
- **R**: POST
- **U**: PUT, PATCH
- **D**: DELETE
- Login: POST
- Register: POST

**HTML Files**
- index.html (Login Page)
- register.html (Registration Page)
- color.html (Contact Operations)
  
**JavaScript Files**
- AddContact.js (Adding Contact)
- code.js (Main JS File)
- md5.js (Generate MD5 Hash for Password Storage)
- register.js (Registering User)
  
**CSS Files**
- styles.css (Stylesheet)
