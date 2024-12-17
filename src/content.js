const { Constants, Settings, craftAction, isAction, isActionMessage } = require('./lib/colander-companion');

let shadowPart;
let colanderCompanionDomRoot;
let colanderCompanionOverlay;
let popupElement;

function popup()
{
	if (!colanderCompanionDomRoot) {
		colanderCompanionDomRoot = document.createElement('div');
		shadowPart = colanderCompanionDomRoot.attachShadow({ mode: "closed" });
		document.body.append(colanderCompanionDomRoot);

	}

	if (!colanderCompanionOverlay) {
		colanderCompanionOverlay = document.createElement('div');
		colanderCompanionOverlay.style.position = 'fixed';
		colanderCompanionOverlay.style.top = '0';
		colanderCompanionOverlay.style.left = '0';
		colanderCompanionOverlay.style.width = '100%';
		colanderCompanionOverlay.style.height = '100%';
		colanderCompanionOverlay.style.zIndex = '50000';
		colanderCompanionOverlay.style.backdropFilter = 'blur(4px)';
		colanderCompanionOverlay.style.backgroundColor = 'rgba(255,255,255,0.5)';
		shadowPart.append(colanderCompanionOverlay);
	}

	//console.log('0. popupElement', popupElement);
	if (!popupElement) {
		popupElement = document.createElement('div');
		popupElement.className = 'colander-companion-popup';
		popupElement.style.position = 'absolute';
		popupElement.style.top = '50%';
		popupElement.style.left = '50%';
		popupElement.style.transform = 'translate(-50%, -50%)';

		let image = browser.runtime.getURL("images/pts_logo_128.png");
		console.log('image url', image);

		let imgElement = document.createElement('img');
		imgElement.src = image; //'moz-extension://531906d3-e22f-4a6c-a102-8057b88a1a42/images/pts_logo_128.png';
		popupElement.appendChild(imgElement);

		let textElement = document.createElement('h2');
		textElement.textContent = 'Captured !';
		popupElement.appendChild(textElement);

		colanderCompanionOverlay.appendChild(popupElement);
	}
	//console.log('1. popupElement', popupElement);
	setTimeout(() => {
		colanderCompanionDomRoot.remove();
		delete shadowPart;
		delete colanderCompanionDomRoot;
		delete colanderCompanionOverlay;
		delete popupElement;
	}, 2000);
}

async function capture_page()
{
	//console.log('capturing', extension.getPageData);
	const { content, title, filename } = await extension.getPageData({
		removeHiddenElements: true,
		removeUnusedStyles: true,
		removeUnusedFonts: true,
		removeImports: true,
		blockScripts: true,
		blockAudios: true,
		blockVideos: true,
		compressHTML: true,
		removeAlternativeFonts: true,
		removeAlternativeMedias: true,
		removeAlternativeImages: true,
		groupDuplicateImages: true
	});
	//const { content, title, filename } = await getPageData({});
	//console.log('captured');
	//console.log(`title:${title} filename:${filename}`);
	//console.log(content);

	return { content: content, title: title, filename: filename, url: location.href };
}

async function send_in_background( saveState )
{

	popup();

	let saveStateResponse = await browser.runtime.sendMessage(craftAction(Constants.ACTION_STORE_SAVE_STATE, saveState));
}

browser.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
	
	if (!isActionMessage(req)) return;

	if (isAction(req, Constants.ACTION_PROCESS_CAPTURE)) {
		let saveState = await capture_page()
		saveState.case = req.case;
		await send_in_background(saveState);
	}
	return 'yup';
});


function page_setup()
{
	//popup();
}


document.addEventListener('DOMContentLoaded', page_setup);