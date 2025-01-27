# User Stories

1. As a user, I should be able to:
Register an account with username, email and password (clerk.js)
Log in securely and setup my profile with profile picture, gender, an optional option to upload Vehicle's number plate and Id card number( if user wants to be a driver, will be verified by the admin)
Provide my commute details, preferences and get matched with drivers and can request the choosen driver 
Schedule rides in advance and receive notifications for upcoming rides
View a dashboard of scheduled carpools 
Communicate with matched carpool driver through in-app chat
Cancel scheduled rides and provide feedback after completed rides


2. As a driver, I should be able to:
Create carpools by specifying routes, schedules, gender, prices and available seats (before this uploading vehicle's number plate and Id card number in profile setup and getting it verified is compulsory)
View and accept/reject passenger requests for rides
View a dashboard of scheduled carpoola
Communicate with passengers using the in-app chat feature individually 
Receive real-time notifications about passenger activity, such as booking or cancellations
Cancel rides if necessary and notify passengers


3. As a system, I should be able to:
Allow user registration and secure authentication
Collect and store user profiles, commute details, and preferences in a database
Match users based on geospatial data, schedules, and preferences
Send real-time notifications for ride matches, confirmations, and cancellations
Facilitate real-time communication between users via chat
Handle feedback submissions and store them securely