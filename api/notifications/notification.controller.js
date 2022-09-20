let app = require("express")();
let http = require("http").Server(app);
const queryHandler = require('./notif.controller');
const io = require('socket.io')(http, {
    cors: {
        origins: "*:*",
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true

});

io.on("connection", socket => {
    // Log whenever a user connects
    console.log("user connected");

    // Log whenever a client disconnects from our websocket server
    socket.on("disconnect", function() {
        console.log("user disconnected");
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on("message", async(message) => {
        console.log("Message Received: " + message);
        io.emit("message", message);
        try {
            const msg = new messageModel(message);
            const msgSave = await msg.save();
            if (msgSave) {
                const [messageResult] = await Promise.all([
                    queryHandler.insertMessages(message)
                ])
                io.to(socket.id).emit(`add-message-response`, message);
            } else {
                io.to(socket.id).emit(`add-message-response`, { message: "Something went Wrong" });
            }

        } catch (e) {
            console.log(e)
        }
    });
    socket.on('send-payment-status', async(data) => {
        console.log(data);
        try {
            io.emit(data.data.userId, data);
            console.log(data.data.userId)
        } catch (e) {
            console.log(e.message)
        }
    });

    socket.on(`chat-list`, async(data) => {
        console.log(data)
        try {
            // const [chatlistResponse] = await Promise.all([
            //     // queryHandler.getUserInfo( {
            //     // 	userId: data.fromUserId,
            //     // 	socketId: false
            //     // }),
            //     queryHandler.getChatList(data.fromUserId)
            // ]);
            // console.log(socket.id, chatlistResponse, "socket id")
            io.to(socket.id).emit(`chat-list-response`, {
                error: false,
                singleUser: false,
                chatList: "hello from server"
            });
            // socket.broadcast.emit(`chat-list-response`,{
            // 	error : false,
            // 	singleUser : true,
            // 	chatList : UserInfoResponse
            // });
        } catch (error) {
            io.to(socket.id).emit(`chat-list-response`, {
                errors: true,
                chatList: []
            });
        }
    });
});

// Initialize our websocket server on port 5000
http.listen(4567, () => {
    console.log("started on port 4567");
});