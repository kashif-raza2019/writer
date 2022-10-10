let stopButtonPressed = new Boolean(false);

var mat = [];

function fillMat() {
  mat = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
}

async function traversal(mat) {
  for (var i = 0; i < mat.length; i++) {
    for (var j = 0; j < mat[i].length; j++) {
      if (stopButtonPressed == true) {
        return;
      }
      await sleep(200);
      $("#" + mat[i][j]).animate(
        { backgroundColor: "purple", color: "white" },
        "slow"
      );
      await sleep(50);
      $("#" + mat[i][j]).animate({ backgroundColor: "#87CEF0" });
    }
  }
}

async function borderTraversal(mat) {
  var i = 0;
  var j = 0;
  while (j < mat[i].length) {
    console.log(mat[i][j]);
    if (stopButtonPressed == true) {
      return;
    }
    await sleep(300);
    $("#" + mat[i][j]).animate(
      { backgroundColor: "#8F9CE8", color: "white" },
      "slow"
    );
    await sleep(100);
    $("#" + mat[i][j]).animate({ backgroundColor: "#B9DCAE" }, "slow");
    j++;
  }
  j--;
  i++;
  while (i < mat.length) {
    console.log(mat[i][j]);
    if (stopButtonPressed == true) {
      return;
    }
    await sleep(300);
    $("#" + mat[i][j]).animate(
      { backgroundColor: "#8F9CE8", color: "white" },
      "slow"
    );
    await sleep(100);
    $("#" + mat[i][j]).animate({ backgroundColor: "#B9DCAE" }, "slow");
    i++;
  }
  i--;
  while (j >= 0) {
    console.log(mat[i][j]);
    if (stopButtonPressed == true) {
      return;
    }
    await sleep(300);
    $("#" + mat[i][j]).animate(
      { backgroundColor: "#8F9CE8", color: "white" },
      "slow"
    );
    await sleep(100);
    $("#" + mat[i][j]).animate({ backgroundColor: "#B9DCAE" }, "slow");
    j--;
  }

  j++;
  while (i > 0) {
    console.log(mat[i][j]);
    if (stopButtonPressed == true) {
      return;
    }
    await sleep(300);
    $("#" + mat[i][j]).animate(
      { backgroundColor: "#8F9CE8", color: "white" },
      "slow"
    );
    await sleep(100);
    $("#" + mat[i][j]).animate({ backgroundColor: "#B9DCAE" }, "slow");
    i--;
  }
}

// Controller Values & Functions
let tableRow = 1;
let tableCol = 1;

function addMatrix(queryId) {
  stopButtonPressed = false;
  var tableBody = $("#canvas tbody");
  mat = [];
  tableBody.empty();
  var val = document.querySelector(queryId).value;
  var matrixSize = val.split("x");
  // console.log(matrixSize[0] + matrixSize[1]);
  var rows = matrixSize[0];
  var cols = matrixSize[1];
  var ids = 1;
  var rowId = 1;
  for (var i = 0; i < rows; i++) {
    mat[i] = new Array();
    var markUpRow = "<tr id='row-'" + rowId + ">";
    for (var j = 0; j < cols; j++) {
      mat[i][j] = ids;
      markUpRow += "<td id='" + ids + "'>" + ids + "</td>";
      ids++;
    }
    markUpRow += "</tr>";
    tableBody.append(markUpRow);
    rowId++;
  }
  console.log(mat);
  // traversal(mat);
  let selection = $("#selectAlgo").val();
  if (selection == "Matrix Traversal") {
    console.log("traversal");
    traversal(mat);
  } else if (selection == "Border Traversal") {
    borderTraversal(mat);
  }else if(selection == "Spiral Traversal"){
    spiralTraversal(mat);
  }
}

let stopResumeFlag = true;
$("#stopBtn").click(function () {
  console.log("Set to True, animation should paused!");
  if (stopResumeFlag == true) {
    stopButtonPressed = true;
    stopResumeFlag = false;
  } else {
    stopButtonPressed = false;
    stopResumeFlag = true;
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



