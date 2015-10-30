import {getRandomIntInclusive} from '../utils';

import LockController from './LockController';

export default class MultiPlayerLockController extends LockController {
    constructor($scope, $element, $timeout) {
        super($scope, $element, $timeout);
    }
}