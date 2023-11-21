<script lang="ts">
	import TopicsContainer from './components/topics/TopicsContainer.svelte';
	import SelectedTopics from './components/topics/SelectedTopics.svelte';
	import StarSelector from './components/stars/StarSelector.svelte';
	import Repo from './components/repo/Repo.svelte';
	import NumberOfRepo from './components/repo/NumberOfRepo.svelte';
	import GithubLogo from '../assets/github-logo.png';

	import type { CTopic } from '../models/Topic.js';
	import type { CRepo } from '../models/Repo.js';
	import { onMount } from 'svelte';

	import BookmarkIcon from '../assets/favorite.png';
	import Close from '../assets/close.png';
	import BookmarkedRepos from './components/bookmark/BookmarkedRepos.svelte';

	let isMounted: boolean = false;
	let toggleShowBookmarkedRepos: boolean = false;

	let selectedTopics: CTopic[] = [];
	let minimumStars: Number = 0;
	let maximumStars: Number = 1_000_000;
	let numberOfRepo: number = -1;

	$: selectedTopics, filtersHadBeenUpdated();
	$: minimumStars, filtersHadBeenUpdated();
	$: maximumStars, filtersHadBeenUpdated();

	function filtersHadBeenUpdated() {
		// The condition prevent the function to be called on mount
		if (isMounted) {
			filterHadBeenChanged = true;
		}
	}

	let randomRepos: CRepo[] = [];
	let randomRepoIndex = -1;
	let randomRepo: CRepo = {
		Creator: '',
		RepoName: '',
		ProgrammingLanguage: '',
		Star: 0,
		Description: '',
		Topics: '',
		Category: '',
		ImageUrl: '',
		Id: -1
	};
	let filterHadBeenChanged = false;
	let isFetching: boolean = false;

	/**
	 * Fetches a random repo from the API
	 */
	function getRandomRepo() {
		if (isFetching) return;
		if (numberOfRepo === 0) return; // === et pas <= car -1 = loading

		// Permet de ne pas fetch si on est déjà en train de fetch (spam de bouton)
		// If first call or if we reached the end of the list or if the filter had been updated, fetch a new list of repos
		if (
			randomRepoIndex >= randomRepos.length - 1 ||
			randomRepoIndex === -1 ||
			filterHadBeenChanged ||
			randomRepo === null
		) {
			isFetching = true;
			if (randomRepo) randomRepo.Id = -1;
			fetch(
				'/api/get-random-repo?fromStar=' +
					minimumStars +
					'&toStar=' +
					maximumStars +
					'&topics=' +
					selectedTopics.map((t) => t.tag).join(',')
			)
				.then((res) => res.json())
				.then((data) => {
					randomRepos = data as CRepo[];
					randomRepos = randomRepos.filter((r) => r !== null); // Remove null values
				})
				.finally(() => {
					randomRepoIndex = 0;
					randomRepo = randomRepos[0];
					isFetching = false;
				});

			filterHadBeenChanged = false;
		} else {
			// Else, just increment the index and get the next repo
			randomRepoIndex++;
			randomRepo = randomRepos[randomRepoIndex];
		}
	}

	onMount(() => {
		// Charge un repo aléatoire au chargement de la page
		getRandomRepo();

		setTimeout(() => {
			isMounted = true;
		}, 1000);

		setTimeout(() => {
			// Bypass le bug de scroll en bas de page
			window.document.getElementById('scrolltop')!.scrollIntoView(true);
		}, 0);
	});
</script>

<div class="w-screen h-screen flex justify-center flex-col items-center overflow-y-auto">
	<h1 class="mt-5 md:mt-0 pb-7 -mb-3.5 md:mb-3 text-2xl md:text-5xl xl:text-6xl font-bold">
		Random Github Repo
	</h1>

	<a
		class="absolute top-1.5 right-1.5 w-12 md:w-16 opacity-50"
		target="_blank"
		href="https://www.github.com/zonetecde/random-github-repo-2"
	>
		<img src={GithubLogo} alt="Github Repo" />
	</a>

	<div
		class="w-full md:w-11/12 h-full md:h-[80vh] bg-[#161b22] border-2 border-black shadow-2xl shadow-black md:rounded-xl p-5 flex flex-col-reverse overflow-y-auto md:flex-row"
	>
		<TopicsContainer bind:selectedTopics />

		<div class="flex flex-col w-full h-full items-center gap-y-5 md:gap-y-2 relative">
			<div id="scrolltop" class="absolute -top-10" />
			<button
				class="right-0 absolute w-5 md:w-10"
				on:click={() => {
					toggleShowBookmarkedRepos = !toggleShowBookmarkedRepos;
				}}
			>
				<img alt="toggle bookmark" src={toggleShowBookmarkedRepos ? Close : BookmarkIcon} />
			</button>

			{#if !toggleShowBookmarkedRepos}
				<SelectedTopics bind:selectedTopics />
				<NumberOfRepo {selectedTopics} {minimumStars} {maximumStars} bind:numberOfRepo />
				<StarSelector bind:minimumStars bind:maximumStars />

				<div class="w-full md:w-11/12 xl:w-8/12 my-auto mt-16">
					<Repo
						{randomRepo}
						on:topic-clicked={(e) =>
							(selectedTopics = [
								...selectedTopics,
								{
									name: e.detail,
									tag: e.detail,
									imageUrl: '',
									description: '',
									id: -1,
									numberOfRepo: 0
								}
							])}
					/>
				</div>

				<button
					class="md:mb-auto mt-5 w-72 bg-[#AAC0E0] h-16 md:h-12 text-black text-xl font-bold border border-black shadow-xl shadow-black hover:scale-105 duration-150 hover:bg-[#bccde6]"
					on:click={getRandomRepo}>Inspire me !</button
				>

				<p class="text-slate-500 md:block hidden">
					Made by Rayane STASZEWSKI - <a
						href="https://www.github.com/zonetecde"
						class="hover:underline"
						target="_blank">GitHub</a
					>
					-
					<a href="https://www.buymeacoffee.com/zonetecde" class="hover:underline" target="_blank"
						>Buy me a coffee</a
					>
				</p>
			{:else}
				<BookmarkedRepos />
			{/if}
		</div>
	</div>
</div>
