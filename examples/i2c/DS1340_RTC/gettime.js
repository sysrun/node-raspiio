var lib = require('../../../');


var device = lib.getDevice('DS1340', 0x68, 1);


// Deviceadress 0x68
// Raspberry i2c-bus no. 1

device.getTime(function(error, timeObject){
  console.error(error);
  console.log(timeObject);
});
