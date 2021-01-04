//_______________________________ADD VENDOR TO FIREBASE_______________________________________________________________________________________________________________
//VARIABLES USED TO STORE VENDOR INFO: This will be used to save text entered on the venue page html by the venue owner.
var storageRef;
// var vendorDatabase;
var venueName;
var vendorImage;
var vendorAddress;
var vendorZip;
var vendorCapacity;
var vendorDetail;
var vendorEmail;
var imageUrl;
var firebaseSnapshot;
var vendorLongitude;
var vendorLatitude;

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAtDIitolx33OIPaqziRfVfvWYWS0MY5Ik",
  authDomain: "group-project-1-2127f.firebaseapp.com",
  databaseURL: "https://group-project-1-2127f.firebaseio.com",
  projectId: "group-project-1-2127f",
  storageBucket: "group-project-1-2127f.appspot.com",
  messagingSenderId: "525088904938",
  appId: "1:525088904938:web:e8b273fa09c7479b58a993",
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

const newVendor = {};

$("#click-button").on("click", function (event) {
  event.preventDefault(event);

  // Grabs user input
  newVendor.name = $("#venue-name-input").val();
  newVendor.location = $("#address-input").val();
  newVendor.details = $("#zip-input").val();
  newVendor.number = $("#capacity-input").val();
  newVendor.description = $("#description-input").val();
  newVendor.email = $("#vendor-email-input").val();
  // newVendor.image =$("#image-input").val();

  database.ref().push(newVendor);

  //  Logs everything to console
  //  console.log(newVendor.venueName);
  //  console.log(newVendor.vendorAddress);
  //  console.log(newVendor.vendorZip);
  //  console.log(newVendor.vendorCapacity);
  //  console.log(newVendor.vendorDetail);
  //  console.log(newVendor.vendorEmail);

  // Clears all of the text-boxes
  $("#venue-name-input").val("");
  $("#address-input").val("");
  $("#zip-input").val("");
  $("#capacity-input").val("");
  $("#description-input").val("");
  $("#vendor-email-input").val("");
});

//______________________________LEAFLET VARIABLES______________________________________________________________________________________________
//MAP OBJECT: Used to render the initial map of NYC.
// var iniitalLong = 40.77;
// var iniitalLat = -73.99;
var map = L.map("mapid").setView([40.77, -73.99], 12);

//ACCESS TOKEN: This is what will be used by the Ajax call to retrive the lat/long for the user entered zip code.
var accessToken =
  "sk.eyJ1IjoibXNoaXdyYXRhbjg4IiwiYSI6ImNqb2Ywc2g2NzAydHcza2xqNzMyMXE1N3gifQ.245Qhtto4LSUwvYByTpZmg";

//LEAFLET METHOD FOR MAP DISPLAY: This uses the map object mentioned above in the method addTo(map).
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "sk.eyJ1IjoibXNoaXdyYXRhbjg4IiwiYSI6ImNqb2Ywc2g2NzAydHcza2xqNzMyMXE1N3gifQ.245Qhtto4LSUwvYByTpZmg",
  }
).addTo(map);

//_____________________________VENDOR DISPLAY BY ZIP CODE______________________________________________________________________________________
function renderMap() {
  //LAT/LONG VARIABLES: Values will be assigned later in the code.
  var mapLongitude = "";
  var mapLatitude = "";

  //ON CLICK EVENT: Once submit button is clicked the zip code information entered will be saved and data will be called/ displayed from Firebase.
  //This is the code that must be called for mapped location to be displayed to the page. User entered zip code is captured here.
  $("#zipCodeSubmit").on("click", function (event) {
    event.preventDefault();

    var countZipCodeMatch = 0;

    //User entered zipcode is saved in the following variable and console.logged
    var firebaseZipCode = $("#zipCodeInput").val().trim();
    console.log("Zip Code Entered: " + firebaseZipCode);

    //Clear current content on the page from prior zip code search
    $("#container").html("");

    //FUNCTION TO ACCESS FIREBASE: This function will use the snapshot method to first obtains all object keys, then check Firebase for a zip code that matches then
    //set the mapLongitude and mapLatitude values.
    var query = firebase.database().ref().orderByKey();
    query.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        //1.This will create a snapshot for each child within Firebase.
        var key = childSnapshot.key; //2.This will save the key within the snapshot
        // console.log(key);                                          //3.This will console.log the key of every record in Firebase.

        //VENDOR VARIABLES
        var vendorDataBase = snapshot.val();
        var vendorChild = snapshot.child(key);
        var venueName = vendorChild.val().name;
        var vendorAddress = vendorChild.val().location;
        var vendorZip = vendorChild.val().details;
        var vendorCapacity = vendorChild.val().number;
        var vendorDetail = vendorChild.val().description;
        var vendorEmail = vendorChild.val().email;
        var vendorImage = vendorChild.val().imageUrl;
        var vendorLongitude = vendorChild.val().longitude;
        var vendorLatitude = vendorChild.val().latitude;

        //RETURNED VENDOR INFORMATION IF ZIP CODE MATCHES
        if (vendorZip === firebaseZipCode) {
          // console.log(vendorDataBase);
          // console.log(vendorChild);
          // console.log("Venue Name: " + venueName);
          // console.log("Street Address: " + vendorAddress);
          // console.log("Zip Code: " + vendorZip);
          // console.log("Max Capacity: " + vendorCapacity);
          // console.log("Description: " + vendorDetail);
          // console.log("Contact Email: " + vendorEmail);
          // console.log("img: " + vendorImage);
          // console.log("Long: " + vendorLongitude);
          // console.log("Lat: " + vendorLatitude);

          //MAP DISPLAY VARIABLES
          var mapZoom = 15;
          mapLongitude = vendorChild.val().longitude;
          mapLatitude = vendorChild.val().latitude;

          //If there is a zipcode match and there is a lat/long for the a matching vendor
          if (
            vendorLongitude !== undefined &&
            vendorLatitude !== undefined &&
            vendorLongitude !== 0 &&
            vendorLatitude !== 0
          ) {
            L.marker([vendorLatitude, vendorLongitude])
              .addTo(map)
              .bindPopup(venueName); //1.Map marker will be displayed on the page with popup
            console.log(vendorLongitude); //2.Colsole log the Long for for the vendor found
            console.log(vendorLatitude); //3.Colsole log the Lat for for the vendor found

            var mapZoom = 15; //4.Specify the map zoom and store in variable
            map.setView([mapLatitude, mapLongitude], mapZoom); //5.Use Leaflet map method to create mymap variable (where lat, long and zoom is used)
            L.circle([mapLatitude, mapLongitude], { radius: 500 }).addTo(map); //6.Use Leaflet circle method to highlight radius around the venue location

            //Console display if there is a zip code match
            countZipCodeMatch++;
            // $("#venue-count").text(countZipCodeMatch);
            console.log(
              "SEARCH RESULTS: " +
                countZipCodeMatch +
                " found around zip code " +
                firebaseZipCode +
                "."
            );

            //Display venue details on the page below map.
            var data = $("<ul>").html(
              `<img src="${vendorImage}" />
              <li>Venue Name:  ${venueName}</li>
              <li>Address: ${vendorAddress}</li>
              <li>Zip:  ${vendorZip}</li>
              <li>Max Capacity:  ${vendorCapacity}</li>
              <li>Venue Description:  ${vendorDetail}</li>
              <li>Email:  ${vendorEmail}</li>`
            );
            $("#container").append(data);
          }
        }

        //Console display of there are no matches to the entered zip code
        if (vendorZip !== firebaseZipCode) {
          console.log("No zip code match found");
          // $("#container").append("No venue match found within the zip code " + firebaseZipCode + ". Please try another zip code.");
        }
      });
    });
  });
}

//CALL RENDER MAP FUNCTION
renderMap();

var data = $("<ul>").html(
  `
  <img src="${vendorImage}" />
  <li><strong>Venue Name:</strong>  ${venueName}</li><br>
  <li><strong>Address:</strong>  ${vendorAddress}</li><br>
  <li><strong>Zip Code:</strong>  ${vendorZip}</li><br>
  <li><strong>Maximum Capacity:</strong>  ${vendorCapacity}</li><br>
  <li><strong>Venue Description:</strong> ${vendorDetail}</li><br>
  <li><strong>Email:</strong>  ${vendorEmail}</li>`
);
$("#container").append(data);
