//API key for Recipe Search API

var apiKey = "ad9411943fc77cb3dcb9f5c1f72654de";
var apiId = "b3505691";

//Declare variables

var searchTerm = "";
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

//Access to Local Storage
var array = JSON.parse(localStorage.getItem("searchItems"));
console.log(array);
console.log(
  "First item:" + array[0],
  "Second item:" + array[1],
  "Third item:" + array[2]
);

//Search Button has already removed for the recipes.html page
//and so the search button function is also removed
searchTerm = array[0];

numTime = parseInt(array[1]);

numResults = array[2];

var newURL = queryURLBase + "&q=" + searchTerm;

//Call the runQuery function 
runQuery(parseInt(numResults), newURL);

//Get the data from the Recipe Search API
function runQuery(numSearch, queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    $("#displayResults").empty();

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
      displaySection.addClass("card p-3 m-2 verticalList");
      
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
      instructionBtn.addClass("instructionBtn w-25 m-3");

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
      saveBtn.text("Save to Collections");
      saveBtn.addClass("saveBtn w-25 m-3");

      //Buttons Container for the above three buttons
      var buttonSection = $("<div>");
      buttonSection.attr("id", "buttonSection-" + i);
      buttonSection.append(instructionBtn);
      buttonSection.append(youtubeBtn);
      buttonSection.append(saveBtn);

      $("#displayResults").append(displaySection);

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
      $("#recipe-" + i).append(buttonSection);
    });
  });
}

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
  var url = $(this).attr("data-url");
  //push data to Firebase database
  database.ref().push({
    title: title,
    image: image,
    calories: calories,
    dietLabel: dietLabel,
    healthLabel: healthLabel,
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
