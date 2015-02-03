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

taskyBird.Options = {
  load: function() {
    taskyBird.Util.logDebug("taskyBird.Options.load()");
    this.updateVersionLabel();
    setTimeout( function() { taskyBird.Options.updateVersionLabel();}, 1500);
		
    taskyBird.Util.logDebug("taskyBird.Options.load() Ended");
		// no donation loophoole
    /*
		let donateButton = document.documentElement.getButton('extra2');
		if (donateButton) {
			donateButton.addEventListener("click", 
				function(evt) { 
					taskyBird.Util.logDebugOptional("default", "donateButton event:\n" + evt.toString());
					if(evt.button == 2) {
						taskyBird.Util.toggleDonations();
						evt.preventDefault();
						evt.stopPropagation();
					}; }, false);
		}	
    */
  } ,
  
  updateVersionLabel: function updateVersionLabel() {
    let version = taskyBird.Util.Version;
    if (version=="") version='version?';
    let versionLabel = window.document.getElementById("taskyBird-options-version");
    versionLabel.setAttribute("value", version);
  },
  
  authenticate: function authenticate() {
    let user = document.getElementById('txtUserName').value;
    let password = document.getElementById('txtPassword').value;
    let win = window.opener; // get main window (3pane)
    win.taskyBird.Api.authenticate(win, user, password);
  },
  
  send: function send() {
    alert ("Send AJAX code goes here...");
  },
  
  toggleBoolPreference: function(cb, noUpdate) {
    let prefString = cb.getAttribute("preference");
    let pref = document.getElementById(prefString);
    
    if (pref)
      taskyBird.Preferences.setBoolPrefNative(pref.getAttribute('name'), cb.checked);
    if (noUpdate)
      return true;
    return false;
  },
  
  showAboutConfig: function(clickedElement, filter, readOnly) {
    const name = "Preferences:ConfigManager";
    const uri = "chrome://global/content/config.xul";

    let mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    let w = mediator.getMostRecentWindow(name);

    let win = clickedElement ?
		          (clickedElement.ownerDocument.defaultView ? clickedElement.ownerDocument.defaultView : window)
							: window;
    if (!w) {
      let watcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
      w = watcher.openWindow(win, uri, name, "dependent,chrome,resizable,centerscreen,alwaysRaised,width=500px,height=350px", null);
    }
    w.focus();
    w.addEventListener('load', 
      function () {
        let flt = w.document.getElementById("textbox");
        if (flt) {
          flt.value=filter;
          // make filter box readonly to prevent damage!
          if (!readOnly)
            flt.focus();
          else
            flt.setAttribute('readonly',true);
          if (w.self.FilterPrefs) {
            w.self.FilterPrefs();
          }
        }
      });
  }
}
