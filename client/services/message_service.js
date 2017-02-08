chatBot.service("messageService", function ($rootScope) {

    //VARIABLES
    this.messages = [];
    this.submissionType = "";
    this.robotName = "Navi";
    this.webSocketConnectionStatus = true;

    //HELPER FUNCTIONS
    
    //handles time stamps;
    this.getCurrentTime = function() {
      return new Date().toLocaleTimeString().
        replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    }

    this.scrollToBottom = function() {
        $('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
    };

    //BUSINESS LOGIC FOR MANAGING WEBSOCKET AND HANDLING MESSAGES 

    //open web socket connection
    var url = window.location.hostname || 'localhost:3000';

    webSocket = new WebSocket("wss://" + url);

    //on init, web socket sends an initial message for server (aka bot) to respond to
    webSocket.onopen = function (event) {
        this.sendMessage(this.messages, 0, "init chat app", "");
    }.bind(this);

    //handles inbound payload from web socket
    this.receiveMessage = function (event) {
        this.submissionType = JSON.parse(event.data)["infoType"] || null;
        var parsedEventPayload = JSON.parse(event.data);
        var newRawRobotMessageContent = this.submissionType ? parsedEventPayload.message : parsedEventPayload;
        var newRobotMessageContent = newRawRobotMessageContent.replace(/['"]+/g, '');

        var newRobotMessage = { 
            user: this.robotName, 
            messageType: "robot-message", 
            content: newRobotMessageContent, 
            id: "N/A", 
            time: this.getCurrentTime(),
            submissionType: this.submissionType
        };

        this.messages.push(newRobotMessage);
        $rootScope.$apply();

        if (this.submissionType === "endConversation" && newRobotMessageContent.search(/I will talk to you soon/i) !== -1) {
            console.log("trying to close websocket connection")
            webSocket.close();
            this.webSocketConnectionStatus = false;
        }

        //ensure that the chat window always displays the lateset messages
        this.scrollToBottom();
    };

    //listens for inbound payload from web socket
    webSocket.onmessage = function (event) {
        //logs every message that passes through web socket
        console.log("socket event: ", event);

        //TODO: create a delay between when user submits message and when robot responds
        this.receiveMessage(event);

    }.bind(this);

    //handles outbound message payload to websocket
    this.sendMessage = function (currentMessages, newMessageId, newUserMessageContent, submissionType) {
        console.log("trying to send message -->", this.submissionType);
 
        //if conversation has already ended
        if(this.submissionType === "endConversation") {
            console.log("conversation has already ended");
            return;
        }

        //on browser open/refresh, set username to "";
        if (newMessageId === 0) { Cookies.set('username', ""); } 

        //else if username is entered for the first time, set username to user input
        else if (newMessageId === 1) { Cookies.set('username', newUserMessageContent); }

        var username = Cookies.get('username');

        //TODO: look into a better way of handling submissionType
        //build outbound message payload
        var newUserMessage = { 
            user: username,
            messageType: "user-message", 
            content: newUserMessageContent, 
            id: newMessageId, 
            time: this.getCurrentTime(),
            submissionType: this.submissionType 
        };

        console.log("message submission -->", newUserMessage)
        webSocket.send(JSON.stringify(newUserMessage));
    
        //if current message has messageId >= 1 then push to list of messages to be displayed in browser
        if(newMessageId >= 1) {
            console.log("trying to scroll to bottom after sending message");
            this.scrollToBottom();
            currentMessages.push(newUserMessage);
        }
    };

    //get latest submission type
    this.getSubmissionType = function(){
        return this.submissionType;
    };

    //retrieve all messages
    this.getAllMessages = function(){
        return this.messages;
    };
});