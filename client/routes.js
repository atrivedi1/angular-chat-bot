chatBot.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './views/chat_window.html',
      controller: 'chatWindow'
    })
});
