fixScale(document);
// the selector will match all input controls of type :checkbox
// and attach a click event handler
$("input:checkbox").on('click', function() {
  // in the handler, 'this' refers to the box clicked on
  let $box = $(this);
  if ($box.is(":checked")) {
    // the name of the box is retrieved using the .attr() method
    // as it is assumed and expected to be immutable
    let group = "input:checkbox[name='" + $box.attr("name") + "']";
    // the checked state of the group/box on the other hand will change
    // and the current value is retrieved using .prop() method
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
let cylclr = {};

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
  cylclr[thebtnnum] = "#"+clientdata.ColorVals.CurrentHEX;
  document.getElementById("c" + thebtnnum).style.background = "#"+clientdata.ColorVals.CurrentHEX;
}

function upcolorslist(list) {
  $('#CycleStatecui').html(" ");
  x = -1;
  cylclr = {};
  for (i = 0; i < list.length; i++) {
    cylclr[i] = list[i];
    addcolor();
    document.getElementById("c" + i).style.background = list[i];
  }
}
