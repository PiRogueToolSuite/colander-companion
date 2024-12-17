//var browser = require("webextension-polyfill");

const { Constants, Settings, craftAction, isAction, isActionMessage } = require('./lib/colander-companion');


async function storeSaveState(save_state) {
	let settings = await Settings.get();
	let token = settings[Constants.SETTINGS_COLANDER_USER_API_KEY];
	let headers = new Map([
		[Constants.HEADER_AUTHORIZATION, `${Constants.AUTHORIZATION_PREFIX_BEARER} ${token}`],
		[Constants.HEADER_ACCEPT, Constants.CONTENT_TYPE_JSON]
	]);
	let restApiUrl = `${settings[Constants.SETTINGS_COLANDER_SERVER_API_URL]}/drops/`;
	let fileFieldName = 'file'; //fileFieldName;
	let urlFieldName = 'source_url'; //urlFieldName;

	let controller = new AbortController();
	const blob = save_state.content instanceof Blob ?
		save_state.content : 
		new Blob([save_state.content], { type: Constants.CONTENT_TYPE_HTML });
	let formData = new FormData();
	if (fileFieldName) {
		formData.append(fileFieldName, blob, `${save_state.title}.html`);
	}
	if (urlFieldName) {
		formData.append(urlFieldName, save_state.url);
	}
	if (save_state.case) {
		formData.append('case', save_state.case);
	}
	
	const response = await fetch(restApiUrl, {
		method: "POST",
		body: formData,
		headers: headers,
		signal: controller.signal
	});
	if ([200, 201].includes(response.status)) {
		return response.json();
	} else {
		throw new Error(await response.text());
	}
}

browser.runtime.onInstalled.addListener((details) => {
	console.log('Colander Companion previousVersion', details.previousVersion)
});

browser.runtime.onMessage.addListener(async (req, sender, sendResponse) => {

	if (!isActionMessage(req)) return;

	if (isAction(req, Constants.ACTION_STORE_SAVE_STATE)) {
		let responseSave = await storeSaveState(req);
	}

	if (isAction(req, Constants.ACTION_CAPTURE_ACTIVE_TAB)) {
		let tabs = await browser.tabs.query({ active: true, currentWindow: true });
		// Send a message to the content script in the active tab
		let responseOfTab = await browser.tabs.sendMessage(tabs[0].id, craftAction(Constants.ACTION_PROCESS_CAPTURE, {case: req.case}));
	}

	return { response: "Background succed" };
});