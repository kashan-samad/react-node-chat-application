# Chat Application

A React + NodeJS chat application that uses ExpressJS, MongoDB and Socket.io for real-time communication between users. 

## Setup Database

Before using the application, MongoDB must be installed and running. Create a DB named chatApp in mongo DB.

## Running the project locally

Clone the project and run the following command from the root of the repo:

    $ npm install
    $ node server.js

In other terminal, run following command to run the client:

    $ npm start

## Mock Data

Once the server is up and running, open the browser and point to following location. This will create 10 users in every run. The usernames are currently created in series like user1, user2 and so on. The passwords for every user is currently set to '123':

http://localhost:8000/import/new

## Client

Use the newly created username/password combinations to log in the system on following url:

http://localhost:8080/
