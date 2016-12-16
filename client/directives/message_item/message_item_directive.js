chatBot.directive('messageItem', function() {
    return {
        restrict: "E",
        templateUrl: './directives/message_item/message_item.html',
        scope: {
            user: "@",
            content: "@",
        }
    }
});