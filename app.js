// создать подключение
var socket = null;
var nickname;
var id;

// отправить сообщение из формы publish
document.forms.publish.onsubmit = function() {
  var outgoingMessage = this.message.value;
  socket.send(outgoingMessage);
    return false;
};

// const connect = document.getElementById('connect');
// const disconnect = document.getElementById('disconnect');

const connect = $('#connect');
const disconnect = $('#disconnect');

$('#submitUpdate').on("click", function(){
    let message = $('#updateData').val();
    $("#subscribe").html("");
    socket.send(`UPDATE ${id} ${message}`);
    $('#edit').css("display", "none");
});

connect.on('click', function(){
    start();
});
function start() {

    socket = new WebSocket("ws://localhost:8081");
    socket.onmessage = function(event) {
        if(event.data == "CLEAR"){
            $('#subscribe').html("");
            return;
        }
        var incomingMessage = event.data;
        var id = incomingMessage.split(" ")[incomingMessage.split(" ").length - 1];
        var message = incomingMessage.split(` ${id}`)[0];
        showMessage(message, id);
    };
    socket.onopen = authorizate;

}
function authorizate(){
    $("#subscribe").html("");
    nickname = $('#nickname').val();
    $('#nickname').css("display", "none");
    $('#subm').css("display", "inline-block");
    $("#message").css("display", "inline-block");
    disconnect.css("display", "inline-block");
    connect.css("display", "none");
    console.log(nickname);
    socket.send(nickname);
}

$(window).bind("unload" ,function() {
    socket.send("CLOSE");
});

disconnect.on('click', function(){
    $("#subscribe").html("");
    socket.send("CLOSE");
    socket = null;
    //socket.close(1000, "User disconnected");
    connect.css("display", "inline-block");
    disconnect.css("display", 'none');
    $('#nickname').css("display", "inline-block");
    $('#subm').css("display", "none");
    $('#message').css("display", 'none');
});

$('#confirmDelete').on("click", function () {
    socket.send(`DELETE ${id}`);
    $('#delete').css("display", "none");
    $('#subscribe').html("");
});

$('#denyDelete').on("click", function () {
    $('#delete').css("display", "none");
});

// показать сообщение в div#subscribe
function showMessage(message, inId) {
    $('#subscribe').append(`<div class="messageBox" id="${inId}"><button class="delBtn">Удалить</button><button class="editBtn">Изменить</button>${message}</div>`);
    $('.editBtn').on('click', function (event) {
        id = $(event.target).parent().attr('id');
        $('#edit').css("display", "block");
    });

    $('.delBtn').on("click", function(event){
        id = $(event.target).parent().attr('id');
        $('#delete').css("display", "block");
    });
}
