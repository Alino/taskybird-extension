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

taskyBird.Preferences = {
  Prefix: "extensions.taskybird.",
	service: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),

	get Debug() {
		return this.getBoolPref("debug");
	},

	isDebugOption: function(option) { // granular debugging
		if(!this.Debug) return false;
		try {return this.getBoolPref("debug." + option);}
		catch(e) {return false;}
	},
	
	getIntPref: function(p) {
		try {
      return this.service.getIntPref(this.Prefix + p);
    } catch(e) {
			var s="Err:" +e;
			taskyBird.Util.logToConsole("getIntPref(" + this.Prefix + p + ") failed:\n" + s);
			throw(e);
		}
	},

	setIntPref: function(p, v) {
		return this.service.setIntPref(this.Prefix + p, v);
	},
	
	getBoolPrefSilent: function(p) {
		try {
			return this.service.getBoolPrefNative(p);
		}
		catch(e) {
			return false;
		}
	},
	
	getBoolPrefNative: function(p) {
		try {
			return this.service.getBoolPref(p);
		} catch(e) {
			var s="Err:" +e;
			taskyBird.Util.logToConsole("getBoolPrefNative(" + p + ") failed:\n" + s);
			return false;
		}
	},

	getBoolPref: function(p) {
		return taskyBird.Preferences.getBoolPrefNative(this.Prefix + p);
	},

	setBoolPref: function(p, v) {
		return taskyBird.Preferences.setBoolPrefNative(this.Prefix + p, v);
	},

	setBoolPrefNative: function(p, v) {
		try {
			return this.service.setBoolPref(p, v);
		} catch(e) {
			var s="Err:" +e;
			return false;
		}
	} ,

	setCharPref: function(p, v) {
		return this.service.setCharPref(this.Prefix + p, v);
	} ,
	
	getCharPref: function(p) {
		return this.service.getCharPref(this.Prefix + p);
	} ,

	existsCharPref: function(pref) {
		try {
			if(this.service.prefHasUserValue(pref))
				return true;
			if (this.service.getCharPref(pref))
				return true;
		}
		catch (e) {return false; }
		return false;
	},

	existsBoolPref: function(pref) {
		try {
			if(this.service.prefHasUserValue(pref))
				return true;
			if (this.service.getBoolPrefNative(pref))
				return true;
		}
		catch (e) {return false; }
		return false;
	} ,
  
  addCustomHeaders: function(preferenceKey, delimiter) {
    let otherHeader = taskyBird.Preferences.service.getCharPref(preferenceKey);
    let headFields = otherHeader ? otherHeader.split(delimiter) : [];
    if (headFields.indexOf('x-tasky-status')<0)
      headFields.push ('x-tasky-status');
    if (headFields.indexOf('x-tasky-assignee')<0)
      headFields.push ('x-tasky-assignee');
    if (headFields.indexOf('x-tasky-assignedmail')<0)
      headFields.push ('x-tasky-assignedmail');
    if (headFields.indexOf('x-tasky-taskid')<0)
      headFields.push ('x-tasky-taskid');
    taskyBird.Preferences.service.setCharPref(preferenceKey, headFields.join(delimiter));
  } ,
  
}