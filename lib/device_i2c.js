var sys = require('sys'),
    _ = require('underscore'),
    async = require('async'),
    i2c = require('i2c'),
    device = require('./device');

var i2cDevice = module.exports = function(bus, address, options) {
  if (bus instanceof i2c) {
    this.bus = bus;
  } else {
    this.bus = new i2c('/dev/i2c-'+bus);
  }
  this.address = address;
  device.call(this);
};

sys.inherits(i2cDevice, device);

i2cDevice.prototype._readRegister = function(reg, len, cb) {
  var _self = this;
  var val = _self.bus.readblockdata(_self.address, reg, len);
  console.log(new Buffer(val));
  cb(null, val);
};

i2cDevice.prototype._write8 = function(reg, value, cb) {
  var _self = this;
  _self.bus.WriteByteData(_self.address, reg, value, cb);
};

/*
 * Writes n <bytes> starting at <reg> (increment +0x01 per byte)
 */
i2cDevice.prototype._writeBytes = function(reg, bytes, cb) {
  var _self = this;
  async.eachSeries(bytes,function(bt, callback){
    _self.bus.WriteByteData(_self.address, reg, bt, callback);
    reg += 0x01;
  },cb);
};

/**
 * Read unsigned byte from <reg>
 **/
i2cDevice.prototype._readU8 = function(reg, cb) {
  var _self = this;
  _self.bus.ReadByteData(_self.address, reg, cb);
};

i2cDevice.prototype._readBytes = function(reg, len, cb) {
  var _self = this;
  var result = [];
  _self.bus.ReadByteData(_self.address, reg, function(er, data){
    if (er){cb(er); return;}
    result.push(data);
    _self.bus.read(_self.address, (len-1), function(er, data){
      if (er) {cb(er); return;}
      cb(null, result.concat(data));
    });
  });
};

i2cDevice.prototype._read = function(len, cb) {
  var _self = this;
  _self.bus.read(_self.address, len, cb);
};
