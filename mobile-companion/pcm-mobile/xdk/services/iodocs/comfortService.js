(function () {
  var exports = {};
  
  /* Data Feed Function */
  exports.getComfort = function () {
    var url = 'http://10.163.12.210/comfortValue';
    return $.ajax({url: url});
  };
  
  return exports;
})