async function fetch_versions()
{
	console.log('Fecthing versions ...');
	let updatesResponse = await fetch('./updates.json');
	if (!updatesResponse.ok) {
		throw new Error("Can't fetch updates.json");
	}
	let updates = await updatesResponse.json();
	let versions = updates.addons["{423633ff-8bea-435f-bafd-dcbf0f6b1625}"]?.updates;
	if (!versions) {
		throw new Error("No suitable version found");
	}
	versions.reverse();
	let versionsContainer = document.getElementById('versions');
	let olderVersionsContainer = document.getElementById('previous-version');

	let firstTaggedAsLatest = false;
	for(let ver of versions) {
		let versionElem = document.createElement('a');
		versionElem.classList.add('block');
		versionElem.setAttribute('href', ver.update_link);
		versionElem.setAttribute('title', "Download and install Colander Companion v${ver.version}");
		versionElem.setAttribute('target', '_blank');
		versionElem.textContent = `Colander Companion v${ver.version}`;

		if (firstTaggedAsLatest) {
			olderVersionsContainer.appendChild( versionElem );
		}
		else {
			versionElem.classList.add('latest');
			versionsContainer.appendChild( versionElem );
			firstTaggedAsLatest = true;
		}
	}
}
async function older_versions_toggler()
{
	let olderVersionsElem = document.querySelector('#previous-version');
	let legendElem = document.querySelector('#previous-version legend');
	legendElem.addEventListener('click', () => {
		olderVersionsElem.classList.toggle('toggled');
	});
}


document.addEventListener('DOMContentLoaded', fetch_versions);
document.addEventListener('DOMContentLoaded', older_versions_toggler);