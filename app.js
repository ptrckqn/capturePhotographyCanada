var express        = require("express"),
app            = express(),
mongoose       = require("mongoose"),
methodOverride = require("method-override"),
url            = require("url"),
//Uploading to DB
bodyParser     = require("body-parser"),
Image          = require("./models/image"),
cloudinary     = require("cloudinary"),
//Multer file upload. Might have to npm install --save multer
multer         = require("multer"),
storage        = multer.diskStorage({
                  destination: function(req, file, cb){
                    cb(null, "public/uploads")
                  },
                  filename: function(req, file, cb){
                    cb(null, Date.now() + ".jpg")
                  }
                }),
upload         = multer({storage: storage}),

//User Authentication
User           = require("./models/user"),
passport       = require("passport"),
LocalStrategy  = require("passport-local"),

//Contact Form
nodemailer     = require("nodemailer");

//Connecting to the MongoDB database
// mongoose.connect("mongodb://localhost:27017/capture_photography_canada", {useNewUrlParser: true});
mongoose.connect("mongodb://admin:capturepass88@ds115124.mlab.com:15124/capturephotographycanada", {useNewUrlParser: true});

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true})); //Using bodyparser
app.set("view engine", "ejs"); //EJS files used to render HTML
app.use(express.static(__dirname + "/public")); //Public folder being used to store files such as CSS, JS, and images

//Passport Configuration
app.use(require("express-session")({
  secret: "Theo and Amelia are the best!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

cloudinary.config({
  cloud_name: "dzpvgtcdp",
  api_key: "694265316154491",
  api_secret: "EQfA1I-MAYQmfl2WzJHeAijgxo4"
});

//Landing
app.get("/", function(req, res){
  res.render("landing");
});

//Portfolio
app.get("/portfolio", function(req, res){
  Image.find({}, function(err, images){
    if(err){
      console.log(err);
    }
    else{
      res.render("portfolio", {images: images});
    }
  });
});

app.get("/portfolio/wedding", function(req, res){
  Image.find({tag: "wedding"}, function(err, images){
    if(err){
      console.log(err);
    }
    else{
      res.render("portfolio", {images: images});
    }
  });
});

app.get("/portfolio/family", function(req, res){
  Image.find({tag: "family"}, function(err, images){
    if(err){
      console.log(err);
    }
    else{
      res.render("portfolio", {images: images});
    }
  });
});

app.get("/portfolio/newborn", function(req, res){
  Image.find({tag: "newborn"}, function(err, images){
    if(err){
      console.log(err);
    }
    else{
      res.render("portfolio", {images: images});
    }
  });
});

app.get("/portfolio/scenery", function(req, res){
  Image.find({tag: "scenery"}, function(err, images){
    if(err){
      console.log(err);
    }
    else{
      res.render("portfolio", {images: images});
    }
  });
});

//Uploading new images
app.get("/portfolio/new", isLoggedIn, function(req, res){
  res.render("new");
});

app.post("/portfolio", isLoggedIn, upload.single("uploadedImage"), function(req, res){
  console.log(req.file);
  cloudinary.v2.uploader.upload(req.file.path, function(err, result){
    if(err){
      console.log(err)
    }
    else{
      var newImage = {
        path: result.url,
        tag: req.body.tag,
        public_id: result.public_id
      };
      Image.create(newImage, function(err, newImage){
        if(err){
          console.log(err);
        }
        else{
          res.redirect("portfolio/new");
        }
      });
    }
  });
});

//Destroy images
// app.delete("/portfolio", function(req, res){
//   var query = url.parse(req.url, true);
//   var imageURL = "\"" + req.query.id + "\"";
//   Image.find({path: imageURL}, function(err, image){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log(image);
//     }
//   });
// });
//        <form class="" action="/portfolio/?_method=DELETE&id=<%=imageArray[i]%>" method="POST">
      //    <input type="submit" class="deleteButton" value="Delete">
    //    </form>

//Register route used once to create admin account
// app.get("/register", function(req, res){
//   res.render("register");
// });
//
// app.post("/register", function(req, res){
//   var newUser = new User({username: req.body.username});
//   User.register(newUser, req.body.password, function(err, user){
//     if(err){
//       console.log(err);
//     }
//     passport.authenticate("local")(req, res, function(){
//       res.redirect("/");
//     });
//   });
// });

//Login route
app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate("local",
{
  successRedirect: "/portfolio/new",
  failureRedirect: "/login"
}
));


//Contact routes
app.get("/contact", function(req, res){
  res.render("contact");
});

app.post("/contact", function(req, res){
  var smtpTrans = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mySMTP.17@gmail.com",
      pass: "kuqVuz-tempab-4hurhy"
    }
  });

  var mailOpts = {
    to: "Capturephotographycanada@gmail.com",
    subject: "New Capture Photography Canada Message",
    text: "Name: " + req.body.name + "\nEmail: " + req.body.email + "\n\nMessage:\n" + req.body.message
  };

  smtpTrans.sendMail(mailOpts, function(err, response){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/portfolio");
    }
  })
});

//404 Error
app.get("*", function(req, res){
  res.send("404 Error. Page not found");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

//Local testing port
// app.list(3000, function(){
//   console.log("App is running on port 3000");
// });

//Deployed on Heroku port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
