var sys = require('sys'),
    i2c_device = require('../device_i2c');

var DS1340 = module.exports = function(address, busnum, options) {
  i2c_device.call(this, busnum, address);
  this.address = address;
};

sys.inherits(DS1340, i2c_device);

DS1340.prototype.setTime = function(dateValue, cb) {
  var _self = this;

  var data = new Buffer([
    _self.helper.bin2bcd(dateValue.getSeconds()),
    _self.helper.bin2bcd(dateValue.getMinutes()),
    _self.helper.bin2bcd(dateValue.getHours()),
    _self.helper.bin2bcd(dateValue.getDay()),
    _self.helper.bin2bcd(dateValue.getDate()),
    _self.helper.bin2bcd(dateValue.getMonth()),
    _self.helper.bin2bcd(dateValue.getFullYear()-2000)
  ]);

  _self._writeRegister(0x00, data, cb);
  //_self._writeBytes(0x00, data, cb);

};

// Return Javascript Date Object
DS1340.prototype.getTime = function(cb) {
  var _self = this;

  //_self._readBytes(0x00, 7, function(er,data){
  _self._readRegister(0x00, 7, function(er,data){
    if (er) {cb(er);return;}
    var dt = {
      ss: _self.helper.bcd2bin(data[0]),
      mm: _self.helper.bcd2bin(data[1]),
      hh: _self.helper.bcd2bin(data[2]),
      day: _self.helper.bcd2bin(data[3]),
      d: _self.helper.bcd2bin(data[4]),
      m: _self.helper.bcd2bin(data[5]),
      y: _self.helper.bcd2bin(data[6])+2000
    };
    cb(null, new Date(dt.y, dt.m, dt.d, dt.hh, dt.mm, dt.ss));
  });
};

