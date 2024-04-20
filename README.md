# Description
A canvas-like API that allows instructors and students to create and submit assignments. <br />
See the "Tarpaulin Postman Tests.json" and "Tarpaulin Project Proposal.pdf" for more details.
# Setup and Run
$ npm init <br />
$ docker run -d --name mongo-server -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=pass -p "27017:27017" mongo <br />
<br />
$ npm install <br />
$ docker container start mongo-server <br />
$ docker exec -it mongo-server /bin/bash <br />
&nbsp;&nbsp;&nbsp;&nbsp;# mongosh --username root --password pass --authenticationDatabase admin <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;> use tarpaulin <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;> db.createUser({user: "tarpaulin", pwd: "pass", roles:[{role: "readWrite", db: "tarpaulin"}]}) <br />
$ node populateDb.js <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;> db.getCollectionNames() <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;> db.users.find() <br />
<br />
$ docker run -d --name redis-server -p 6379:6379 redis <br />
$ docker container start redis-server <br />
<br />
$ node server.js <br />
