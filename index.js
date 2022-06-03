
const { login } = require("tplink-cloud-api");
const { username, password } = require('./auth.json');
const { start } = require('./app.js');

let tplink;

const motionDetectors = {
  1: {
    location: "stairs",
    enabled: true
  },
  2: {
    location: "laundry room",
    enabled: true
  }
}

login(username, password)
  .then(tp => tplink = tp)
  .then(() => tplink.getDeviceList())
  .then(() => start(tplink,motionDetectors));