chatBot.directive('messageList', function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: './directives/message_list/message_list.html',
        
        scope: {
            messages: "=",
        }
    };
});