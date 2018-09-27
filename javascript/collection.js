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

  console.log(content.dateAdded);

  var newRow = $("<div>");

  newRow.addClass("carousel-item");

  newRow.attr("id", "recipe-" + content.dateAdded);

  newRow.append(
    "<h5>" +
      content.title.toUpperCase() +
      "</h5>" +
      "<img height='250' width='250' class= 'carousel-image rounded float-left w-25 h-50' src='" +
      content.image +
      "' />" +
      "<p>Total Calories: " +
      content.calories +
      "/person</p>" +
      "<p> Total Cook/Prep Time: " +
      content.totalTime +
      " mins </p>"
  );

   //Display Videos of Each Recipe Result
   var displayVideo = $("<div>");
   displayVideo.attr("id", "player-" + content.dateAdded);
   displayVideo.addClass("m-2");

   var displayVideo1 = $("<div>");
   displayVideo1.attr("id", "player1-" + content.dateAdded);
   displayVideo1.addClass("m-2");

   var displayVideo2 = $("<div>");
   displayVideo2.attr("id", "player2-" + content.dateAdded);
   displayVideo2.addClass("m-2");
   //Video Container for the above videos
   var videoSection = $("<div>");
   videoSection.attr("id", "videoSection-" + content.dateAdded);
   videoSection.append(displayVideo);
   videoSection.append(displayVideo1);
   videoSection.append(displayVideo2);

   //Modal display code for videoSection
   var modal_Div = $("<div>");
   modal_Div.addClass("modal modal-fixed-footer");
   modal_Div.attr("id", "modal-" + content.dateAdded);
   var modal_content = $("<div>");
   modal_content.addClass("modal-content");
   var modal_title = $("<h4>");
   modal_title.text(content.title.toUpperCase());
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
  instructionBtn.attr("src", content.url);
  instructionBtn.text("See Instructions");
  instructionBtn.addClass(
    "instructionBtn w-25 m-3 waves-effect waves-light btn"
  );

  //Youtube video Button
  var youtubeBtn = $("<button>");
  youtubeBtn.attr("name", content.title);
  youtubeBtn.attr("index", content.dateAdded);
  youtubeBtn.attr("data-target", "modal-" + content.dateAdded);
  youtubeBtn.text("Show Sample Videos");
  youtubeBtn.addClass("videoBtn waves-effect waves-light btn modal-trigger");

  //Buttons Container for the above three buttons
  var buttonSection = $("<div>");
  buttonSection.attr("id", "buttonSection-" + content.dateAdded);
  buttonSection.append(instructionBtn);
  buttonSection.append(youtubeBtn);

  $(newRow).append(buttonSection);

  $("#display-collection").prepend(newRow);

  if ($('.carousel.carousel-slider').hasClass('initialized')){
    $('.carousel.carousel-slider').removeClass('initialized')
}

//just reinit the carousel
$('.carousel.carousel-slider').carousel({
  padding: 300,
  shift: 0,
  dist: -75,
  duration: 125
});

});

//Instruction Button opens up a new page in a new window
$(document).on("click", ".instructionBtn", function() {
  var url = $(this).attr("src");
  window.open(url);
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
