const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();



const db = require('./db/server.js');
db.mongoose
  .connect(db.url, {
     useNewUrlParser: true,
     useUnifiedTopology: true
  })
  .then(() => {
     console.log("Connected to the database!");
  })
  .catch(err => {
     console.log("Cannot connect to the database!", err);
     process.exit();
  });




var corsOptions = {
  origin: 'http://localhost:4000'
}



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req, res) => {
  res.json({message: "Welcome to the REST API"});
});


var router = express.Router(); 
const Todo = require('./db/model');  

router.get('/todos', (req, res, next) => {
    Todo.find({}, 'action')
      .then(data => res.json(data))
      .catch(next)
  });
  router.post('/todos', (req, res, next) => {
    if(req.body.action){
      Todo.create(req.body)
        .then(data => res.json(data))
        .catch(next)
   }else{
      res.json({
        error: "The input field is empty!"
      })
    }
  });
  router.delete('/todos/:id', (req, res, next) => {
    Todo.findOneAndDelete({'_id': req.params.id})
      .then(data => res.json(data))
      .catch(next)
  });



app.use('/api', router);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

