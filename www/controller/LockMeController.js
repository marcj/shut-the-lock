export default class LockMeController {
    constructor($scope, $state){
        $scope.go = function(url){
            $state.go(url);
        }
    }
}