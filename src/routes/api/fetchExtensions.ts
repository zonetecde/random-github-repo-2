import fetch, { Headers } from 'node-fetch';
import ApiKeys from './apiKeys.js';
import Variables from './globalVariables.js';

export async function fetchGithubApi(
	apiUrl: string,
	currentRetry: number = 1
): Promise<string | null> {
	const maxRetries = 5;

	while (currentRetry <= maxRetries) {
		const headers = new Headers();
		headers.append('Accept', 'application/vnd.github+json');
		headers.append('Authorization', 'Bearer ' + ApiKeys.apiKeys[Variables.apiKeyIndex]);

		Variables.apiKeyIndex = (Variables.apiKeyIndex + 1) % ApiKeys.apiKeys.length;

		headers.append('X-GitHub-Api-Version', '2022-11-28');
		headers.append('User-Agent', 'zoneck-api');

		const response = await fetch(apiUrl, { headers });

		if (!response.ok) {
			if (Variables.processAddingRepos === false) return null;

			// Try again in 5 second
			currentRetry += 1;
			console.log('Request failed. Retrying in 5 seconds...');
			await new Promise((resolve) => setTimeout(resolve, 5000));
			return fetchGithubApi(apiUrl, currentRetry + 1);
		} else return await response.text();
	}

	return null!;
}
