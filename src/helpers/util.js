import env from '../env/env';

export function toggleCoachMode() {
	let data = new URLSearchParams();
	data.append("action", "toggleGymContestsManagerEnabled");
	data.append("csrf_token",env.global.Codeforces.getCsrfToken());
	data.append("_tta", env.global.Codeforces.tta());

	return fetch("/gyms", {
		method: "POST",
		body: data,
	})
	.then(res => res.text())
	.then(html => {
		let doc = new DOMParser().parseFromString(html, "text/html");
		let btn = doc.querySelector(".toggleGymContestsManagerEnabled input[type=submit]");
		let status = btn && btn.value.startsWith("Disable") ? "enabled" : "disabled"; 
		
		env.global.Codeforces.reloadAndShowMessage(`Coach mode is now ${status}`);
	})
	.catch(err => console.error("Codeforces++ couldn't toggle coach mode: ", err));
}
