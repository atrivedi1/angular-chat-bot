chatBot.controller('chatWindow', ['$scope', 'messageService', function($scope, messageService) {
  $scope.conversationStatus = messageService.webSocketConnectionStatus;
  $scope.messages = messageService.messages;
  $scope.messageId = 0;
  $scope.messageContent = "";
  $scope.submissionType = messageService.submissionType;
  $scope.scrollToBottom = messageService.scrollToBottom;

  $scope.updateMessageIdAndSendMessage = function(){
    $scope.messageId++;
    messageService.sendMessage($scope.messages, $scope.messageId, $scope.messageContent, $scope.submissionType);
    $scope.messageContent = "";
  }

  $scope.$watch('conversationStatus', function() {
    $scope.conversationStatus = messageService.webSocketConnectionStatus;
    console.log("conversation status -->", $scope.conversationStatus)
  })

  $scope.$watch('messageService.getSubmissionType()', function() {
    $scope.submissionType = messageService.submissionType;
    console.log("submissionType --->", $scope.submissionType)
  });

  $scope.$watch('messageService.getAllMessages()', function() {
    $scope.messages = messageService.messages;
    console.log("updated messages --->", $scope.messages)
  });
}]);