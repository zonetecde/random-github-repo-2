import fetch, { Headers } from 'node-fetch';
import ApiKeys from './apiKeys.js';

export async function fetchGithubApi(
	apiUrl: string,
	useSecondApiKey: boolean = false
): Promise<string | null> {
	const maxRetries = useSecondApiKey ? 300 : 3000;
	let currentRetry = 0;

	while (currentRetry < maxRetries) {
		try {
			const headers = new Headers();
			headers.append('Accept', 'application/vnd.github+json');
			headers.append(
				'Authorization',
				'Bearer ' + (useSecondApiKey ? ApiKeys.firstKey : ApiKeys.secondKey)
			);
			headers.append('X-GitHub-Api-Version', '2022-11-28');
			headers.append('User-Agent', 'zoneck-api');

			const response = await fetch(apiUrl, { headers });

			if (!response.ok) {
				return null;
			}

			return await response.text();
		} catch (error: any) {
			if (error.status === 404) {
				return '';
			} else if (error.status !== 429 && error.status !== 403) {
				return null!;
			}

			currentRetry++;
			if (currentRetry < maxRetries) {
				console.log(`Request failed. Retrying in 5 seconds... Retry ${currentRetry}/${maxRetries}`);
				await new Promise((resolve) => setTimeout(resolve, useSecondApiKey ? 200 : 5000));
			} else {
				console.log('Max retries reached. Request failed.');
				throw error;
			}
		}
	}

	return null!; // This line will never be reached if the request is successful
}
