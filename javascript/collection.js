// Initialize Firebase
var config = {
    apiKey: "AIzaSyC9DKpx43Vp_crjyB6Auv2i9QyS2vp5ztI",
    authDomain: "my-project-bb79e.firebaseapp.com",
    databaseURL: "https://my-project-bb79e.firebaseio.com",
    projectId: "my-project-bb79e",
    storageBucket: "",
    messagingSenderId: "519592625731"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  


//child-added event listener listenning to nodes 
database.ref().on("child_added", function(snapshot) {

    console.log(snapshot);

    console.log(snapshot.val());

    var content = snapshot.val();

    console.log(content.title);

    var newRow = $("<div>"); 

    newRow.addClass("border m-4 p-3");

    newRow.html("<h1>" + content.title + "</h1>" + "<img src='" + content.image + "' />" + 
    "<p>"+content.healthLabel + "[<i>" + content.dietLabel + "</i>]</p>" + "<p>Total Calories: " + content.calories + "/person</p>"
    + "<a href ='" + content.url + "'>" + content.url + "</a>");

    $("#display-collection").prepend(newRow);
  
  });
