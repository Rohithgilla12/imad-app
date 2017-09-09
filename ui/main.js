console.log('Loaded!');
var img = document.getElementById('madi');
var marginLeft = 0;

function moveRight() {
    marginLeft = marginLeft + 1;
    img.style.marginLeft = marginLeft + 'px';
}
img.onclick = function () {
    var interval = setInterval(moveRight, 50);

};
var button = document.getElementById('counter');

button.onclick = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
    };
    request.open('GET', 'http://gillarohith1.imad.hasura-app.io/counter', true);
    request.send(null);


};

var submit = document.getElementById('submit-btn');
submit.onclick = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                //                var names = request.responseText;
                //                names = JSON.parse(names);
                //                var list = '';
                //                for (var i = 0; i < names.length; i++) {
                //                    list += '<li>' + names[i] + '</li>';
                //                }
                //                var ul = document.getElementById('namelist');
                //                ul.innerHTML = list;
                console.log('User logged in sucessfully');
                alert('Logged in');


            }
            if(request.status===403)
                {
                  alert('Check your Crendentials')  
                }
            if(request.status===500)
                {
                    alert('Server down :(')
                }
        }
    };
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    request.open('POST', 'http://gillarohith1.imad.hasura-app.io/login' + name, true);
    request.send(JSON.stringify({
        username: username,
        password: password
    }));


};
