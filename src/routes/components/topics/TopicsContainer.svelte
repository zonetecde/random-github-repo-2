<script lang="ts">
	import { onMount } from 'svelte';
	import type { CTopic } from '../../../models/Topic.js';

	let topics: CTopic[];
	let search = '';
	export let selectedTopics: CTopic[];

	/**
	 * Fetches the topics from the API
	 */
	async function getTopics() {
		const res = await fetch('/api/get-topics');
		const data = await res.json();
		return data as CTopic[];
	}

	/**
	 * Fetches the topics from the API on mount
	 */
	onMount(async () => {
		topics = await getTopics();
	});

	/**
	 * Adds or removes a topic from the selected topics list
	 * @param topic The topic to add or remove
	 */
	function updateSelectedTopics(topic: CTopic) {
		if (selectedTopics.includes(topic)) {
			selectedTopics = selectedTopics.filter((t) => t !== topic);
		} else {
			selectedTopics = [...selectedTopics, topic];
		}
	}
</script>

<div
	class={'w-full md:w-4/12 h-full md:px-5 flex flex-col md:mt-0 ' +
		(selectedTopics.length > 4 ? '' : '-mt-10')}
>
	<h2 class="text-xl md:text-3xl font-bold text-center">Topics</h2>

	<input
		type="text"
		class="w-full mt-4 mb-2 px-3 py-2 rounded-md bg-[#aaa7aa] text-black outline-none placeholder:text-slate-700"
		placeholder="Search topics"
		bind:value={search}
	/>

	<div class="overflow-y-scroll scrollbar">
		{#if !topics}
			<p>Loading topics...</p>
		{:else}
			{#each topics as topic}
				{#if topic.name.toLowerCase().includes(search.trim().toLowerCase()) || search.trim() === ''}
					<div
						class={'flex flex-row h-24 border-b border-gray-600 p-1 xl:py-3 md:mr-2 cursor-pointer duration-150 ' +
							(selectedTopics.includes(topic)
								? 'bg-[#22272b]'
								: 'hover:bg-black hover:bg-opacity-20')}
						on:click={() => updateSelectedTopics(topic)}
						on:keydown={(e) => {
							if (e.key === 'Enter') updateSelectedTopics(topic);
						}}
						role="button"
						tabindex="0"
					>
						{#if topic.imageUrl !== ''}
							<img
								src={topic.imageUrl}
								class="w-2/12 md:w-4/12 xl:w-3/12 tag-icon aspect-square object-contain"
								alt={topic.name}
							/>
						{:else}
							<div class="w-2/12 md:w-4/12 xl:w-3/12 flex justify-center">
								<div
									class="w-full max-w-[71px] xl:h-auto flex items-center justify-center bg-[#0e151f] text-[#787c81] rounded-xl border border-slate-950"
								>
									<p class="text-3xl text-center">#</p>
								</div>
							</div>
						{/if}
						<div class="flex flex-col pl-3 overflow-y-auto scrollbar w-10/12 md:w-8/12 xl:w-9/12">
							<h3 class="text-lg xl:text-xl">{topic.name}</h3>
							<p class=" text-sm text-gray-500">{topic.description}</p>
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
</div>
