import { FunctionAsset } from "./FunctionAsset.js";

export class SiteMaker {
	static home() {
		const body = document.createElement('div');
		body.innerHTML = `
            <div class="container text-center mt-5">
                <h1>Welcome to Home</h1>
                <p>This is the starting page of your pseudo-internet.</p>
            </div>
        `;
		return body;
	}

	static news() {
		const body = document.createElement('div');
		body.innerHTML = `
            <div class="container mt-4">
                <h1 class="mb-3">Breaking News</h1>
                <div class="alert alert-warning">Mysterious signals detected on local networks...</div>
                <p>Authorities are investigating a strange anomaly that has appeared in the city’s network system...</p>
            </div>
        `;
		return body;
	}

	static forum() {
		const body = document.createElement('div');
		body.innerHTML = `
            <div class="container mt-4">
                <h1>Underground Forum</h1>
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">User: Anonymous123</h5>
                        <p class="card-text">Has anyone found the hidden access code?</p>
                    </div>
                </div>
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">User: Hackerman</h5>
                        <p class="card-text">Try checking the source code of news.com...</p>
                    </div>
                </div>
            </div>
        `;
		return body;
	}

	static company() {
		const body = document.createElement('div');
		body.innerHTML = `
            <div class="container mt-4">
                <h1>SecureTech Inc.</h1>
                <p>Your trusted cybersecurity partner.</p>
                <form class="mt-3">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password">
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        `;
		return body;
	}

	static notFound() {
		const body = document.createElement('div');
		body.innerHTML = `
            <div class="container text-center mt-5">
                <h1 class="text-danger">404 - Page Not Found</h1>
                <p>Oops! The page you're looking for does not exist.</p>
                <small class="text-muted">...but maybe the error code holds a secret?</small>
            </div>
        `;
		return body;
	}

	static research(search, browser) {
		let results = [];

		// Récupérer les correspondances
		browser.URLs.forEach(website => {
			if (website.url.includes(search)) {
				results.push(website);
			}
		});

		// Afficher les resultats
		const body = document.createElement('div');
		body.className = "col-10 ms-4";
		results.forEach(resultat => {
			const container = document.createElement('div');
			container.className = "item-site-browser mb-5"
			body.appendChild(container);

			// Partie du haut
			const aside = document.createElement('div');
			aside.className = "mb-1";
			FunctionAsset.applyStyle(aside, {
				display: 'flex',
				flexDirection: 'row'
			});
			container.appendChild(aside);

			const logo = document.createElement('img');
			logo.src = 'assets/citeMetierLogo.png';
			logo.alt = 'logo';
			FunctionAsset.applyStyle(logo, {
				width: '8%',
				borderRadius: '9999px',
				transform: 'scale(0.65)'
			});
			aside.appendChild(logo);

			const containerText = document.createElement('div');
			FunctionAsset.applyStyle(containerText, {
				display: 'flex',
				flexDirection: 'column'
			});
			aside.appendChild(containerText);

			const text1 = document.createElement('span');
			FunctionAsset.applyStyle(text1, {
				fontSize: '18px'
			});
			text1.innerText = resultat.name;
			containerText.appendChild(text1);

			const text2 = document.createElement('span');
			text2.className = "text-muted";
			FunctionAsset.applyStyle(text2, {
				fontSize: '13px'
			});
			text2.innerText = resultat.url;
			containerText.appendChild(text2);


			// Partie du bas
			const content = document.createElement('div');
			content.className = "ps-1";
			container.appendChild(content);

			const btn_link = document.createElement('button');
			btn_link.type = "button";
			btn_link.className = "btn btn-link m-0 p-0";
			btn_link.innerText = `Site de ${resultat.name}`;
			content.appendChild(btn_link);
			btn_link.addEventListener('click', () => {
				browser.goTo(resultat.url);
			});

			const p_desc = document.createElement('p');
			p_desc.className = "text-muted";
			p_desc.innerText = "Une description du site ? Flemme, c'est un pseudo navigateur pour la cité des métiers.";
			content.appendChild(p_desc);
		});
		return body;
	}
}