// Amazon Location Service resource names:
const mapName = "NextGen_Map";
const placesName = "NextGen_MapServices";
const region = "ap-southeast-2";
const apiKey = "v1.public.eyJqdGkiOiJhOTkxNTIwNi0xMDE0LTRhNzAtYjIwNi04YzkxZTUyNGNiMjMifTjaLrqZpmYL21yKIE40hdXr91zwv7ylNRYMndYr3q6IOuhfhBT-QH6RfAKK0yy9Jf4dGH70fK2xcUUOKAwANCLIXlWT1PdgYpQzMEgBBt_4Ssm3Gwfy9H22WnC1Bie-GDAZ0awa8dxveB30jS3JsnZHgHcDj96zLqkHgieVBL9q7enVuUvnc7Av3m1ZuDdp1lbLZ-PwD26SxxidlegVHXAJDHRED-U2vOapKmxZvQjtKMSz6S1VejcmEpfeZronoOdAY-008ikanpfwgrpNKE15DOkNojE74jswrSwtRgOnJs6u4mNdaz4LKmmCtfGDgglYCtOjATFp960Tx7Ors4Q.ZTA2OTdiZTItNzgyYy00YWI5LWFmODQtZjdkYmJkODNkMmFh"

// Initialize a map
async function initializeMap() {
  const mlglMap = new maplibregl.Map({
    container: "map", // HTML element ID of map element
    center: [-77.03674, 38.891602], // Initial map centerpoint
    zoom: 16, // Initial map zoom
    style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`, // Defines the appearance of the map and authenticates using an API key
  });

  // Add navigation control to the top left of the map
  mlglMap.addControl(new maplibregl.NavigationControl(), "top-left");
  
  return mlglMap;
}

async function main() {
  // Initialize map and Amazon Location SDK client:
  const map = await initializeMap();
}

main();