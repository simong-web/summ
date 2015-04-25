/// <reference path="Leaderboard.ts" />
/// <reference path="jquery.d.ts" />
//#######################PauseMenu.ts###############################
/// <reference path="phaser.d.ts" />

module summ {

    export class UserDataMessages {

        public static setUserData(data: Object, callback: Function = null, callbackContext: Object = null) {
            try {
                //parent.postMessage(JSON.stringify({ action: 'set_score', score: score }), 'http://www.gitsumm.com');
                parent.postMessage(JSON.stringify({ action: 'set_user_data', data: data }), '*');
            } catch (e) {

            }
           
            if(callback != null && callbackContext != null)
                messageList.push({ action: 'set_user_data', callback: callback, context: callbackContext });

        }

        static getUserData(callback: Function, callbackContext: Object, timeout: number = 0) {
            try {
                //parent.postMessage(JSON.stringify({ action: 'get_player' }), 'http://www.gitsumm.com');
                parent.postMessage(JSON.stringify({ action: 'get_user_data' }), '*');
            } catch (e) {

            }
            messageList.push({ action: 'get_user_data', callback: callback, context: callbackContext });
        }
    }
}