// Default preference values. These are accessible via the preferences system
// or via the optional chrome/content/options.xul preferences dialog.

// These are here as an example only. Please remove them or rename them to
// something useful.
pref("extensions.taskybird.intpref", 0);
pref("extensions.taskybird.stringpref", "A string");
pref("extensions.taskybird.account.user", "");
pref("extensions.taskybird.account.password", "");
pref("extensions.taskybird.account.installationId", "");
pref("extensions.taskybird.installedVersion", "0");
pref("extensions.taskybird.firstRun", true);
pref("extensions.taskybird.lastSync", "0000-00-00 00:00:00");
pref("extensions.taskybird.server.url", "http://taskybird.com");

// https://developer.mozilla.org/en/Localizing_extension_descriptions
pref("extensions.taskybird@dopice.sk.description", "chrome://taskybird/locale/overlay.properties");

// Debug settings
pref("extensions.taskybird.debug", false);
pref("extensions.taskybird.debug.interface", false);
pref("extensions.taskybird.debug.sync", true);
pref("extensions.taskybird.debug.ajax", true);
