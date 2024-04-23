process.stdin.setEncoding("utf8");
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 



// check for proper number of inputs
if(process.argv.length != 3){
    process.stdout.write('Usage pokeServer.js portNumber');
    process.exit(1);
}

// read port number
const portNumber = parseInt(process.argv[2]);
if(Number.isNaN(portNumber)){
    process.stdout.write('Invalid portNumber');
    process.exit(1);
}

// set up MongoDB code
const uri = process.env.MONGO_CONNECTION_STRING;

/* Our database and collection */
const databaseAndCollection = {db: "pokeFight", collection:"users"};
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

// set up express code
const app = express();

// setting up sockets
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './templates'));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/static', express.static('public'))
app.use(bodyParser.json());


// handles get request of index
app.get("/",(request, response) => {
    response.render('index', {error: ""});
  });

app.get("/register",(request, response) => {
    response.render('register', {error:""});
  });

app.get("/main",(request, response) => {
    console.log(request)

    response.render('main')
  });

app.get("/team", (request, response) => {
    response.render('team');
})

app.post("/", async (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    let user = await login(client, databaseAndCollection, username, password);
    if(user != null){
        console.log('Logged in user: '+username)
        response.cookie('id', user._id.toString())
        response.redirect('/main')
    } else {
        console.log('Did not find a user with this combination')
        response.render("index",{error: '<span style="color:red">Username or password incorrect</span><br>'});
        
    }
    
  });


app.post("/register", async (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    let valid = await checkUsername(client, databaseAndCollection, username);
    if(valid){
        let user = await register(client, databaseAndCollection, username, password);
        console.log('Registered user: ')
        response.cookie('id', user.insertedId.toString())
        response.render('main')
    } else {
        console.log('Could not register user')
        response.render("register",{error: '<span style="color:red">Username is already taken, please pick a different one</span><br>'});
    }
    
  });

// command line loop
//app.listen(portNumber);
server.listen(portNumber);
process.stdout.write(`Web server is running at http://localhost:${portNumber}\n`);

const prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.on("readable", function () {
  const dataInput = process.stdin.read();
  if (dataInput !== null) {
    const command = dataInput.trim();
    if (command === "stop") {
      process.stdout.write("Shutting down the server\n");
      process.exit(0);
    } else {
        process.stdout.write("Invalid command: "+command+"\n");
    }
    process.stdout.write(prompt);
    process.stdin.resume();
  }
});


async function register(client, databaseAndCollection, username, password) {
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne({username: username, password: password});
    return result;
}

async function login(client, databaseAndCollection, username, password) {
    let filter = {username : { $eq: username}, password : { $eq: password}};
    const cursor = client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .find(filter);
        
    const result = await cursor.toArray();
    if(result.length == 0){
        return null
    } else {
        return result[0]
    }
}

async function checkUsername(client, databaseAndCollection, username){
    let filter = {username : { $eq: username}};
    const cursor = client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .find(filter);
        
    const result = await cursor.toArray();
    if(result.length == 0){
        return true;
    } else {
        return false;
    }
}
