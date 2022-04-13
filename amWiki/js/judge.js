function judge() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "DarrenJun" && password == "qwer1234") {
     window.location.href = "success.html"
    } else {
        alert("用户名或密码错误");
        event.preventDefault();
    }

}
