export {
	Constants,
	Settings,
	craftAction,
	getCases,
	isActionMessage,
	isAction
};

const Constants = {
	ACTION_KEY: 'colander.companion.action',
	ACTION_CAPTURE_ACTIVE_TAB: 'capture.active.tab',
	ACTION_PROCESS_CAPTURE: 'process.capture',
	ACTION_STORE_SAVE_STATE: 'store.savestate',

	AUTHORIZATION_PREFIX_BEARER: 'Token',
	CONTENT_TYPE_HTML: 'text/html',
	CONTENT_TYPE_JSON: 'application/json',
	HEADER_AUTHORIZATION: 'Authorization',
	HEADER_ACCEPT: 'Accept',

	SETTINGS_COLANDER_SERVER_API_URL: 'colander-server-api-url',
	SETTINGS_COLANDER_USER_API_KEY:   'colander-user-api-key',
};


const settings_defaults = new Map([
	[Constants.SETTINGS_COLANDER_SERVER_API_URL, ''],
	[Constants.SETTINGS_COLANDER_USER_API_KEY,   ''],
]);
const Settings = {
	defaults: Object.fromEntries(settings_defaults),
	get: settings_get,
	save: settings_save,
};

async function settings_save(new_settings) {
	let settings = {};
	for (let s_k in Settings.defaults) {
		settings[s_k] = new_settings[s_k];
	}

	//console.log('saving new settings', settings);

	return await browser.storage.sync.set(settings);
}

async function settings_get() {
	//console.log('restore settings')
	let loaded_settings = await browser.storage.sync.get(Settings.defaults);
	//console.log('restore_settings', loaded_settings);
	return loaded_settings;
}

async function getCases() {
	let settings = await settings_get();
	let token = settings[Constants.SETTINGS_COLANDER_USER_API_KEY];
	let headers = new Map([
		[Constants.HEADER_AUTHORIZATION, `${Constants.AUTHORIZATION_PREFIX_BEARER} ${token}`],
		[Constants.HEADER_ACCEPT, Constants.CONTENT_TYPE_JSON]
	]);
	let cases_response = await fetch(`${settings[Constants.SETTINGS_COLANDER_SERVER_API_URL]}/cases`, {
		method: "GET",
		headers: headers,
	});
	if (!cases_response.ok) {
		throw new Error('Unable to fetch cases. Please review your Colander Companion settings.');
	}
	let cases = await cases_response.json();
	return cases;
}

function isActionMessage(msg) {
	return msg && Constants.ACTION_KEY in msg;
}

function isAction(msg, actionStr) {
	return isActionMessage(msg) && msg[Constants.ACTION_KEY] == actionStr;
}

function craftAction(action, extra) {
	let msg = {};
	msg[Constants.ACTION_KEY] = action;
	msg = Object.assign(msg, extra || {});
	return msg;
}