<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { CRepo } from '../../../models/Repo.ts';
	import Loading from '../../../assets/loading.gif';

	export let randomRepo: CRepo;
	const dispatcher = createEventDispatcher();

	let isLoading = true;
	$: isLoading = randomRepo?.Id === -1;

	$: creatorProfileUrl = `https://www.github.com/${randomRepo?.Creator}`;
	$: repoUrl = `https://www.github.com/${randomRepo?.Creator}/${randomRepo?.RepoName}`;
	$: readMeUrl = `https://www.github.com/${randomRepo?.Creator}/${randomRepo?.RepoName}/blob/master/README.md`;

	let isRepoInFavorite: boolean = false;
	let isMounted: boolean = false;

	onMount(() => {
		isMounted = true;
	});

	/**
	 * Check if the current repo is in the favorites
	 * @returns true if the current repo is in the favorites, false otherwise
	 */
	$: {
		randomRepo;
		if (isMounted) {
			isRepoInFavorite = JSON.parse(localStorage.getItem('favorites') ?? '[]').some(
				(repo: CRepo) => repo.Id === randomRepo?.Id
			);
		} else {
			isRepoInFavorite = false;
		}
	}

	/**
	 * Add or remove the current repo to the favorites
	 */
	function addToFavorite() {
		let currentFav = JSON.parse(localStorage.getItem('favorites') ?? '[]') as CRepo[];

		if (currentFav.some((repo) => repo.Id === randomRepo?.Id)) {
			// Remove the repo from the favorites
			currentFav = currentFav.filter((r) => r.Id !== randomRepo?.Id);
			localStorage.setItem('favorites', JSON.stringify(currentFav));
			isRepoInFavorite = false;
		} else {
			// Add the repo to the favorites
			localStorage.setItem('favorites', JSON.stringify([randomRepo, ...currentFav]));
			isRepoInFavorite = true;
		}

		dispatcher('favorite-updated');
	}

	$: topics = randomRepo?.Topics ? randomRepo.Topics.split(',') : [];
</script>

<div
	class={'-mt-16 md:mt-0 w-full h-72 md:max-h-fit max-h-[250px] rounded-xl border-[#423e3e] border relative duration-200 ' +
		(isLoading ? 'scale-95' : '')}
>
	<div
		class="w-full h-[35%] md:h-[25%] bg-[#2D3642] border-b border-[#423e3e] rounded-t-xl flex flex-col md:flex-row items-center px-5 overflow-x-auto gap-5 horizontal-scrollbar justify-center md:justify-start"
	>
		<div>
			<svg
				viewBox="0 0 16 16"
				version="1.1"
				class="h-6 mr-3 mt-1.5 md:visible hidden"
				fill="#7A807E"
				aria-hidden="true"
				><path
					d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"
				/></svg
			>

			<p class="text-[#8BBBFF] text-base md:text-xl underline-offset-2 min-w-fit md:min-w-0">
				<a class="hover:underline cursor-pointer" href={creatorProfileUrl} target="_blank"
					>{randomRepo?.Creator}</a
				>
				/
				<a class="font-bold hover:underline cursor-pointer text-left" href={repoUrl} target="_blank"
					>{randomRepo?.RepoName}</a
				>
			</p>
		</div>

		<div class="md:ml-auto flex flex-row items-start justify-start -mt-3 md:mt-0 gap-x-3">
			{#if randomRepo?.ProgrammingLanguage.trim() !== ''}
				<span
					class="max-w-[130px] h-8 md:h-12 bg-[#212831] px-4 rounded-xl shadow-sm shadow-black flex items-center justify-center"
				>
					<span
						class="text-[#b8b8b0] overflow-x-auto overflow-y-hidden whitespace-nowrap horizontal-scrollbar text-base md:text-xl"
						>{randomRepo?.ProgrammingLanguage}</span
					>
				</span>
			{/if}

			<span
				class={'md:w-32 bg-[#212831]  items-center px-3 h-8 md:h-12 rounded-xl shadow-sm shadow-black flex justify-center ' +
					(randomRepo?.ProgrammingLanguage.trim() === '' ? 'ml-auto' : '')}
			>
				<svg
					class="w-4 md:w-5 mt-0.5"
					viewBox="0 0 16 16"
					version="1.1"
					fill="#b8b8b0"
					aria-hidden="true"
					><path
						d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"
					/></svg
				>

				<span class="text-[#b8b8b0] text-base md:text-xl ml-1.5">{randomRepo?.Star}</span>
			</span>
		</div>
	</div>

	<div
		class="bg-[#21262C] h-[65%] md:h-[75%] rounded-b-xl flex flex-col overflow-y-auto scrollbar pb-3 relative"
	>
		<p class="text-[#a1a7ad] text-sm md:text-base p-3.5">{randomRepo?.Description}</p>

		<div class="flex flex-row gap-2 items-start justify-start flex-wrap px-3.5 pb-4 md:pb-0">
			{#each topics as topic}
				{#if topic.trim() !== ''}
					<button
						class="rounded-lg px-2 py-1 text-sm bg-[#121d2f] text-[#2f81f7] hover:bg-[#2057a3] hover:text-white cursor-pointer"
						on:click={() => {
							dispatcher('topic-clicked', topic);
						}}>{topic}</button
					>
				{/if}
			{/each}
		</div>

		<button
			class={'absolute  bottom-0 right-24 md:right-28 w-28 bg-[#161B22] px-3 md:py-1 text-sm md:text-base rounded-tl-xl border-t border-l border-[#423e3e] cursor-pointer  duration-150 ' +
				(isRepoInFavorite ? 'bg-[#245233] hover:bg-[#1b3b26]' : 'hover:bg-[#101216]')}
			on:click={addToFavorite}
		>
			<p class="text-center">{isRepoInFavorite ? 'Unfavorite' : 'Favorite'}</p>
		</button>
		<a
			class="absolute bottom-0 right-0 bg-[#161B22] px-3 md:py-1 text-sm md:text-base border-t border-l border-[#423e3e] cursor-pointer hover:bg-[#101216] duration-150"
			href={readMeUrl}
			target="_blank"
		>
			<p class="text-center">README.md</p>
		</a>
	</div>

	{#if isLoading}
		<div class="absolute inset-0 bg-black bg-opacity-60 rounded-xl">
			<div class="flex justify-center items-center h-full">
				<img src={Loading} alt="Loading wheel" class="w-16" />
			</div>
		</div>
	{/if}
</div>
