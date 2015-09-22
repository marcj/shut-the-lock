export default class SplashController {
    constructor($state, $timeout){
        $timeout(function() {
            $state.go('start');
        }, 1000);
    }

}