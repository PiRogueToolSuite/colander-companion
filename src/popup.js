const { Constants, craftAction, isAction, isActionMessage, getCases } = require('./lib/colander-companion');


function set_status(status, msg)
{
	document.querySelector('.actions button').style.display = (status == 'ready') ? 'initial' : 'none';
	document.querySelector('.actions .pending').style.display = (status == 'capture') ? 'initial' : 'none';
	document.querySelector('.actions .error').style.display = (status == 'error') ? 'initial' : 'none';
	document.querySelector('.actions .error .message').textContent = msg || '';
	document.querySelector('.actions .pending .message').textContent = msg || '';
}

async function capture_current_page() {
	set_status('capture', 'Capturing ...');

	let casesSelectElem = document.querySelector('select[name=capture-case-id]');

	browser.runtime.sendMessage(craftAction(Constants.ACTION_CAPTURE_ACTIVE_TAB, { case: casesSelectElem.value })).then(
		(msg) => {
			set_status('ready');
		}
	).catch(
		(err)=> {
			set_status('error', `Capture failed: ${err}`);
		}
	);
}

async function popup_setup() {
	set_status('capture', 'Fetching cases ...');
	
	try {
		let cases = await getCases();
		
		console.log('cases', cases);
		
		let casesSelectElem = document.querySelector('select[name=capture-case-id]');

		for(let c of cases) {
			let option = document.createElement('option');
			option.setAttribute('value', c.id);
			option.textContent = c.name;
			casesSelectElem.appendChild(option);
		}

		set_status('ready');
	} catch(err) {
		set_status('error', err);
	}
}

document.addEventListener('DOMContentLoaded', popup_setup);
document.querySelector('button[role=capture-current-tab]').addEventListener('click', capture_current_page);