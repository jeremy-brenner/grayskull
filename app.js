var express = require("express");


function start(tplink,motionDetectors) {
  let laundryLastMotion = 0;
  const laundryKillTimeMinutes = 5;
  const app = express();

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
  
  app.get("/dash", (req, res, next) => {
    console.log("dash!", req.query.button);
    if(req.query.button == 'dash01') {
      tplink.getHS200("Basement Main").toggle()
        .then( () => res.status(200).end() )
    }
  
    if(req.query.button == 'dash02') {
      tplink.getHS100("Living Room Lamp").toggle()
        .then( () => res.status(200).end() )
    }
  })
  
  app.get("/water-level", (req, res, next) => {
    console.log("/water-level", req.query.water);
    res.status(200).end();
  });
  
  app.get("/laundry-room-motion", (req, res, next) => {
    const detector = motionDetectors[req.query.detector];
    console.log("/laundry-room-motion", detector.location);
    
    if(!detector.enabled) { 
      return;
    }
  
    laundryLastMotion = Date.now();
  
    turnOnLaundryRoomLight()
      .then( () => res.status(200).end() )
  });
  
  setInterval(checkLaundry, 1000);

  function turnOnLaundryRoomLight() {
    return tplink.getHS100("Laundry Room").powerOn();
  }
  
  function checkLaundry() {
    const timeSinceMotion = Date.now() - laundryLastMotion;
    if(laundryLastMotion > 0 && timeSinceMotion > laundryKillTimeMinutes * 60 * 1000) {
      tplink.getHS100("Laundry Room").powerOff();
      laundryLastMotion = 0;
    }
  }  
  
}


exports.start = start;