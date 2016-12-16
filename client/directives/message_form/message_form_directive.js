chatBot.directive('messageForm', function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: './directives/message_form/message_form.html',

        scope: {
            conversationStatus: "=",
            currentMessages: "=",
            messageContent: "=",
            messageId: "=",
            submissionType: "=",
            sendMessage: "="
        },
    };
});