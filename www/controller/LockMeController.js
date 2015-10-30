export default class LockMeController {
    constructor($scope, $state, $timeout, $ionicHistory){
        $scope.go = function(url){
            console.log('go back');
            $state.go(url);
        };
        $scope.goBack = function(){
            console.log('go back');
            $ionicHistory.goBack();
        };
        $scope.showLeaderboard = this.showLeaderboard;
        $scope.hasAdMob = !!window.AdMob;

        $timeout(() => {
            if (window.gamecenter) {
                $scope.loginGameCenter = () => {
                    window.gamecenter.auth(function (user) {
                        $scope.gamercenterLoggedIn = true;
                        console.log('gamecenter success', user)
                    }, function (e) {
                        console.error('gamecenter error', e)
                    });
                };
                $scope.loginGameCenter();
            }
        }, 500);
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