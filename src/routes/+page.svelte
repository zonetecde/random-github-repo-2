<script lang="ts">
	import TopicsContainer from './components/topics/TopicsContainer.svelte';

	import type { CTopic } from '../models/Topic.js';
	let selectedTopics: CTopic[] = [];
</script>

<div class="w-screen h-screen flex justify-center flex-col items-center">
	<h1 class="mb-6 text-3xl md:text-5xl xl:text-6xl font-bold">Random Github Repo</h1>

	<div
		class="w-full md:w-10/12 h-full md:h-[80vh] bg-[#161b22] border-2 border-black shadow-2xl shadow-black md:rounded-xl p-5 flex md:flex-row"
	>
		<TopicsContainer {selectedTopics} />
	</div>
</div>
