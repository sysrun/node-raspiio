var _ = require('underscore'),
    deviceMapping = require('./devices.json');

exports.getDevice = function(devicename, addr, bus, options) {
  if (deviceMapping[devicename]){
    var Module = require('./devices/' + deviceMapping[devicename].module);

    console.log(deviceMapping[devicename]);
    console.log(Module);

    var initOptions = _.defaults(options || {}, deviceMapping[devicename].options || {});

    return new Module(addr, bus, initOptions);
  } else {
    throw new Error('Device "'+devicename+'" not found');
  }
};
