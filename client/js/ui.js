fixScale(document);
$("input:checkbox").on('click', function() {
  let $box = $(this);
  if ($box.is(":checked")) {
    let group = "input:checkbox[name='" + $box.attr("name") + "']";
    $(group).prop("checked", false);
    $box.prop("checked", true);
      fade();
  } else {
    $box.prop("checked", false);
    fade();
  }
});

// color cycle select  UI
let x = 4;
let y = 4;
let cylclr = {};
let cylclrx = {};

function addcolor() {
  x++;
  let htmz = '<div id="radio' + x + 'dv"> <input type="radio" id="radio' + x + '" name="selectui"/> <label id="c' + x + '" for="radio' + x + '"></label></div>'
  $("#CycleStatecui").append(htmz);
}

function removecolor() {
  let thebtn = $('input[name=selectui]:checked').attr('id');
  let thebtnnum = thebtn.replace(/\D/g, '');
  delete cylclr[thebtnnum];
  $("#radio" + thebtnnum + "dv").remove();
}

function setcolor() {
  let thebtn = $('input[name=selectui]:checked').attr('id');
  let thebtnnum = thebtn.replace(/\D/g, '');
  cylclr[thebtnnum] = "#"+ServerData.ColorVals.CurrentHEX;
  document.getElementById("c" + thebtnnum).style.background = "#"+ServerData.ColorVals.CurrentHEX;
}

function UpdateColorCycleListUI(list) {
  $('#CycleStatecui').html(" ");
  x = -1;
  cylclr = {};
  for (i = 0; i < list.length; i++) {
    cylclr[i] = list[i];
    addcolor();
    document.getElementById("c" + i).style.background = list[i];
  }
}

function addupcolors() {
  y++;
  let htmz = '<div onclick = "SetcolorFromList()" id="color' + y + 'dv"> <input type="radio" id="color' + y + '" name="cselectui"/> <label id="cs' + y + '" for="color' + y + '"></label></div>'
  $("#resentcolorui").append(htmz);
}

function upcolors(list) {
  $('#resentcolorui').html(" ");
  y = -1;
  cylclrx = {};
  for (i = 0; i < list.length; i++) {
    cylclrx[i] = list[i];
    addupcolors();
    document.getElementById("cs" + i).style.background = list[i];
  }
}

function SetcolorFromList() {
  let thebtn = $('input[name=cselectui]:checked').attr('id');
  let thebtnnum = thebtn.replace(/\D/g, '');
 console.log(thebtnnum);
emitcolor(ServerData.SavedColors[thebtnnum])

}
