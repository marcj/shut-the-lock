export default class LockMeController {
    constructor($scope, $state, $ionicHistory){
        $scope.go = function(url){
            console.log('go back');
            $state.go(url);
        };
        $scope.goBack = function(){
            console.log('go back');
            $ionicHistory.goBack();
        };
        $scope.showLeaderboard = this.showLeaderboard;
    }

    showLeaderboard() {
        var data = {
            leaderboardId: "singleplayer"
        };
        window.gamecenter.showLeaderboard(function () {
        }, function () {
        }, data);
    }
}