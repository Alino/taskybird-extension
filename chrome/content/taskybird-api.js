"use strict";

//AJAX REST API FUNCTIONS
//------------------------

taskyBird.Api = {

  authenticate: function authenticate(win, user, password) {
    let auth = win.taskyBird.Auth; 
    if (!auth.token) // if not authenticated
      if (!auth.init(user, password)) { // if unable to authenticate
        alert ('could not authenticate \n' + auth.lastError);
        return false;
      }

    return true;
  },

	/**
	* Emails API
	*/
	//GET
  getEmails: function() {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("GET", taskyBird.Preferences.getCharPref("server.url") + "/email", false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send();
  ﻿  return xmlhttp.responseText;
	},

  getEmailsNewerThanTimestamp: function(last_sync) {
    var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("GET", taskyBird.Preferences.getCharPref("server.url") + "/email/getEmailsNewerThanTimestamp/" + last_sync, false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send();
  ﻿  return xmlhttp.responseText;
  },
 

 //GET single id
  getEmail: function(id) {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("GET", taskyBird.Preferences.getCharPref("server.url")+"/email/"+id, false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(id));
  ﻿  return xmlhttp.responseText;
	},

//POST
	/**
	* paramater data should contain the properties:
	* _id // messageId from email header
	* responsible_user_id
	* status
	* assigned_by
	*/
	createEmail: function(data) {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("POST", taskyBird.Preferences.getCharPref("server.url")+"/email", false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(data));
  ﻿  return xmlhttp.responseText;
	},


	//PUT
	/**
	* paramater data can contain any of these properties, single or combined:
	* _id // required
	* responsible_user_id // optional
	* status // optional
	* assigned_by // optional
	*/
	updateEmail: function(data) {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("PUT", taskyBird.Preferences.getCharPref("server.url")+"/email/"+data._id, false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(data));
  ﻿  return xmlhttp.responseText;
	},
	

	//DELETE single id
  deleteEmail: function(id) {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("DELETE", taskyBird.Preferences.getCharPref("server.url")+"/email/"+id, false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(id));
  ﻿  return xmlhttp.responseText;
	},


	/**
	* Users API
	*/
	//GET
  getUsers: function() {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("GET", taskyBird.Preferences.getCharPref("server.url") + "/user", false);﻿
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send();
  ﻿  return xmlhttp.responseText;
	},

	//GET single id
  getUser: function(id) {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("GET", taskyBird.Preferences.getCharPref("server.url")+"/user/" + id, false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(id));
  ﻿  return xmlhttp.responseText;
	},

  //POST
  createUser: function(data) {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("POST", taskyBird.Preferences.getCharPref("server.url")+"/user", false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(data));
  ﻿  return xmlhttp.responseText;
  },

  //PUT
  updateUser: function(data) {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("PUT", taskyBird.Preferences.getCharPref("server.url") + "/user/"+data._id, false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(data));
  ﻿  return xmlhttp.responseText;
  },

  //DELETE single id
  deleteUser: function(id) {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("DELETE", taskyBird.Preferences.getCharPref("server.url") + "/user/"+id, false);﻿  
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send(JSON.stringify(id));
  ﻿  return xmlhttp.responseText;
  },

  /**
  * Teams API
  */
  //GET
  getTeams: function() {
  ﻿  var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("GET", taskyBird.Preferences.getCharPref("server.url") + "/team", false);﻿
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send();
  ﻿  return xmlhttp.responseText;
  },

  /**
  * Other stuff in JSON format
  */
  // "What time is it? It's vagina."
  getTime: function() {
    var xmlhttp;
  ﻿  xmlhttp = new XMLHttpRequest();
  ﻿  xmlhttp.open("GET", taskyBird.Preferences.getCharPref("server.url") + "/time", false);﻿
  ﻿  xmlhttp.setRequestHeader("Authorization", "Bearer " + taskyBird.Auth.token);
    xmlhttp.setRequestHeader("Content-type", "application/json");
  ﻿  xmlhttp.send();
  ﻿  return xmlhttp.responseText;
  }
}
