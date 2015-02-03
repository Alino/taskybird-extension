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


taskyBird.Properties = {
  bundle: Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle("chrome://taskybird/locale/overlay.properties"),

  getLocalized: function(msg) {
    let b = this.bundle;
    if (!b)
      b = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle("chrome://taskybird/locale/overlay.properties");
    return b.GetStringFromName(msg);
  }
};


taskyBird.TabURIregexp = {
  get _thunderbirdRegExp() {
    delete this._thunderbirdRegExp;
    return this._thunderbirdRegExp = new RegExp("^http://taskybird.dopice.sk/");
  }
};

taskyBird.Sites = {
  versionHistory: "http://taskybird.dopice.sk/index.php/site/version.php",
  homePage: "http://taskybird.dopice.sk",
  donationsPage: "http://taskybird.dopice.sk/donate.php"
}

taskyBird.Util = {
  HARDCODED_EXTENSION_VERSION : "0.1",
  HARDCODED_EXTENSION_TOKEN : ".hc",
  ADDON_ID: "taskybird@dopice.sk",
  VersionProxyRunning: false,
  mAppver: null,
  mAppName: null,
  mHost: null,
  mExtensionVer: null,
  ConsoleService: null,
  lastTime: 0,

  // gets string from overlay.properties
  getBundleString: function(id, defaultText) {
    try {
      var s= taskyBird.Properties.getLocalized(id); 
    }
    catch(e) {
      s = defaultText;
      this.logException ("Could not retrieve bundle string: " + id, e);
    }
    return s;
  } ,

  getMail3PaneWindow: function() {
    let windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
        .getService(Components.interfaces.nsIWindowMediator);
    var win3pane = windowManager.getMostRecentWindow("mail:3pane");
    return win3pane;
  } ,
  
  get AppverFull() {
    var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
            .getService(Components.interfaces.nsIXULAppInfo);
    return appInfo.version;
  },

  get Appver() {
    if (null === this.mAppver) {
    var appVer=this.AppverFull.substr(0,3); // only use 1st three letters - that's all we need for compatibility checking!
      this.mAppver = parseFloat(appVer); // quick n dirty!
    }
    return this.mAppver;
  },

  get Application() {
    if (null===this.mAppName) {
    var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
            .getService(Components.interfaces.nsIXULAppInfo);
      const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
      const THUNDERBIRD_ID = "{3550f703-e582-4d05-9a08-453d09bdfdc6}";
      const SEAMONKEY_ID = "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}";
      const POSTBOX_ID = "postbox@postbox-inc.com";
      switch(appInfo.ID) {
        case FIREFOX_ID:
          return this.mAppName='Firefox';
        case THUNDERBIRD_ID:
          return this.mAppName='Thunderbird';
        case SEAMONKEY_ID:
          return this.mAppName='SeaMonkey';
        case POSTBOX_ID:
          return this.mAppName='Postbox';
        default:
          this.mAppName=appInfo.name;
          this.logDebug ( 'Unknown Application: ' + appInfo.name);
          return appInfo.name;
      }
    }
    return this.mAppName;
  },
  
  get HostSystem() {
    if (null===this.mHost) {
      var osString = Components.classes["@mozilla.org/xre/app-info;1"]
            .getService(Components.interfaces.nsIXULRuntime).OS;
      this.mHost = osString.toLowerCase();
    }
    return this.mHost; // linux - winnt - darwin
  },

  // this is done asynchronously, so it respawns itself
  VersionProxy: function() {
    /*
    try {
      if (taskyBird.Util.mExtensionVer // early exit, we got the version!
        ||
          taskyBird.Util.VersionProxyRunning) // no recursion...
        return;
      taskyBird.Util.VersionProxyRunning = true;
      taskyBird.Util.logDebug("Util.VersionProxy() started.");
      let myId = taskyBird.Util.ADDON_ID;
      if (Components.utils.import) {
        Components.utils.import("resource://gre/modules/AddonManager.jsm");

        AddonManager.getAddonByID(myId, function(addon) {
          taskyBird.Util.mExtensionVer = addon.version;
          taskyBird.Util.logDebug("AddonManager: taskyBird extension's version is " + addon.version);
          let versionLabel = window.document.getElementById("qf-options-version");
          if(versionLabel) {
            versionLabel.setAttribute("value", addon.version);
            // move version into the box, depending on label length
            taskyBird.Util.logDebug("Version Box: " + versionLabel.boxObject.width + "px");
            versionLabel.style.setProperty('margin-left', ((versionLabel.boxObject.width + 32)*(-1)).toString() + 'px', 'important');
          }
        });
      }
      taskyBird.Util.logDebug("AddonManager.getAddonByID .. added callback for setting extensionVer.");

    }
    catch(ex) {
      taskyBird.Util.logToConsole("taskyBird VersionProxy failed - are you using an old version of " + taskyBird.Util.Application + "?"
        + "\n" + ex);
    }
    finally {
      taskyBird.Util.VersionProxyRunning=false;
    }
    */
  },

  get Version() {
    //returns the current QF version number.
    if(taskyBird.Util.mExtensionVer)
      return taskyBird.Util.mExtensionVer;
    var current = taskyBird.Util.HARDCODED_EXTENSION_VERSION + taskyBird.Util.HARDCODED_EXTENSION_TOKEN;

    if (!Components.classes["@mozilla.org/extensions/manager;1"]) {
      // Addon Manager: use Proxy code to retrieve version asynchronously
      taskyBird.Util.VersionProxy(); // modern Mozilla builds.
                        // these will set mExtensionVer (eventually)
                        // also we will delay FirstRun.init() until we _know_ the version number
      if (taskyBird.Util.mExtensionVer)                  
        current = taskyBird.Util.mExtensionVer;
    }
    else  // --- older code: extensions manager.
    {
      try {
        if(Components.classes["@mozilla.org/extensions/manager;1"])
        {
          var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
            .getService(Components.interfaces.nsIExtensionManager);
          current = gExtensionManager.getItemForID(taskyBird.Util.ADDON_ID).version;
        }
        else {
          current = current + "(?)";
        }
        taskyBird.Util.mExtensionVer = current;

      }
      catch(ex) {
        current = current + "(?ex?)" // hardcoded, program this for Tb 3.3 later
        taskyBird.Util.logToConsole("TaskyBird Version retrieval failed - are you using an old version of " + taskyBird.Util.Application + "?");
      }
    }
    return current;
  } ,

  get VersionSanitized() {
    return this.getVersionSimple(this.Version);
  } ,
  
  getVersionSimple: function(ver) {
    let pureVersion = ver;  // default to returning unchanged
    // get first match starting with numbers mixed with .   
    let reg = new RegExp("[0-9.]*");
    let results = ver.match(reg); 
    if (results) 
      pureVersion = results[0];
    return pureVersion;
  }  ,
  
  slideAlert: function (text, title, icon) {
    try {
      if (!icon)
        icon = "chrome://taskybird/skin/taskybird_32.png";
      else
        icon = "chrome://taskybird/skin/" + icon;
      if (!title)
        title = "TaskyBird";
      taskyBird.Util.logToConsole('popupAlert(' + text + ', ' + title + ')');
      Components.classes['@mozilla.org/alerts-service;1'].
                getService(Components.interfaces.nsIAlertsService).
                showAlertNotification(icon, title, text, false, '', null);
    }
    catch(e) {
      // prevents runtime error on platforms that don't implement nsIAlertsService
      alert(text);
    }
  } ,
  
  popupAlert: function (text, title, icon) {
    try {
      if (!icon)
        icon = "chrome://taskybird/skin/taskybird_32.png";
      else
        icon = "chrome://taskybird/skin/" + icon;
      if (!title)
        title = "Taskybird";
      let panel = document.getElementById('taskyBirdNotification');
      if (panel) {
        panel.openPopup(null, "after_start", 0, 0, false, false);
        let notificationBox = document.getElementById('taskyBirdNotificationBox');
        let priority = notificationBox.PRIORITY_WARNING_MEDIUM;
        // appendNotification( label , value , image , priority , buttons, eventCallback )
        let note = notificationBox.appendNotification( text , null , icon , priority, null, null ); 
        notificationBox.addEventListener('alertclose', function() { alert('test'); });
        window.setTimeout(function() {try{notificationBox.removeNotification(note)}catch(e){};panel.hidePopup();}, 4000);
        //let note = document.createElement('notification');
        //note.setAttribute(label, text);
        //note.setAttribute(image, icon);
        //panel.appendChild(note);
      }
      else {
        let prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                      .getService(Components.interfaces.nsIPromptService);

        //let check = {value: false};   // default the checkbox to true
        prompts.alert(window, title, text); 
      }
    }
    catch(e) {
      // prevents runtime error on platforms that don't implement nsIAlertsService
      this.logException ("taskyBird.util.popupAlert() ", e);
      alert(text);
    }
  } ,

  logTime: function() {
    var timePassed = '';
    try { // AG added time logging for test
      var end= new Date();
      var endTime = end.getTime();
      if (this.lastTime === 0) {
        this.lastTime = endTime;
        return "[logTime init]"
      }
      var elapsed = new String(endTime - this.lastTime); // time in milliseconds
      timePassed = '[' + elapsed + ' ms]   ';
      this.lastTime = endTime; // remember last time
    }
    catch(e) {;}
    return end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds() + '.' + end.getMilliseconds() + '  ' + timePassed;
  },

  logToConsole: function (msg, optionTag) {
    if (taskyBird.Util.ConsoleService === null)
      taskyBird.Util.ConsoleService = Components.classes["@mozilla.org/consoleservice;1"]
                  .getService(Components.interfaces.nsIConsoleService);
    taskyBird.Util.ConsoleService.logStringMessage("TaskyBird " 
			+ (optionTag ? '{' + optionTag.toUpperCase() + '} ' : '')
			+ this.logTime() + "\n"+ msg);
  },

  // flags
  // errorFlag    0x0   Error messages. A pseudo-flag for the default, error case.
  // warningFlag    0x1   Warning messages.
  // exceptionFlag  0x2   An exception was thrown for this case - exception-aware hosts can ignore this.
  // strictFlag     0x4
  logError: function (aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags)
  {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                   .getService(Components.interfaces.nsIConsoleService);
    var aCategory = '';

    var scriptError = Components.classes["@mozilla.org/scripterror;1"].createInstance(Components.interfaces.nsIScriptError);
    scriptError.init(aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags, aCategory);
    consoleService.logMessage(scriptError);
  } ,

  logException: function (aMessage, ex) {
    var stack = '';
    if (typeof ex.stack!='undefined')
      stack= ex.stack.replace("@","\n  ");

    let srcName = ex.fileName ? ex.fileName : "";
    this.logError(aMessage + "\n" + ex.message, srcName, stack, ex.lineNumber, 0, 0x1); // use warning flag, as this is an exception we caught ourselves
  } ,

  logDebug: function (msg) {
    if (taskyBird.Preferences.Debug)
      this.logToConsole(msg);
  },

  logDebugOptional: function (option, msg) {
    if (taskyBird.Preferences.isDebugOption(option))
      this.logToConsole(msg, option);
  },
  
    // dedicated function for email clients which don't support tabs
  // and for secured pages (donation page).
  openLinkInBrowserForced: function(linkURI) {
    let Ci = Components.interfaces;
    try {
      this.logDebug("openLinkInBrowserForced (" + linkURI + ")");
      if (taskyBird.Util.Application==='SeaMonkey') {
        var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
        var browserWin = windowManager.getMostRecentWindow( "navigator:browser" );
        if (browserWin) {
          let URI = linkURI;
          setTimeout(function() { 
						let tabBrowser = browserWin.getBrowser();
						let params = {"selected":true};
					  browserWin.currentTab = tabBrowser.addTab(URI, params); 
						if (browserWin.currentTab.reload) browserWin.currentTab.reload(); 
						// activate last tab
						if (tabBrowser && tabBrowser.tabContainer)
							tabBrowser.tabContainer.selectedIndex = tabBrowser.tabContainer.childNodes.length-1;
					}, 250);
        }
        else {
          this.getMail3PaneWindow().window.openDialog(getBrowserURL(), "_blank", "all,dialog=no", linkURI, null, 'TaskyBird');
        }

        return;
      }
      var service = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
        .getService(Ci.nsIExternalProtocolService);
      var ioservice = Components.classes["@mozilla.org/network/io-service;1"].
            getService(Ci.nsIIOService);
      var uri = ioservice.newURI(linkURI, null, null);
      service.loadURI(uri);
    }
    catch(e) { this.logDebug("openLinkInBrowserForced (" + linkURI + ") " + e.toString()); }
  },


  // moved from options.js
  // use this to follow a href that did not trigger the browser to open (from a XUL file)
  openLinkInBrowser: function(evt,linkURI) {
    let Cc = Components.classes;
    let Ci = Components.interfaces;
    if (taskyBird.Util.Application === 'Thunderbird') {
      var service = Cc["@mozilla.org/uriloader/external-protocol-service;1"]
        .getService(Ci.nsIExternalProtocolService);
      var ioservice = Cc["@mozilla.org/network/io-service;1"].
            getService(Ci.nsIIOService);
      service.loadURI(ioservice.newURI(linkURI, null, null));
      if(null !== evt)
        evt.stopPropagation();
    }
    else {
      this.openLinkInBrowserForced(linkURI);
    }
  },

  // moved from options.js (then called
  openURL: function(evt,URL) { // workaround for a bug in TB3 that causes href's not be followed anymore.
    var ioservice,iuri,eps;

    if (taskyBird.Util.Application==='SeaMonkey' || taskyBird.Util.Application==='Postbox')
    {
      this.openLinkInBrowserForced(URL);
      if(null!=evt) evt.stopPropagation();
    }
    else {
      if (this.openURLInTab(URL) && null!=evt) {
        if (evt.preventDefault)  evt.preventDefault();
        if (evt.stopPropagation)  evt.stopPropagation();
      }
    }
  },

  openURLInTab: function (URL) {
    try {
		  switch(taskyBird.Util.Application) {
			  case "SeaMonkey":
					this.openLinkInBrowserForced(URL);
					return;
				case "Postbox":
					this.openLinkInBrowser(null, URL);
					return;
				case "Thunderbird":
					var sTabMode="";
					let tabmail = this.tabmail;
					if (!tabmail) {
						// Try opening new tabs in an existing 3pane window
						var mail3PaneWindow = this.getMail3PaneWindow();
						if (mail3PaneWindow) {
							tabmail = mail3PaneWindow.document.getElementById("tabmail");
							mail3PaneWindow.focus();
						}
					}
					if (tabmail) {
						sTabMode = (taskyBird.Util.Application === "Thunderbird" && taskyBird.Util.Appver >= 3) ? "contentTab" : "3pane";
						tabmail.openTab(sTabMode,
						{contentPage: URL, clickHandler: "specialTabs.siteClickHandler(event, taskyBird.TabURIregexp._thunderbirdRegExp);"});
					}
					else {
						window.openDialog("chrome://messenger/content/", "_blank",
											"chrome,dialog=no,all", null,
						{ tabType: "contentTab", tabParams: {contentPage: URL, clickHandler: "specialTabs.siteClickHandler(event, taskyBird.TabURIregexp._thunderbirdRegExp);", id:"TaskyBird_Weblink"} } );
					}
			}
    }
    catch(e) { return false; }
    return true;
  } ,
  
  
	  
  /**
   * Installs the toolbar button with the given ID into the given
   * toolbar, if it is not already present in the document.
   *
   * @param {string} toolbarId The ID of the toolbar to install to.
   * @param {string} id The ID of the button to install.
   * @param {string} afterId The ID of the element to insert after. @optional
   */
  installButton: function(toolbarId, id, afterId) {
    if (!document.getElementById(id)) {
      this.logDebug("installButton(" + toolbarId + "," + id + "," + afterId + ")");

      var toolbar = document.getElementById(toolbarId);

      // If no afterId is given, then append the item to the toolbar
      var before = null;
      if (afterId) {
        let elem = document.getElementById(afterId);
        if (elem && elem.parentNode == toolbar)
            before = elem.nextElementSibling;
      }

      this.logDebug("toolbar.insertItem(" + id  + "," + before + ")");
      toolbar.insertItem(id, before);
      toolbar.setAttribute("currentset", toolbar.currentSet);
      this.logDebug("document.persist" + toolbar.id + ")");
      document.persist(toolbar.id, "currentset");

    }
  }  ,

  showVersionHistory: function(ask) {
    let version = taskyBird.Util.VersionSanitized;
    let sPrompt = taskyBird.Util.getBundleString("taskyBird.confirmVersionLink", "Display version history for TaskyBird?")
    if (!ask || confirm(sPrompt)) {
      taskyBird.Util.openURL(null, taskyBird.Sites.versionHistory + '#' + version);
    }
  } ,    
  
  showHomePage: function (queryString) {
	  if (!queryString) queryString='index.php';
    taskyBird.Util.openURLInTab(taskyBird.Sites.homePage +'/' + queryString);
  } ,

  showDonatePage: function () {
    taskyBird.Util.openURLInTab(taskyBird.Sites.donationsPage);
  } ,

  
  versionSmaller: function(a, b) {
    /*
      Compares Application Versions
      returns
      - is smaller than 0, then A < B
      -  equals 0 then Version, then A==B
      - is bigger than 0, then A > B
    */
    let versionComparator = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                            .getService(Components.interfaces.nsIVersionComparator);
     return (versionComparator.compare(a, b) < 0);
  } ,
  
	pbGetSelectedMessageURIs : function ()
	{
	  try {
	    var messageArray = {};
	    var length = {};
	    var view = GetDBView();
	    view.getURIsForSelection(messageArray, length);
	    if (length.value)
	    	return messageArray.value;
	    else
	    	return null;
	  }
	  catch (ex) {
	    dump("GetSelectedMessages ex = " + ex + "\n");
	    return null;
	  }
	},  
  
  selectedMessages: function() {
    let messages=[];
		if (typeof gFolderDisplay !='undefined') {
			messages = gFolderDisplay.selectedMessageUris;
			if (!taskyBird.Util.Application=='SeaMonkey')
				gFolderDisplay.hintAboutToDeleteMessages();
		}
		else {
			messages = taskyBird.Util.pbGetSelectedMessageURIs();
		}
		return messages;  
  }
  

}