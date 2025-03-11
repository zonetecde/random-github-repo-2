<script lang="ts">
	import { onMount } from 'svelte';
	import Repo from '../repo/Repo.svelte';
	import type { CRepo } from '../../../models/Repo.ts';

	let bookmarkedRepos: CRepo[] = [];

	onMount(() => {
		updateBookmarkedRepo();
	});

	function updateBookmarkedRepo() {
		bookmarkedRepos = JSON.parse(localStorage.getItem('favorites') ?? '[]') as CRepo[];
	}
</script>

<h1 class="text-xl md:text-3xl font-bold">
	{bookmarkedRepos.length === 0
		? 'No bookmarked repository'
		: bookmarkedRepos.length +
		  (bookmarkedRepos.length === 1 ? ' bookmarked repository' : ' bookmarked repositories')}
</h1>

<div
	class="w-full h-full overflow-y-auto scrollbar grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-5 px-5 pt-20 md:pt-5"
>
	{#each bookmarkedRepos as repo}
		<Repo randomRepo={repo} on:favorite-updated={updateBookmarkedRepo} />
	{/each}
</div>
