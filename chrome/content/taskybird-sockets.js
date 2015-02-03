"use strict";

/* BEGIN LICENSE BLOCK

for detail, please refer to license.txt in the root folder of this extension

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 3
of the License, or (at your option) any later version.

If you use large portions of the code please attribute to the authors
(Axel Grude)

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You can download a copy of the GNU General Public License at
http://www.gnu.org/licenses/gpl-3.0.txt or get a free printed
copy by writing to:
  Free Software Foundation, Inc.,
  51 Franklin Street, Fifth Floor,
  Boston, MA 02110-1301, USA.
  
END LICENSE BLOCK 
*/

// var TaskybirdSocket = io.connect(taskyBird.Preferences.getCharPref("server.url"));
// TaskybirdSocket.on('email',function(obj){
// 	alert('socket arrived');
// 	console.log('zbehlo3');
//     console.log(obj);
//     taskyBird.Sync.init();
// });

// TaskybirdSocket.on('error',function(err){
// 	alert("Error server probably down trying to reconnect and relog in 30 seconds: "+err.message);
// 	timeout();

// 	function timeout() {
// 	    setTimeout(function() {
// 	    	alert('trying to auth');
// 	    	if(!taskyBird.Api.authenticate(window, taskyBird.Preferences.getCharPref("account.user"), taskyBird.Preferences.getCharPref("account.password")))
// 	    		timeout();
// 		}, 10000);
// 	}

// });


taskyBird.sockets = {

	subscribeAndListen : function subscribeAndListen() {
		var socket = io.connect(taskyBird.Preferences.getCharPref("server.url"));
        socket.on('email',function(obj){
        	// alert('socket arrived');
        	console.log('socket arrived');
    	    console.log(obj);
            taskyBird.Sync.init();
        });

        socket.on('error',function(err){
			alert("Error server probably down trying to reconnect and relog in 30 seconds: "+err.message);
			timeout();

			function timeout() {
			    setTimeout(function() {
			    	alert('trying to auth');
			    	if(!taskyBird.Api.authenticate(window, taskyBird.Preferences.getCharPref("account.user"), taskyBird.Preferences.getCharPref("account.password")))
			    		timeout();
				}, 10000);
			}

		});
	}
};






		//let hdr = GetEmailByMessageId(data.messageId);	// TODO make this work
		//taskyBird.setMsgHeaders(hdr, data);
