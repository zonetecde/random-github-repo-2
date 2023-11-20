export default class Variables {
	static processAddingRepos = true;
	static apiKeyIndex = 0;
	static specialLoopIndex = 0;

	static pauseAddingRepos = () => {
		// Le site est en train d'être utilisé
		Variables.processAddingRepos = false;
		console.log('Le site est utilisé');

		setTimeout(() => {
			console.log("Le site n'est plus utilisé");
			Variables.processAddingRepos = true;
		}, 5); // 2 minutes
		//}, 2 * 60 * 1000); // 2 minutes
	};
}
