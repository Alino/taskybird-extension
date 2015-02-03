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

/*===============
  Project History
  ===============
	
	0.1  - 14/08/2014
	  ## Prototype: 
    ## Added custom columns - Responsible (=Assignee), [Assigner], Task Status
	  ## Options dialog: added tabs-general, account settings, ajax test
	  ## Added some random status icons
 
  =========================================================== 
*/    


var taskyBird = {
  firstRunChecked: false,
  firstRunCount: 0,


  get contextTaskyBird() {
    switch (taskyBird.Util.Application) {
      case 'Postbox':
        return 'context-taskybird-postbox';
      case 'SeaMonkey':
      case 'Thunderbird':
      default:
        return 'context-taskybird';
    }
  } ,
  
  get mailContext() {
    switch (taskyBird.Util.Application) {
      case 'Postbox':
        return 'threadPaneContext';
      case 'SeaMonkey':
      case 'Thunderbird':
      default:
        return 'mailContext';
    }
  } ,
  
  onMessengerLoad: function onMessengerLoad() {
  
    taskyBird.strings = document.getElementById("taskybird-strings");
    
    let contextId = taskyBird.mailContext;
    
    // Postbox: threadPaneContext
    let context = document.getElementById(contextId);
    if (context) {
      context.addEventListener("popupshowing", function (e) {
        taskyBird.showThreadContextMenu(e);
      }, false);
      
      let ObserverService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
      ObserverService.addObserver(taskyBird.dbObserver, "MsgCreateDBView", false);
    }
    // initialization code
    taskyBird.initialized = true;
    setTimeout(function() { taskyBird.checkFirstRun(); }, 3000);
    setTimeout(function() { taskyBird.Api.authenticate(window, taskyBird.Preferences.getCharPref("account.user"), taskyBird.Preferences.getCharPref("account.password")); }, 2000);
    setTimeout(function() { taskyBird.moveContextMenu(); }, 2000);
    setTimeout(function() { taskyBird.populateTeamsMenu(taskyBird.Sync.teams); }, 2000);
  } ,

  
  // move #taskybird-popup menu to the correct context menu: #context-taskybird-postbox
  moveContextMenu: function moveContextMenu() {
    //if (taskyBird.Util.Application=='Postbox') {
      let taskyMenu = document.getElementById(taskyBird.contextTaskyBird);
      let taskyPopup = document.getElementById("taskybird-popup");
      if (taskyMenu)
        taskyMenu.appendChild(taskyPopup);
    //}
  } ,


  populateTeamsMenu: function populateTeamsMenu(teams) {
       function createMenu(aLabel, id) {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        let item = document.createElementNS(XUL_NS, "menu"); // create a new XUL menu
        item.setAttribute("label", aLabel);
        item.setAttribute("id", id);
        return item;
      }

       function createMenuPopup(aLabel, id) {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        let item = document.createElementNS(XUL_NS, "menupopup"); // create a new XUL menupopup
        item.setAttribute("label", aLabel);
        item.setAttribute("id", id);
        item.setAttribute("onpopupshowing", "taskyBird.Interface.showStatusPopup(this, event);");
        return item;
      }

      function createMenuItem(aLabel, user_id) {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        let item = document.createElementNS(XUL_NS, "menuitem"); // create a new XUL menuitem
        item.setAttribute("label", aLabel);
        item.setAttribute("oncommand", "taskyBird.Interface.setAsigneeFromPopup(this, event, "+user_id+");");
        item.setAttribute("type", "radio");
        item.setAttribute("name", "Assignee");
        item.setAttribute("value", user_id);
        return item;
      }

      let popup = document.getElementById("context-taskybird-assignpopup"); // a <menupopup> element
      var createmenu = null;
      var createpopup= null;
      var createitem = null;

      
      for (let x=0; x<=teams.teams.length; x++) {
          createmenu = createMenu(teams.teams[x].name, "menu-team-id-"+teams.teams[x].id);
          createpopup= createMenuPopup(teams.teams[x].name, "popup-team-id-"+teams.teams[x].id);

          //console.log(createmenu);
          //console.log(createpopup);
         
        if (x==0) {
          popup.insertBefore(createmenu, popup.firstChild);
          createmenu.insertBefore(createpopup, createmenu.firstChild);
        } else {
          popup.appendChild(createmenu);
          createmenu.appendChild(createpopup);
          if (x==teams.teams.length-1) {
             for (let i=0; i<taskyBird.Sync.users.users.length; i++) {
                  createpopup = document.getElementById("popup-team-id-"+taskyBird.Sync.users.users[i].team_id);
                  createitem = createMenuItem(taskyBird.Sync.users.users[i].name + " " +taskyBird.Sync.users.users[i].id, parseInt(taskyBird.Sync.users.users[i].id));
                  // createpopup.insertBefore(createitem, createpopup.firstChild);
                  createpopup.appendChild(createitem);
              }
          }
        }
      }
  } ,

  onMenuItemCommand: function onMenuItemCommand(menuItem, evt, command) {
    alert('jebat1');
    let promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
    let msg = "";
    switch(command) {
      case 'status':
        // taskyBird.Interface.showPopup(menuItem, 'context-taskybird-status', evt);
        return;
      case 'assign':
        msg = "To do: Assign To...";
        break;
      default:
        msg = this.strings.getString("taskyBird.helloMessage");
    }
    promptService.alert(window, this.strings.getString("taskyBird.helloMessageTitle"), msg);
  } ,
  

  EmailExistsOnServer: function EmailExistsOnServer(messageId) {
    let email;
    let util = taskyBird.Util;
    try {
      email = JSON.parse( taskyBird.Api.getEmail(messageId) );
    }
    catch(error) {
      email = { err: taskyBird.Api.getEmail(messageId) };
    }
    util.logDebugOptional ('ajax', "checking if email exists in database:\n" + email);
    if (email._id) return true;
  } ,

  /**
  ** Sets status on the server side
  ** hdr = nsIMsgDbHeader
  **/
  setMsgStatus: function setMsgStatus(hdr, status) {
    let postData;
    let util = taskyBird.Util;
    if ( !taskyBird.EmailExistsOnServer(hdr.messageId) ) {
      postData = {
        "_id": hdr.messageId,
        "responsible_user_id": taskyBird.Auth.currentUser.id,
        "status": status,
      };
      let res = JSON.parse(taskyBird.Api.createEmail(postData));
      console.log(res);

      if (res.email._id) {
        let data = { status: res.email.status, responsible_user_id: res.email.responsible_user_id, assigned_by: res.email.assigned_by };
        taskyBird.setMsgHeaders(hdr, data);
        util.logDebugOptional ('ajax', 'new email created in server database - ' + hdr.messageId + ' server response: ' + res);
      }
      else {
        alert("Error: taskybird server unreachable");
        util.logDebugOptional ('ajax', 'something went wrong, unable to create email on server | server response: ' + res);
      }
    }
    else { //update status for existing record in server database
      postData = {
        "_id": hdr.messageId,
        "status": status,
      };
      let res = JSON.parse(taskyBird.Api.updateEmail(postData));
      console.log(res.email);
      if (res.email[0]._id) {
        let data = { status: res.email[0].status };
        taskyBird.setMsgHeaders(hdr, data);
        util.logDebugOptional ('ajax', 'updated status for existing email - ' + hdr.messageId + ' server response: ' + res);
      }
      else {
        alert("Error: taskybird server unreachable");
        util.logDebugOptional ('ajax', 'something went wrong, unable to update email on server | server response: ' + res);
      }
    }
  } ,

   /**
  ** Sets asignee on the server side
  ** hdr = nsIMsgDbHeader
  **/
  setMsgAsignee: function setMsgAsignee(hdr, asignee) {
    let postData;
    let util = taskyBird.Util;

    if ( !taskyBird.EmailExistsOnServer(hdr.messageId) ) {
      postData = {
        "_id": hdr.messageId,
        "responsible_user_id": asignee,
      };
      let res = JSON.parse(taskyBird.Api.createEmail(postData));
      console.log(res);

      if (res.email._id) {
        let data = { status: res.email.status, responsible_user_id: res.email.responsible_user_id, assigned_by: res.email.assigned_by };
        taskyBird.setMsgHeaders(hdr, data);
        util.logDebugOptional ('ajax', 'new email created in server database - ' + hdr.messageId + ' server response: ' + res);
      }
      else {
        alert("Error: taskybird server unreachable");
        util.logDebugOptional ('ajax', 'something went wrong, unable to create email on server | server response: ' + res);
      }
    }
    else { //update status for existing record in server database
      postData = {
        "_id": hdr.messageId,
        "responsible_user_id": asignee,
      };
      let res = JSON.parse(taskyBird.Api.updateEmail(postData));
      console.log(res.email);
      if (res.email[0]._id) {
        let data = { status: res.email[0].status, assigned_by: res.email[0].assigned_by, responsible_user_id: res.email[0].responsible_user_id };
        taskyBird.setMsgHeaders(hdr, data);
        util.logDebugOptional ('ajax', 'updated status for existing email - ' + hdr.messageId + ' server response: ' + res);
      }
      else {
        alert("Error: taskybird server unreachable");
        util.logDebugOptional ('ajax', 'something went wrong, unable to update email on server | server response: ' + res);
      }
    }
  } ,

  
  /**
  ** Sets headers for an email, updates UI
  **/
  setMsgHeaders: function setMsgHeaders(hdr, data) {
    console.log('setMsgHeaders called!');
    let promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
    let msg = "To do - Set status code to: " + taskyBird.Interface.getStatusLabel(status);
    if (hdr) {
      msg += "\n messageKey:" + hdr.messageKey;
      msg += "\n threadId:" + hdr.threadId;
      msg += "\n subject:" + hdr.mime2DecodedSubject;
    }
    taskyBird.Util.logDebug('setMsgHeaders() \n' + msg);
    if (data.status) hdr.setUint32Property("x-tasky-status", data.status);
    if (data.responsible_user_id) hdr.setUint32Property("x-tasky-assignee", data.responsible_user_id);
    if (data.assigned_by) hdr.setUint32Property("x-tasky-assigner", data.assigned_by);


    // gDBView.reloadMessage(); // I commented this out because it breaks encoding on socket arrival
  } ,

  /**
  ** Removes headers from an email
  **/
  removeMsgHeaders: function removeMsgHeaders(hdr) {
    console.log('removing message headers');
    // this is just a pseudo remove, they are set to "0" 
    hdr.setUint32Property("x-tasky-status", false);
    hdr.setUint32Property("x-tasky-assignee", false);
    hdr.setUint32Property("x-tasky-assigner", false);
  } ,

  onToolbarButtonCommand: function onToolbarButtonCommand(e) {
    taskyBird.showOptions();
  } ,
  
  showOptions: function showOptions() {
    window.openDialog('chrome://taskybird/content/options.xul','taskybird-options','chrome,titlebar,centerscreen,resizable,alwaysRaised,instantApply').focus();
  } ,
  
  columnHandlerResponsible: {
    getCellText: function(row, col) {
      //get the message's header so that we can extract the reply to field
      var hdr = gDBView.getMsgHdrAt(row);

      if (hdr.getStringProperty("x-tasky-assignee")) {
        if (hdr.getStringProperty("x-tasky-assignee") === "0") return;
        for (var x=0; x<taskyBird.Sync.users.users.length; x++) {
          if (parseInt(taskyBird.Sync.users.users[x].id) === parseInt(hdr.getStringProperty("x-tasky-assignee"), 16))
            return taskyBird.Sync.users.users[x].name;
        }
      }
      return hdr.getStringProperty("x-tasky-assignee");
    } ,
    getSortStringForRow: function(hdr) {return hdr.getStringProperty("x-tasky-assignee");},
    isString:            function() {return true;},

    getCellProperties:   function(row, col, props){},
    getRowProperties:    function(row, props){},
    getImageSrc:         function(row, col) {return null;},
    getSortLongForRow:   function(hdr) {return 0;}
  } ,
  
  columnHandlerAssignedBy: {
    getCellText: function(row, col) {
      //get the message's header so that we can extract the reply to field
      var hdr = gDBView.getMsgHdrAt(row);
      if (hdr.getStringProperty("x-tasky-assigner")) {
        if (hdr.getStringProperty("x-tasky-assigner") === "0") return;
        for (var i=0; i<=taskyBird.Sync.users.users.length-1; i++) {
          if (parseInt(taskyBird.Sync.users.users[i].id) == parseInt(hdr.getStringProperty("x-tasky-assigner"), 16))
            return taskyBird.Sync.users.users[x].name;
        }
      }
      return hdr.getStringProperty("x-tasky-assigner");
    } ,
    getSortStringForRow: function(hdr) {return hdr.getStringProperty("x-tasky-assigner");},
    isString:            function() {return true;},

    getCellProperties:   function(row, col, props){},
    getRowProperties:    function(row, props){},
    getImageSrc:         function(row, col) {return null;},
    getSortLongForRow:   function(hdr) {return 0;}
  } ,

  // we need an enum for this?
  columnHandlerTaskStatus: {
    // nsITreeView
    getCellText: function(row, col) {
      //get the message's header so that we can extract the reply to field
      let hdr = gDBView.getMsgHdrAt(row);
      return ""; // hdr.getStringProperty("taskstatus");
    } ,
    getCellProperties:   function(row, col, props){},
    getRowProperties:    function(row, props){},
    getImageSrc:         function(row, col) {
      let hdr = gDBView.getMsgHdrAt(row);
      let iStatus = hdr.getStringProperty("x-tasky-status");
      /*  // TEST icons
      let min = 0;
      let max = 10; // increase chances for empty icon
      iStatus = Math.floor(Math.random() * (max - min)) + min;
      */
      // taskyBird.Util.logDebug("x-tasky-status[" + row +"]  " + iStatus);
      if (hdr.getStringProperty("x-tasky-status")) {
        if (hdr.getStringProperty("x-tasky-status") === "0") return;
        return taskyBird.Interface.getStatusIcon(iStatus);
      }
    },
    
    // nsIMsgCustomColumnHandler
    getSortStringForRow: function(hdr) {return hdr.getStringProperty("x-tasky-status");},
    isString:            function() {return false;},
    getSortLongForRow:   function(hdr) {
      let status = hdr.getStringProperty("x-tasky-status");
      let sort = status ? parseInt(status,10) : -1;
      return sort;
    }
  } ,
  
  dbObserver: {
    // Components.interfaces.nsIObserver
    observe: function(aMsgFolder, aTopic, aData) {  
       //addCustomColumnHandler();
       gDBView.addColumnHandler("colResponsible", taskyBird.columnHandlerResponsible);
       gDBView.addColumnHandler("colAssigner", taskyBird.columnHandlerAssignedBy);
       gDBView.addColumnHandler("colTaskStatus", taskyBird.columnHandlerTaskStatus);
    }  
  } ,
  
  showThreadContextMenu: function showThreadContextMenu(event) {
    // show or hide the menuitem based on what the context menu is on
    try {
      isHidden = (taskyBird.Util.Application != 'SeaMonkey') 
               && (gContextMenu ? !gContextMenu.inThreadPane : true);
      document.getElementById(this.contextTaskyBird).hidden = isHidden;
    }
    catch(ex) {
				taskyBird.Util.logException("showThreadContextMenu()", ex);    
    }
  } ,

  
  checkFirstRun: function checkFirstRun() {
		let util = taskyBird.Util;
    try {
      if (this.firstRunChecked)
        return;
      this.firstRunCount++;
      util.logDebug("=================taskyBird==============\n" + "   checkFirstRun() - attempt " + this.firstRunCount);
      let currentVersion = util.Version;
      // retry until version number doesn't lie anymore
      /*
      if (currentVersion.indexOf("hc")>=0) {
        window.setTimeout(function() { taskyBird.checkFirstRun(); }, 1000);
        return;
      }
      */
      
      let installedVersion = taskyBird.Preferences.getCharPref("installedVersion");
      let firstRun = taskyBird.Preferences.getBoolPref("firstRun");
      util.logDebug("firstRun = " + firstRun + "  - currentVersion = " + currentVersion + "  - installed = " + installedVersion);
      let toolbarId = '';
      if (firstRun) {
        switch(util.Application) {
          case 'Thunderbird':
            toolbarId = "mail-bar3";
            break;
          case 'SeaMonkey':
            toolbarId = "msgToolbar";
            break;
          case 'Postbox':
            toolbarId = "mail-bar7";
            break;
        }
        util.installButton(toolbarId, "taskybird-toolbar-button");
        
        /** Add custom headers for composer **/
        taskyBird.Preferences.addCustomHeaders("mail.compose.other.header", ',');
        /** Add custom headers for incoming mails - delimit with space **/
        taskyBird.Preferences.addCustomHeaders("mailnews.customDBHeaders", ' '); 
        
        taskyBird.Preferences.setBoolPref("firstRun", false);
        util.showHomePage();
      }
      else {
        // is this an update?
				let installedV = util.getVersionSimple(installedVersion);
				let currentV = util.getVersionSimple(currentVersion);
        if (currentVersion.indexOf("hc") ==-1)
        {
          // make sure we have really retrieved the version!
					if (util.versionSmaller(installedV, currentV))
					{ 				
						util.showVersionHistory(false);
						
						if (taskyBird.Preferences.getBoolPrefSilent("extensions.taskybird.donations.askOnUpdate")
						    && !(installedV=="0" && currentV=="0.1")
                )
						  util.showDonatePage();
					}
        }

      }
      util.logDebug("store installedVersion: " + util.getVersionSimple(currentVersion));
      taskyBird.Preferences.setCharPref("installedVersion", util.getVersionSimple(currentVersion));
      this.firstRunChecked = true;
    }
    catch(ex) {
      util.logException("checkFirstRun failed", ex);
    }

  } 
};

taskyBird.Auth = {
  currentUser : null,
  token: null,
  lastError: null,
  /**
  * login and get token and user
  */
  init : function init(usr, pwd) {
    let credentials = {
      'email': usr,
      'password': pwd
    };

    this.lastError = null;
  ﻿  let xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("POST", taskyBird.Preferences.getCharPref("server.url")+"/auth/authenticate", false);﻿
  ﻿  xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(credentials));

    let response = JSON.parse(xmlhttp.responseText);
    if (response.err) {
      this.lastError = response.err;
      taskyBird.Util.logDebug('Authentication error: ' + lastError);
      return false;
    }
    
    if (response.user) {
      let auth = taskyBird.Auth;
      auth.currentUser = response.user;
      auth.token = response.token;
      console.log(auth.currentUser);
      console.log(auth.token);
      alert('you are authenticated as ' + auth.currentUser.email + ' syncing...');
      // REMEMBER user credentials
      taskyBird.Preferences.setCharPref("account.user", auth.currentUser.email);
      taskyBird.Preferences.setCharPref("account.password", credentials.password);
      // Initialize synchronization
      taskyBird.Sync.init();

      return true; //Auth success
    }
    else {
      alert('something strange occured during authentication, server down or api broken.');
    }
    return false;
  }
 
}





window.addEventListener("load", function () { taskyBird.onMessengerLoad(); }, false);
window.addEventListener("load", function () { taskyBird.sockets.subscribeAndListen(); }, false);



