//api key

var apiKey = "ad9411943fc77cb3dcb9f5c1f72654de";
var apiId = "b3505691";

//Declare variables

var searchTerm = "";
var numIngredients = 0;
var numResults = 0;
var numTime = 0;
var chosenSearch = [];
var chosenSearchLess60 = [];

//URL base
var queryURLBase =
  "http://api.edamam.com/search?from=0&to=20&app_id="+ apiId + "&app_key=" + apiKey;

//track number of recipe
recipeCounter = 0;

function runQuery(numSearch, queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    $("#displayResults").empty();

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
            element.recipe.totalTime < numTime && element.recipe.totalTime > 30 && 
            element.recipe.totalTime != 0
          ) {
            chosenSearch.push(element.recipe);
          }
        });
      }

      if (parseInt(numTime) === 120) {

        response.hits.forEach(function(element) {
          if (
            element.recipe.totalTime < numTime && element.recipe.totalTime > 60 && 
            element.recipe.totalTime != 0
          ) {
            chosenSearch.push(element.recipe);
          }
        });
      }

    console.log(chosenSearch);

    console.log(chosenSearch.slice(0, numSearch));

    chosenSearch.slice(0, numSearch).forEach(function(element, i){

        console.log(element);

        console.log(element.label);

        console.log(Math.round(element.calories/element.yield));

        var calories = Math.round(element.calories/element.yield);

        console.log(element.ingredientLines);

        console.log(element.dietLabels);

        console.log(element.healthLabels);

        console.log(element.url);

        var displaySection = $('<div>');
        displaySection.attr("id", "recipe-" + i); 
        displaySection.addClass("card p-3 m-2 verticalList");
        
        
        
        $("#displayResults").append(displaySection);


        //Attach the content to the appropriate div 
        $("#recipe-"+i).append("<h3>"+ element.label.toUpperCase() + "</h3>");
        $("#recipe-"+i).append("<h5>"+ element.healthLabels.join(' ') + " [ <i>" +element.dietLabels.join(" ") + " </i>]"+"</h5>");
        $("#recipe-"+i).append("<p>"+ element.ingredientLines.join('\n') + "</p>");
        $("#recipe-"+i).append("<img class= 'rounded float-left w-25 h-50' src='" + element.image + "'></img>");
        $("#recipe-"+i).append("<h5> Total Calories/person: "+ calories+ "</h5>");
        $("#recipe-"+i).append("<a href = '"+ element.url + "' >" + element.url + "</a>");
    });




  });
}

$("#searchBtn").on("click", function() {


  chosenSearch = [];

  searchTerm = $("#searchTerm")
    .val()
    .trim();

  console.log(searchTerm);

  numResults = $("#numResults").val();

  console.log(numResults);

  numTime = $("#numTime").val();

  console.log(parseInt(numTime));

  var newURL = queryURLBase + "&q=" + searchTerm;

  console.log(newURL);

  runQuery(parseInt(numResults), newURL);

  return false;
});

