var uploadTask;

// {/* <script src="https://www.gstatic.com/firebasejs/5.5.8/firebase.js"></script> */}

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAtDIitolx33OIPaqziRfVfvWYWS0MY5Ik",
    authDomain: "group-project-1-2127f.firebaseapp.com",
    databaseURL: "https://group-project-1-2127f.firebaseio.com",
    projectId: "group-project-1-2127f",
    storageBucket: "group-project-1-2127f.appspot.com",
    messagingSenderId: "525088904938"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

//Lat Long access token and variables - used to obtain geo location for vendor address
var accessToken = 'sk.eyJ1IjoibXNoaXdyYXRhbjg4IiwiYSI6ImNqb2Ywc2g2NzAydHcza2xqNzMyMXE1N3gifQ.245Qhtto4LSUwvYByTpZmg';
var vendorDetail = 0;
var vendorAddress = 0;
var vendorLat = 0;
var vendorLong = 0;

// make this a global variable for purposes of obtaining URL image data from firebase (code below)
const newVendor = {};

// 2. Button for adding input
$("#click-button").on("click", function (event) {
    event.preventDefault(event);

    // Grabs user input
    newVendor.name = $("#venue-name-input").val();
    newVendor.location = $("#address-input").val();
    newVendor.details = $("#zip-input").val();
    newVendor.number = $("#capacity-input").val();
    newVendor.description = $("#description-input").val();
    newVendor.email = $("#vendor-email-input").val();
    // newVendor.imageUrl =$("#file-button").val();

    //Lat long for location is obtained here
    var vendorZipCode = $("#zip-input").val().trim();
    vendorDetail = vendorZipCode;

    var vendorStreetAddress = $("#address-input").val().trim();
    vendorAddress = vendorStreetAddress;

    var queryURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
        + vendorAddress
        + "%20New%20York"
        + "%20NY"
        + "%20"
        + vendorDetail
        + ".json?access_token="
        + accessToken
        + "&cachebuster=1543079244603&autocomplete=true&types=address";


    $.ajax({
        async: false,                                                       //1.Turn on async to all lat/long to be sent to global var
        url: queryURL,                                                      //2.Specify query URL from above.
        method: "GET"                                                       //3.Declare 'GET' method to obtain data from the request.


    }).then(function (response) {                                           //Create function to do the following:
        var longitude = response.features[0].center[0];                     //1.Get the longitude value
        newVendor.longitude = longitude;                                    //2.Save value in logitude property
        console.log("New Vendor Long: " + longitude);

        var latitude = response.features[0].center[1];                      //3.Get the latitude value 
        newVendor.latitude = latitude;                                      //4.Save value in the latitude property
        console.log("New Vendor Lat: " + latitude);

        database.ref().push(newVendor);                                     //5.Add all properties and assigned values to firebase

    });


    //  removed the .trim() at the end of all these as I kept getting a console error
    //  Logs everything to console
    //  console.log(newVendor.venueName);
    //  console.log(newVendor.vendorAddress);
    //  console.log(newVendor.vendorZip);
    //  console.log(newVendor.vendorCapacity);
    //  console.log(newVendor.vendorDetail);
    //  console.log(newVendor.vendorEmail);


    //  alert("vendor successfully added");


    // Clears all of the text-boxes
    $("#venue-name-input").val("");
    $("#address-input").val("");
    $("#zip-input").val("");
    $("#capacity-input").val("");
    $("#description-input").val("");
    $("#vendor-email-input").val("");
    //  $("#file-button").val("");
});

// // 3. Create Firebase event for adding vendor to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());

    var venueName = snapshot.val().name;
    var vendorAddress = snapshot.val().location;
    var vendorZip = snapshot.val().details;
    var vendorCapacity = snapshot.val().number;
    var vendorDetail = snapshot.val().description;
    var vendorEmail = snapshot.val().email;
    var imageUrl = snapshot.val();
    // console.log(imageUrl);
});



//   get Elements------THIS IS THE WORKING CODE FOR THE PHOTO UPLOAD----------------
var uploader = document.getElementById("uploader");
var fileButton = document.getElementById("fileButton");

// Listen for file selection
fileButton.addEventListener("change", function (e) {
    // get file
    var file = e.target.files[0];

    // create a storage ref
    var storageRef = firebase.storage().ref("venue_images/" + file.name);

    // upload file- the put method will upload the file to firebase storage. adding the task variable helps you can an eye on the progress
    // var task = storageRef.put(file);
    var uploadTask = storageRef.put(file);
    var data = $("<img>").append(file);
    // //   // Append the image to the body
    $("body").append(data);

    uploadTask.on("state_changed", function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploader.value = progress;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or ‘paused’
                console.log("Upload is paused");
                break;
            case firebase.storage.TaskState.RUNNING: // or ‘running’
                console.log("Upload is running");
                break;
        }
    }, function (error) {
        // Handle unsuccessful uploads
    }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log("File available at", downloadURL);
            newVendor.imageUrl = downloadURL;
            // console.log(newVendor.imageUrl);


        });
    });
});









