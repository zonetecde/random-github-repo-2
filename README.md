# Random Github Repository Generator 

Source code of the [Random Github Repo](https://www.randomgithubrepo.site) website
A website that give you random GitHub repository to get inspired

<img src="https://rayanestaszewski.fr/assets/rgr.png"/>

### Set up:

- Clone the repo
- Add an `ApiKeys.ts` file to the `/src/api/` folder containing your tokens to use GitHub's API, like this :
```ts
export default class ApiKeys {
	static apiKeys: string[] = [
		'ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		'ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		'ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // add as much tokens as you want
	];
}
```

Tokens can be generated by visiting the following link: https://github.com/settings/tokens. To create a new token, navigate to "Generate new token (classic)," choose an expiration period, and exclusively select the public_repo permission before generating the token.

You can use this database, which already contains more than a million GitHub repositories: [Download here](https://mega.nz/file/qawDQTgZ#85zEcD86AQ5MUKDPNJGT2kVQ4evmKymGXqaFRd3wgnU).

---

[![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

[![wakatime](https://wakatime.com/badge/user/b8ecff52-7743-4a1e-8b28-93fcce7c9b7d/project/018bcf08-82f6-4b73-97f5-b730e3ffbdef.svg)](https://wakatime.com/badge/user/b8ecff52-7743-4a1e-8b28-93fcce7c9b7d/project/018bcf08-82f6-4b73-97f5-b730e3ffbdef)
