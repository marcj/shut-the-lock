import MultiPlayerController from './MultiPlayerController'

export default class MultiPlayerHardController extends MultiPlayerController {
    constructor($scope, $timeout, $state) {
        super($scope, $timeout, $state);
        this.hard = true;
    }
}