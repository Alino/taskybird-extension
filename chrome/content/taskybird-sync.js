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


taskyBird.Sync = {
  users: null,
  teams: null,
  emails: null,
  in_progress: false,
  init : function init() {
    this.in_progress = true;
    this.users = JSON.parse(taskyBird.Api.getUsers());
    this.teams = JSON.parse(taskyBird.Api.getTeams());
    let last_sync = taskyBird.Preferences.getCharPref("lastSync");
    // last_sync = '2015-01-06 10:50:20';
    this.emails = JSON.parse(taskyBird.Api.getEmailsNewerThanTimestamp(last_sync));
    console.log(last_sync);
    console.log(this.teams);
    console.log(this.users);
    console.log(this.emails);

    if (this.emails.emails.length > 0) this.setEmailHeaders(this.emails.emails);
    taskyBird.Preferences.setCharPref("lastSync", taskyBird.Api.getTime());
    // alert('sync complete, time recieved from server is: ' + taskyBird.Api.getTime());
    this.in_progress = false;
  } ,

  setEmailHeaders : function setEmailHeaders(emails) {
    console.log(emails);
    for (var i=0; i<=emails.length-1; i++) {
      let messageId = emails[i]._id;
      let data = { status: emails[i].status, responsible_user_id: emails[i].responsible_user_id, assigned_by: emails[i].assigned_by };
      // find this messageId and set hdr
      let Ci = Components.interfaces;
      let gDbService = Cc["@mozilla.org/msgDatabase/msgDBService;1"].getService(Ci.nsIMsgDBService);
      let openDBs = gDbService.openDBs;
      var hdr;
      var folderdb;

      for (var x=0; x<openDBs.length; x++) {
        folderdb = openDBs.queryElementAt(x, Ci.nsIMsgDatabase);
        hdr = folderdb.getMsgHdrForMessageID(messageId);
        if (hdr !== null) {
          taskyBird.setMsgHeaders(hdr, data);
          console.log('headers set on ' + messageId);
          break;
        }
      }
      // if (!hdr) console.log('ERROR: setting email header failed - unable to find messageId: ' + messageId);

    }
  } ,
  
}