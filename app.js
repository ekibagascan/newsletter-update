//jshint esversion:6
const express = require("express");
const https = require("https");
//const request = require("request")

const app = express();

app.use(express.urlencoded());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
  const fName = req.body.firstName;
  const lName = req. body.lastName;
  const email = req.body.yourEmail;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
          //ADDRESS: yourEmail
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/ece854ea8f";

  const options = {
    method: "POST",
    auth: "minato:e4d98571fc07b79f9e1e1122cce11b83-us6"
  }

  const request = https.request(url, options, function(response) {
    console.log(response.statusCode);

    response.on("data", (data) => {
      var newAudience = JSON.parse(data);
      console.log(newAudience);

     if(response.statusCode === 200) {
       if(newAudience.error_count >= 1) {
         res.sendFile(__dirname + "/havesubscribe.html");
       }
       else {
         res.sendFile(__dirname + "/success.html");
       }
     } else {
       res.sendFile(__dirname + "/failure.html")
     }
 
    })
 
  })

  request.write(jsonData);
  request.end();

});  

app.post("/failure", (req, res) => {
  res.redirect("/")
});
app.post("/success", (req, res) => {
  res.redirect("/")
});
app.post("/havesubscribe", (req, res) => {
  res.redirect("/")
});


app.listen(process.env.PORT || 8080, () => {
  console.log("Server running at " + process.env.PORT);
});

//api key e4d98571fc07b79f9e1e1122cce11b83-us6
//list id ece854ea8f