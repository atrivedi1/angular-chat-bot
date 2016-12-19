chatBot.service("messageService", function ($rootScope) {
    //variables
    this.messages = [];
    this.submissionType = "";
    this.robotName = "Navi";
    this.webSocketConnectionStatus = true;

    //open web socket connection
    webSocket = new WebSocket("ws://localhost:3000");

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
        var newRobotMessage = { user: this.robotName, content: newRobotMessageContent, id: "N/A", submissionType: this.submissionType }
        this.messages.push(newRobotMessage);
        $rootScope.$apply();

        if (this.submissionType === "endConversation" && newRobotMessageContent.search(/I will talk to you soon/i) !== -1) {
            console.log("trying to close websocket connection")
            webSocket.close();
            this.webSocketConnectionStatus = false;
        }

        console.log("udpated messages with inbound message -->", this.messages)
    };

    //listens for inbound payload from web socket
    webSocket.onmessage = function (event) {
        //logs every message that passes through web socket
        console.log("socket event: ", event);
        this.receiveMessage(event);
    }.bind(this);

    //handles outbound message payload
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
        var newUserMessage = { user: username, content: newUserMessageContent, id: newMessageId, submissionType: this.submissionType };
        console.log("message submission -->", newUserMessage)
        webSocket.send(JSON.stringify(newUserMessage));
    
        //if current message has messageId >= 1 then push to list of messages to be displayed in browser
        if(newMessageId >= 1) {
            currentMessages.push(newUserMessage);
        }
    };

    //get latest submission type
    this.getSubmissionType = function(){
        return this.submissionType;
    }
    //retrieve all messages
    this.getAllMessages = function(){
        return this.messages;
    }
});