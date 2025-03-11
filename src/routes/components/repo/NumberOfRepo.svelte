<script lang="ts">
	import { onMount } from 'svelte';
	import type { CTopic } from '../../../models/Topic.ts';
	import Loading from '../../../assets/loading.gif';

	export let selectedTopics: CTopic[] = [];
	export let minimumStars: Number = 0;
	export let maximumStars: Number = 1000000;
	export let numberOfRepo: number = 0;

	let isMounted = false;

	$: selectedTopics, updateNumberOfRepo();
	$: minimumStars, updateNumberOfRepo();
	$: maximumStars, updateNumberOfRepo();

	let delay: NodeJS.Timeout;

	/**
	 * Fetches the number of repo accoding to the selected filters from the API
	 */
	async function updateNumberOfRepo() {
		// Timeout permettant d'attendre que l'utilisateur ait fini de taper
		clearTimeout(delay);

		delay = setTimeout(async () => {
			if (isMounted) {
				numberOfRepo = -1;
				const res = await fetch(
					`/api/get-number-of-repo?topics=${selectedTopics
						.map((t) => t.tag)
						.join(',')}&fromStar=${minimumStars}&toStar=${maximumStars}`
				);
				const data = await res.text();
				numberOfRepo = parseInt(data);
			}
		}, 500);
	}

	function numberWithSpaces(x: Number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}

	onMount(async () => {
		await updateNumberOfRepo();

		setTimeout(() => {
			isMounted = true;
		}, 0);
	});
</script>

<p class="text-base md:text-lg md:mb-0 mb-5 text-center font-bold">
	Number of repositories :

	{#if numberOfRepo !== -1}
		<span class={numberOfRepo > 0 ? 'text-green-500' : 'text-red-600'}
			>{numberWithSpaces(numberOfRepo)}</span
		>
	{:else}
		<img src={Loading} alt="loading" class="w-4 h-4 inline-block" />
	{/if}
</p>
