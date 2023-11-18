<script lang="ts">
	import TopicsContainer from './components/topics/TopicsContainer.svelte';
	import SelectedTopics from './components/topics/SelectedTopics.svelte';
	import StarSelector from './components/stars/StarSelector.svelte';
	import RandomRepo from './components/repo/RandomRepo.svelte';

	import type { CTopic } from '../models/Topic.js';
	import type Repo from '../models/Repo.js';

	let selectedTopics: CTopic[] = [];
	let minimumStars: Number = 0;
	let maximumStars: Number = 1_000_000;

	let randomRepo: Repo | null = null;
</script>

<div class="w-screen h-screen flex justify-center flex-col items-center">
	<h1 class="mb-6 text-3xl md:text-5xl xl:text-6xl font-bold">Random Github Repo</h1>

	<div
		class="w-full md:w-10/12 h-full md:h-[80vh] bg-[#161b22] border-2 border-black shadow-2xl shadow-black md:rounded-xl p-5 flex md:flex-row"
	>
		<TopicsContainer bind:selectedTopics />

		<div class="flex flex-col w-full h-full items-center">
			<SelectedTopics bind:selectedTopics />
			<StarSelector bind:minimumStars bind:maximumStars />

			<RandomRepo {randomRepo} />
		</div>
	</div>
</div>
