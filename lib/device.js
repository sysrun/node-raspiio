
var Device = module.exports = function(options) {
  this.helper = {
    bcd2bin: function(val) {
      return val - 6 * (val >> 4);
    },
    bin2bcd: function(val) {
      return val + 6 * Math.floor(val / 10);
    }
  };
};
