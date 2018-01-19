fixScale(document);

var val = document.getElementById('rgbValue');
var socket = io.connect();
var hexi;
var hardset;
var fade;
var fadeoc;
var colorselect;
var joe = colorjoe.rgb('rgbPicker', nowcolor)


socket.on('csync', function(hexs) {
  var oldhex = hexs.hex;
//  console.log('connact! ' + newhex)
  joe.setnu(oldhex);
});

socket.on('hex', function(hexs) {
  var newhex = hexs.hex;
//  console.log('connact! ' + newhex)
  joe.set(newhex);
});

socket.on('fsync', function(mode) {
var cmode =  mode.thests;
var cctf = mode.cctf;
console.log(cmode);
$('#colorsetseti').prop('checked', cmode);
  document.getElementById("c1").value = cctf[0];
  document.getElementById("c2").value = cctf[1];
  document.getElementById("c3").value = cctf[2];
  document.getElementById("c4").value = cctf[3];


 });


joe.on('change', function(c) {
  hexi = c.hex();
  val.innerHTML = c.css();
  var cred = Math.round(255 * c.red());
  var cgreen = Math.round(255 * c.green());
  var cblue = Math.round(255 * c.blue());

//  console.log('R:' + cred + ' G:' + cgreen + ' B:' + cblue);



  //socket io
  socket.emit('color', {
    red: cred,
    green: cgreen,
    blue: cblue
  });



})

joe.on('done', function(c) {
//  console.log('I am Done.');
  var chex = c.hex();
  socket.emit('hex', {
    hex: chex
  });

  socket.on('hex', function(hexs) {
    var newhex = hexs.hex;
//    console.log('new! ' + newhex)
    joe.set(newhex);
  });


});

hardset = function(r, g, b) {
   $('#colorsetseti').prop('checked', false).change();
    console.log('rgb(' + r + ',' + g + ',' + b + ')');
    joe.set('rgb(' + r + ',' + g + ',' + b + ')');
    socket.emit('hex', {
      hex: hexi
    });
  };




fade = function(){
var status = document.getElementById("colorsetseti").checked
var ctf = [];
ctf.push(document.getElementById("c1").value);
ctf.push(document.getElementById("c2").value);
ctf.push(document.getElementById("c3").value);
ctf.push(document.getElementById("c4").value);
console.log(ctf);
socket.emit('fade', {
  hexf: ctf,
  state: status
});
};

fadeoc = function(color){
  socket.emit('fadeoc', {
    colortf: color
  });
};



function convertHex(hex){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = r+','+g+','+b;
    return result;
};

colorselect = function(mana) {
  console.log(mana);
  document.getElementById(mana).value = hexi;
};







console.log('hi');
