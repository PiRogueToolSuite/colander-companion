const { Constants, Settings } = require('./lib/colander-companion');


const option_setting = (name, value) => {

	let elem = document.querySelector(`input[name=${name}]`);
	if (!elem) throw new Error(`Unknonwn input name: ${name}`);
	
	// Set
	if (value !== undefined) {
		if (elem.type == 'checkbox') {
			elem.checked = value;
		}
		else {
			elem.value = `${value}`.trim();
		}
	}

	// Get (back)
	if (elem.type == 'checkbox') return elem.checked;
	return `${elem.value}`.trim();

};

function set_configuration_status(clazz, msg)
{
	document.querySelectorAll(`#configuration-test .result`).forEach((e) => {
		e.classList.remove('visible');
	});

	if (msg) {
		let msgElem = document.querySelector(`#configuration-test .${clazz} .message`);
		if (msgElem) {
			msgElem.textContent = msg;
		}
	}

	document.querySelector(`#configuration-test .${clazz}`).classList.add('visible');
}

const check_configuration = async () => {
	set_configuration_status('pending');
	let loaded_settings = await Settings.get();
	
	if (!loaded_settings[Constants.SETTINGS_COLANDER_SERVER_API_URL]) {
		throw new Error('Missing Colander Server API URL');
	}

	if (!loaded_settings[Constants.SETTINGS_COLANDER_USER_API_KEY]) {
		throw new Error('Missing API Key setting');
	}

	let token = loaded_settings[Constants.SETTINGS_COLANDER_USER_API_KEY];
	let headers = new Map([
		[Constants.HEADER_AUTHORIZATION, `${Constants.AUTHORIZATION_PREFIX_BEARER} ${token}`],
		[Constants.HEADER_ACCEPT, Constants.CONTENT_TYPE_JSON]
	]);
	let cases_response = await fetch(`${loaded_settings[Constants.SETTINGS_COLANDER_SERVER_API_URL]}/cases`, {
		method: "GET",
		headers: headers,
	});
	if (!cases_response.ok) {
		throw new Error('Please check your API URL and/or API KEY.');
	}
	let cases = await cases_response.json();

	set_configuration_status('success');
};

const save_settings = async () => {
	let new_settings = {};
	for (let s_k in Settings.defaults) {
		new_settings[s_k] = option_setting(s_k);
	}

	await Settings.save(new_settings);

	// Update status to let user know options were saved.
	const status = document.getElementById('status');
	status.textContent = '✔ Options saved';
	setTimeout(() => {
		status.textContent = '';
		check_configuration().catch((err) => {
			set_configuration_status('error', err);
		});
	}, 750);
};

const restore_settings = async () => {
	let loaded_settings = await Settings.get();
	
	for (let i_k in loaded_settings) {
		option_setting(i_k, loaded_settings[i_k]);
	}
};

document.addEventListener('DOMContentLoaded', restore_settings);
document.querySelector('input[name=colander-settings-save]').addEventListener('click', save_settings);