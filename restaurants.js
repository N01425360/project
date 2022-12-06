
 var express  = require('express');
 var mongoose = require('mongoose');
 require('dotenv').config();
 var app      = express();
 const jwt=require('jsonwebtoken')
 var database = require('./config/database');
 var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
  
 var port     = process.env.PORT || 4000;
 app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
 app.use(bodyParser.json());                                     // parse application/json
 app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
 
 mongoose.connect(database.url);
 var restaurant = require('./models/restaurants');
 
 
 //Loads the handlebars module
 const Handlebars = require('handlebars')
 const exphbs = require('express-handlebars');
 var path = require('path');
const { json } = require('express');
//const restaurants = require('./models/restaurants');

 
 app.use(express.static(path.join(__dirname, 'public')));
 app.engine('.hbs', exphbs.engine({ 
   extname: '.hbs',
   layoutsDir: path.join(__dirname, '/views/layouts'),
   defaultLayout: 'main',
  
 
 }));

 function verifyToken(req, res, next) {
  const bearerHeadr = req.headers['authorization']
  console.log(bearerHeadr)
  console.log(process.env.SECRETKEY)
  if (typeof bearerHeadr != 'undefined') {
      const bearer = bearerHeadr.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken

      jwt.verify(req.token,
          process.env.SECRETKEY, (err, user) => {
              if (err) {
                  console.log(403)
                  res.sendStatus(403)

              }
              else {
                  req.user = user;
                  console.log(req.user)
                  next()
              }
          });
  }
  else {
      res.render('error', { message: "Token is required!" });
  }
}

app.post('/login', (req,res)=>{
  console.log(req)//Authenticated Userconst
   username = req.body.username
   const user = { name : username }
   const accessToken = jwt.sign(user, process.env.SECRETKEY)
   res.json({ accessToken : accessToken})
})


app.get('/posts', verifyToken, (req, res) => {

  res.json('Verified')
});

 
 app.set('view engine', 'hbs');
 app.get('/api/restaurants', function(req, res) {
	// use mongoose to get all todos in the database
	restaurant.find(function(err, restaurant) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(restaurant); // 

    
	});
});
 
 app.get('/api/restaurants/form', function(req, res) {
 
    const page = req.query.page;
    const perPage  = req.query.perPage;
    const borough = req.query.borough;
    const skip = (page -1) * perPage; 


    restaurant.find(function(err, restaurants) {
          if (err)
              res.status(400).json({err})
              console.log(err);
              
          //res.json(restaurant);
          console.log(restaurants)
          var res1 = JSON.stringify(restaurants);
          res.render('data', {data: JSON.parse(res1), layout: 'main' });
      }).skip(skip).limit(perPage);
  });
 
   
  
  
  
  
 app.post('/api/restaurants', verifyToken,function(req, res) {
 

   

// create mongose method to create a new record into collection
     console.log(req.body);
 
     restaurant.create({
        _id :req.body._id,
         restaurant_id : req.body.restaurant_id,
         name : req.body.name,
         cuisine : req.body.cuisine,
         borough : req.body.borough
 
     }, function(err, _restaurants) {
         if (err)
             res.send(err);
             
         restaurant.find(function(err, restaurants) {
             if (err)
                 res.send(err)
             
                 res.json(restaurants);
                 console.log(" successfully created restaurants");
                 
         });
     });
     
    

 
  });
 
 app.get('/api/restaurants/:restaurant_id', function(req, res) {
     
     var id = req.params.restaurant_id;
     restaurant.findById(id, function(err, restaurant) {
         if (err)
             res.status(400).json({err})
             console.log(err);
 
             res.json(restaurant);
     });
 });





    app.post('/login', (req,res)=>{console.log(req)

      //Authenticated User
  
      const username = req.body.username
  
      const user = { name : username }
  
      const accessToken = jwt.sign(user, process.env.SECRETKEY)
  
      res.json({ accessToken : accessToken})
  
  })



 //Update record
 app.put("/api/restaurants/:restaurant_id",function (req, res) {
 
     // create mongose method to update an existing record into collection
     console.log(req.body);
   
     let id = req.params.restaurant_id;
     var data = {
        _id :req.body._id,
         restaurant_id : req.body.restaurant_id,
         name : req.body.name,
         cuisine : req.body.cuisine,
         borough : req.body.borough
     };
   
     // save the user
     restaurant.findByIdAndUpdate(id, data, function (err, restaurant) {
       if (err) throw err;
   
       res.send("Successfully! Restaurant updated - " + restaurant.name);
       
     });
    }
   );
  


   
   //Delete a Restaurant by ID
   app.delete("/api/restaurants/:restaurant_id", function (req, res) {
     console.log(req.params.restaurant_id);
     let id = req.params.restaurant_id;
     restaurant.deleteOne(
       {
         _id: id,
       },
       function (err) {
         if (err) 
             //res.send(err);
             res.status(400).json({err})
             
         else 
             res.send("Successfully! Restaurant has been Deleted.");
       }
     );
   });
 
 app.listen(port);
 console.log("App listening on port : " + port);
 