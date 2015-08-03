/**
 * Created by arman on 8/3/15.
 */
module.exports = {

  index: function(req, res) {

   // var socket = req.socket;
    var io = sails.io;
    //io.sockets.emit('messageName', {thisIs: 'theMessage'});
    // console.log(socket);
    //res.json({ status: false });
   // var viewData = "home";





// usernames which are currently connected to the chat
    var usernames = {};
    var numUsers = 0;

    io.on('connection', function (socket) {

      console.log("socket connection",socket);
      var addedUser = false;

      // when the client emits 'new message', this listens and executes
      socket.on('new message', function (data) {
        console.log("new message" , data);
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
        });
      });

      // when the client emits 'add user', this listens and executes
      // integrate socket.io
      socket.on('add user', function (username) {
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
          numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: numUsers
        });
      });

      // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });

      // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });

      // when the user disconnects.. perform this
      socket.on('disconnect', function () {
        // remove the username from global usernames list
        if (addedUser) {
          delete usernames[socket.username];
          --numUsers;

          // echo globally that this client has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
          });
        }
      });
    });
        return res.view("message");



  },


  indexPost: function(req, res){


    console.log(req.body , "indexPost");
    //var socket = req.socket;
    var io = sails.io;

    //io.on('connection', function (socket) {
    //  socket.emit('news', { hello: 'world' });
    //  socket.on('my other event', function (data) {
    //    console.log(data);
    //  });
    //});
    //


    //var req = this.req;

    io.sockets.emit('news', {hello: 'world'});
    io.sockets.on('my other event',  function (data) {
      console.log(data);
    });


   // console.log(socket);
    if(req.body.name == 'arman'){
      res.json({ status: true });
    }
    res.json({ status: false });
    return res.view("index", viewData);
  }

};
