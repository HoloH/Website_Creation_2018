function empty() {
    var x;
    x = document.getElementById("fieldValue").value;
    if (x == "") {
        alert("Please fill out all the fields to submit");
        return false;
    };
}