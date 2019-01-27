//API key for Recipe Search API

var apiKey = "68d16f10adfdfaed91c7325de496ce48";
var apiId = "7f4b800a";

//Declare variables

var searchTerm = "";
var searchItems = [];
var numIngredients = 0;
var numResults = 0;
var numTime = 0;
var chosenSearch = [];

// Initialize Firebase - 'bootcamp-for admin reference'
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

//queryURL base
var queryURLBase =
  "https://api.edamam.com/search?from=0&to=20&app_id=" +
  apiId +
  "&app_key=" +
  apiKey;

//Show Index Banner and Hide Results Banner
$(document).ready(function() {
  $("#index-banner-Index").show();
  $("#form-container").show();
  $("#index-banner-results").hide();
  //Hide ingredients inputs
  $("#secondterm").hide();
  $("#searchTerm2").hide();
  //Hide Bottom Result Area
  $("#result-bottom-banner").hide();
  $("#result-footer").hide();
});

//Get the data from the Recipe Search API
function runQuery(numSearch, queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    $("#displayResults").empty();
    console.log(response);

    //TODO
    //add function -- response in a right order -- take in response and return a new response in a new right order
    //reassign the response by creating a new variable to store the response
    //response = calculateOrder(response);
    //define the function outside of the runQuery function 
    //check with firebase database 

    //note: calculateCookPrepTime(response, element) --passing more than one argument inside of a function 

    //Logic for cook/prep time
    if (parseInt(numTime) === 30) {
      response.hits.forEach(function(element) {
        if (
          element.recipe.totalTime < numTime &&
          element.recipe.totalTime != 0
        ) {
          chosenSearch.push(element.recipe);
        }
      });
    }

    if (parseInt(numTime) === 60) {
      response.hits.forEach(function(element) {
        if (
          element.recipe.totalTime < numTime &&
          element.recipe.totalTime > 30 &&
          element.recipe.totalTime != 0
        ) {
          chosenSearch.push(element.recipe);
        }
      });
    }

    if (parseInt(numTime) === 120) {
      response.hits.forEach(function(element) {
        if (
          element.recipe.totalTime < numTime &&
          element.recipe.totalTime > 60 &&
          element.recipe.totalTime != 0
        ) {
          chosenSearch.push(element.recipe);
        }
      });
    }
    //Hide the Loading Gif
    $("#loading-gif").hide();


    //Back-button to Search Form
    var backBtn = $("<a>");
    backBtn.attr("href", "index.html");
    backBtn.addClass("btn-floating pulse mt-3 mb-3 red");
    var backIcon = $("<i>");
    backIcon.addClass("large material-icons icon-white");
    backIcon.text("arrow_back");
    backBtn.append(backIcon);
    $("#display-back-button").append(backBtn);
    
    //Display Search Results
    chosenSearch.slice(0, numSearch).forEach(function(element, i) {
      var calories = Math.round(element.calories / element.yield);

      //Display Card Section for Each Recipe Result
      var displaySection = $("<div>");
      displaySection.attr("id", "recipe-" + i);
      displaySection.addClass("card p-3 m-2 w-100 h-100");
      $("#displayResults").append(displaySection);

      //Display Videos of Each Recipe Result
      var displayVideo = $("<div>");
      displayVideo.attr("id", "player-" + i);
      displayVideo.addClass("m-2");

      var displayVideo1 = $("<div>");
      displayVideo1.attr("id", "player1-" + i);
      displayVideo1.addClass("m-2");

      var displayVideo2 = $("<div>");
      displayVideo2.attr("id", "player2-" + i);
      displayVideo2.addClass("m-2");
      //Video Container for the above videos
      var videoSection = $("<div>");
      videoSection.attr("id", "videoSection-" + i);
      videoSection.append(displayVideo);
      videoSection.append(displayVideo1);
      videoSection.append(displayVideo2);

      //Modal display code for videoSection
      var modal_Div = $("<div>");
      modal_Div.addClass("modal modal-fixed-footer");
      modal_Div.attr("id", "modal-" + i);
      var modal_content = $("<div>");
      modal_content.addClass("modal-content");
      var modal_title = $("<h4>");
      modal_title.text(element.label.toUpperCase());
      var modal_subtext = $("<p>");
      modal_subtext.text("Sample Videos Related to this Recipe");

      modal_content.append(modal_title);
      modal_content.append(modal_subtext);
      modal_content.append(videoSection);
      modal_Div.append(modal_content);

      var modal_footer = $("<div>");
      modal_footer.addClass("modal-footer");
      var modal_close = $("<a>");
      modal_close.attr("href", "#!");
      modal_close.addClass("modal-close waves-effect waves-green btn-flat");
      modal_close.text("Close");

      modal_footer.append(modal_close);
      modal_Div.append(modal_footer);
      $("#modal").append(modal_Div);
      $(".modal").modal();

      //instruction Button
      var instructionBtn = $("<button>");
      instructionBtn.attr("src", element.url);
      instructionBtn.text("See Instructions");
      instructionBtn.addClass(
        "instructionBtn w-25 m-3 waves-effect waves-light btn"
      );

      //Youtube video Button
      var youtubeBtn = $("<button>");
      youtubeBtn.attr("name", element.label);
      youtubeBtn.attr("index", i);
      youtubeBtn.attr("data-target", "modal-" + i);
      youtubeBtn.text("Show Sample Videos");
      youtubeBtn.addClass(
        "videoBtn waves-effect waves-light btn modal-trigger"
      );

      //Save to My Recipes Button
      var saveBtn = $("<button>");
      saveBtn.attr("data-title", element.label);
      saveBtn.attr("data-image", element.image);
      saveBtn.attr("data-calories", calories);
      saveBtn.attr("data-ingredientLines", element.ingredientLines);
      saveBtn.attr("data-dietLabel", element.dietLabels);
      saveBtn.attr("data-healthLabel", element.healthLabels);
      saveBtn.attr("data-url", element.url);
      saveBtn.attr("data-totalTime", element.totalTime);
      saveBtn.text("Save to Collections");
      saveBtn.addClass("saveBtn waves-effect waves-light btn modal-trigger ml-3");


      //Buttons Container for the above three buttons
      var buttonSection = $("<div>");
      buttonSection.attr("id", "buttonSection-" + i);
      buttonSection.append(instructionBtn);
      buttonSection.append(youtubeBtn);
      buttonSection.append(saveBtn);

      //Attach the Recipe Result content to the appropriate Card Section Div
      $("#recipe-" + i).append("<h3>" + element.label.toUpperCase() + "</h3>");
      $("#recipe-" + i).append(
        "<h5>" +
          element.healthLabels.join(" ") +
          " [ <i>" +
          element.dietLabels.join(" ") +
          " </i>]" +
          "</h5>"
      );
      $("#recipe-" + i).append(
        "<p>" + element.ingredientLines.join("\n") + "</p>"
      );
      $("#recipe-" + i).append(
        "<img class= 'rounded float-left w-25 h-50' src='" +
          element.image +
          "'></img>"
      );
      $("#recipe-" + i).append(
        "<h5> Total Calories/person: " + calories + "</h5>"
      );
      $("#recipe-" + i).append(
        "<h5> Total Cook/Prep Time: " + element.totalTime + " mins </h5>"
      );
      $("#recipe-" + i).append(buttonSection);
    });
  });
}

//Search Recipe Button
$("#searchBtn").on("click", function() {
  event.preventDefault();
  chosenSearch = [];
  var newURL;

  searchTerm = $("#searchTerm")
    .val()
    .trim();

  searchTerm1 = $("#searchTerm1")
    .val()
    .trim();

  searchTerm2 = $("#searchTerm2")
    .val()
    .trim();

  numTime = $("#numTime").val();

  numResults = $("#numResults").val();


  //Logic for multiple ingredients
  if (searchTerm === "") {
    $("#wrong-message").text("Please fill in at least one ingredient!");
    return false;
  } else if (
    !(searchTerm === "") &&
    !(searchTerm1 === "") &&
    !(searchTerm2 === "")
  ) {
    newURL =
      queryURLBase +
      "&q=" +
      "+" +
      searchTerm +
      "+" +
      searchTerm1 +
      "+" +
      searchTerm2;

    //Run this function to GET the Recipe Search API data
    runQuery(parseInt(numResults), newURL);
  } else if (!(searchTerm === "") && !(searchTerm1 === "")) {
    newURL = queryURLBase + "&q=" + "+" + searchTerm + "+" + searchTerm1;

    runQuery(parseInt(numResults), newURL);

  } else if (!(searchTerm === "")) {
    newURL = queryURLBase + "&q=" + searchTerm;

    runQuery(parseInt(numResults), newURL);
  }
  //Using JQuery to hide and show results info
  $("#form-container").hide();
  $("#index-banner-Index").hide();
  $("#index-banner-results").show();
  $("#index-banner-results").attr("style", "display: block");
  $("#navbar").attr("class", "red");
  //Hide Search Area and show Result Area
  $("#result-bottom-banner").show();
  $("#result-footer").show();
  $("#search-bottom-banner").hide();
  $("#search-footer").hide();

  //Show the loading gif 
  var showGif = $("<img>");
  showGif.attr("src", "assets/loading.gif");
  $("#loading-gif").append(showGif);
  //more search 
  //$("#loading-gif").show();
});

//add ingredient input once the add icon is clicked
$("#add-term-btn").on("click", function() {
  $("#secondterm").show();
});

$(document).on("click", "#add-term-btn1", function() {
  $("#searchTerm2").show();
});

//Instruction Button opens up a new page in a new window
$(document).on("click", ".instructionBtn", function() {
  var url = $(this).attr("src");
  window.open(url);
});

//Save Button allows to get all the Recipe Data and store them inside of Firebase
$(document).on("click", ".saveBtn", function() {
  var title = $(this).attr("data-title");
  var image = $(this).attr("data-image");
  var calories = $(this).attr("data-calories");
  var dietLabel = $(this).attr("data-dietLabel");
  var healthLabel = $(this).attr("data-healthLabel");
  var ingredientLines = $(this).attr("data-ingredientLines");
  var totalTime = $(this).attr("data-totalTime");
  var url = $(this).attr("data-url");
  //push data to Firebase database
  database.ref().push({
    title: title,
    image: image,
    calories: calories,
    dietLabel: dietLabel,
    healthLabel: healthLabel,
    ingredientLines: ingredientLines,
    totalTime: totalTime,
    url: url,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

//Array to store video IDs -- in order to choose how many videos to display
var videoIdArray = [];
//Attach Youtube IFrame player API codes to display youtube videos
//This code loads the IFrame Player API code asynchronously
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//GET Youtube Data API data --- specifically 'videoId'
//Insert the videoIds (found in Data API) into the Iframe player API to display
$(document).on("click", ".videoBtn", function() {
  videoIdArray = [];
  var name = $(this).attr("name");
  var index = $(this).attr("index");
  var queryURL =
    "https://www.googleapis.com/youtube/v3/search?q=" +
    name +
    "&part=snippet&key=AIzaSyAcwzTei_3ijB48GQzlph93ht_rExhGKM4";

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .done(function(result) {
      //push the videoId into the videoIdArray to store
      result.items.forEach(function(element) {
        videoIdArray.push(element.id.videoId);
      });
      //See Console for this array to know what it stores
      console.log(videoIdArray);

      //This function creates an <iframe> (and YouTube player) after the API code downloads
      function onYouTubeIframeAPIReady() {
        player = new YT.Player("player-" + index, {
          height: "150",
          width: "300",
          videoId: videoIdArray[0],
          events: {
            onReady: onPlayerReady
          }
        });
      }

      function onYouTubeIframeAPIReady1() {
        player1 = new YT.Player("player1-" + index, {
          height: "150",
          width: "300",
          videoId: videoIdArray[1],
          events: {
            onReady: onPlayerReady
          }
        });
      }

      function onYouTubeIframeAPIReady2() {
        player2 = new YT.Player("player2-" + index, {
          height: "150",
          width: "300",
          videoId: videoIdArray[2],
          events: {
            onReady: onPlayerReady
          }
        });
      }
      // The API will call this function when the video player is ready.
      var done = false;
      function onPlayerReady(event) {
        if (done) {
          event.target.playVideo();
          done = true;
        }
      }
      //Call on the function to display the videos
      onYouTubeIframeAPIReady();
      onYouTubeIframeAPIReady1();
      onYouTubeIframeAPIReady2();
    })
    .fail(function(err) {
      throw err;
    });
});
