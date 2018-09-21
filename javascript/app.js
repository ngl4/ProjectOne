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
  "http://api.edamam.com/search?from=0&to=20&app_id=" +
  apiId +
  "&app_key=" +
  apiKey;

//Show Index Banner and Hide Results Banner when loading page 
$( document ).ready(function() {
$("#index-banner-Index").show();
$("#form-container").show();
$("#index-banner-results").hide();
});

//Get the data from the Recipe Search API
function runQuery(numSearch, queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    $("#displayResults").empty();
    console.log(response);

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
      instructionBtn.addClass("instructionBtn w-25 m-3 waves-effect waves-light btn");

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
      saveBtn.addClass("saveBtn w-25 m-3");

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
  chosenSearch = [];
  searchItems = [];

  event.preventDefault();

  console.log(typeof searchTerm);
  console.log(searchTerm);

  searchTerm = $("#searchTerm").val().trim();
  //push all the searchTerm string to the searchItems Array
  searchItems.push(searchTerm);

  console.log(typeof searchTerm);
  console.log(searchTerm);

  numTime = $("#numTime").val();
  console.log(numTime);

  searchItems.push(numTime);

  numResults = $("#numResults").val();

  searchItems.push(numResults);
  //store all the searchItems into Local Storage for later access
  localStorage.setItem("searchItems", JSON.stringify(searchItems));

  var newURL = queryURLBase + "&q=" + searchTerm;
  //Run this function to GET the Recipe Search API data
  runQuery(parseInt(numResults), newURL);
  
  //Using JQuery to hide and show results info
  $("#form-container").hide();
  $("#index-banner-Index").hide();
  $("#index-banner-results").show();
  $("#navbar").attr("class","red");

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
  var ingredientLines= $(this).attr("data-ingredientLines")
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
