(async () => {
  const response = await fetch(
    "https://parseapi.back4app.com/classes/Occupations_Job?limit=10&order=title,SOCDetailedGroup",
    {
      headers: {
        "X-Parse-Application-Id": "LxNElAPdOITaMv8BoDyN5nRRm4BkKrLeWZkFocB0", // This is your app's application id
        "X-Parse-REST-API-Key": "gSBVU4x4kju0AagMq2FfEYlO8KpnOBpXdhRHjwFd", // This is your app's REST API key
      },
    }
  );
  const data = await response.json(); // Here you have the data that you need
  console.log(JSON.stringify(data, null, 2));
})();
