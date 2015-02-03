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

taskyBird.Interface = {

  getStatusLabel: function(status) {
    if (status=='' || (!status && status!='0'))
      return 'none';
    switch(parseInt(status.toString(),10)) {
      case 1: return 'assigned unread';
      case 2: return 'assigned read';
      case 3: return 'waiting';
      case 4: return 'in progress';
      case 5: return 'complete';
      case 6: return 'junk';
      case -1: 
      default: 
        return 'none';
    }
  }  ,
  
  getStatusIcon: function(status) {
    let icon = '';
    switch(parseInt(status.toString(),10)) {
      case 1: 
        icon = 'fugue-unread.png';
        break;
      case 2: 
        icon = 'fugue-read.png';
        break;
      case 3: 
        icon = 'fugue-waiting.png';
        break;
      case 4: 
        icon = 'fugue-progress.png';
        break;
      case 5: 
        icon = 'fugue-complete.png';
        break;
      case 6:
        icon = 'fugue-junk.png';
        break;
      default: return null;
    }
    return 'chrome://taskybird/skin/status/' + icon;
  } ,
  
  showStatusPopup: function(element,evt) {
		taskyBird.Util.logDebugOptional("interface", "showStatusPopup(" + element.id + ")" );
    let popup = element;
    // determine the message id from evt target:
    /*
    let target = evt.originalTarget; // is this the thread / message?
    if (target)
      popup.targetMsg = target;
    */
    for each (let m in popup.childNodes) {
      if (m.tagName == 'menuitem' && !(m.label)) {
        if (m.id.indexOf('context-taskybird-setstatus')==0) {
          m.label = taskyBird.Interface.getStatusLabel(m.value);
        }
        if (m.id == 'context-taskybird-status-none') {
          m.label = taskyBird.Interface.getStatusLabel(-1);
        }
      }
    }
    
		let newUF = (typeof Set !== 'undefined');
		let msgUrls = {};
		let count = 0;
    
    let messages = taskyBird.Util.selectedMessages();
		for (let i in messages) {
			try {
        // messages[i] has the message URI
        let service = messenger.messageServiceFromURI(messages[i]);
        let hdr = service.messageURIToMsgHdr(messages[i]);
        let subject = hdr.mime2DecodedSubject;
        taskyBird.Util.logDebugOptional("interface", "prepare status popup for: " + subject);
        if (!count) {
          popup.targetURI = messages[i]; // only store 1st one?
          popup.targetSubject = subject;
          // add a check to the correct radiobutton:
          let status = hdr.getStringProperty("x-tasky-status").toString();
          let itemId;
          if (status && status.toString()!='0') {
            itemId = 'context-taskybird-setstatus-' + status;
          }
          else {
            if (!status || status.indexOf(' ')==0)
              itemId = 'context-taskybird-status-none';
          }
          let item = document.getElementById(itemId);
          if (item) {
            item.setAttribute ('checked',true);
            taskyBird.Util.logDebugOptional("interface","Status= "+ status+ "\nStatus menu item checked: " + itemId);
          }
          else
            taskyBird.Util.logDebugOptional("interface","Status= "+ status+ "\nStatus menu item not found: " + itemId);
        }
				// evt.dataTransfer.mozSetDataAt("text/x-moz-url",msgUrls.value.spec, i);
				count++;
			}
			catch(ex)
			{
				taskyBird.Util.logException("showStatusPopup: error during processing message[" + i + "]", ex)
			}
		}    
  } ,
  
  setStatusFromPopup: function(element, evt, status) {
    // determine the message (id)
    // from parent element #context-taskybird-statuspopup
    try {
      console.log(element);
      console.log(evt);
      console.log(status);

      let uri = element.parentNode.targetURI ;
      console.log(uri);
      let service = messenger.messageServiceFromURI(uri);
      console.log(service);
      let hdr = service.messageURIToMsgHdr(uri);
      console.log(hdr);
      
      taskyBird.setMsgStatus(hdr, status);
    }
    catch(ex)
    {
      taskyBird.Util.logException("setStatusFromPopup failed", ex)
    }
  } ,

  setAsigneeFromPopup: function(element, evt, asignee) {
    try {
      // console.log(element);
      // console.log(evt);
      // console.log(asignee);

      let uri;
      let service;
      let hdr;
      uri = element.parentNode.targetURI;
      if (!uri) uri = taskyBird.Util.selectedMessages();
      for (let i=0; i<uri.length; i++) {
        service = messenger.messageServiceFromURI(uri[i]);
        hdr = service.messageURIToMsgHdr(uri[i]);
        taskyBird.setMsgAsignee(hdr, asignee);
      }
    }
    catch(ex)
    {
      console.log(ex);
      taskyBird.Util.logException("setStatusFromPopup failed", ex);
    }
  } ,
  
	showPopup: function(element, popupId, evt) {
    alert('jebat');
		taskyBird.Util.logDebugOptional("interface", "showPopup(" + element.id + ", " + popupId + ", evt=" + evt +")" );
		let popup = element.ownerDocument.getElementById(popupId);
		if (popup) {
			document.popupNode = element;
      if (evt) {
        if (popupId=='context-taskybird-statuspopup') {
          // determine the message id from evt target:
          let target = evt.originalTarget; // is this the thread / message?
          if (target)
            popup.targetMsg = target;
          for each (let m in popup.childNodes) {
            if (m.tagName == 'menuitem' && !m.label) {
              if (m.id.indexOf('context-taskybird-setstatus')==0) {
                m.label = taskyBird.Interface.getStatusLabel(m.value);
              }
              if (m.id == 'context-taskybird-status-none') {
                m.label = taskyBird.Interface.getStatusLabel(-1);
              }
            }
          }
        }
      }
			
			taskyBird.Util.logDebugOptional("interface", "Open popup menu: " + popup.tagName + "\nid: " + popup.id + "\nlabel: " + popup.label);
			// make it easy to find calling element / label / target element
			popup.targetNode = element; 
			
			if (popup.openPopup)
				popup.openPopup(element,'after_start', 0, -1,true,false,evt);
			else
				popup.showPopup(element, 0, -1,"context","bottomleft","topleft"); // deprecated method
		}
	}   
};

