<script lang="ts">
	import type { CTopic } from '../../../models/Topic.ts';
	import DeleteIcon from '../../../assets/close.png';

	export let selectedTopics: CTopic[] = [];

	function removeTopic(topic: CTopic) {
		selectedTopics = selectedTopics.filter((t) => t !== topic);
	}
</script>

<div class="flex items-center justify-center flex-col">
	<h1 class="mb-6 text-xl md:text-3xl font-bold text-center max-w-screen-lg">
		<div class="flex w-full">
			{#if selectedTopics.length > 0}
				Selected topic{selectedTopics.length > 1 ? 's' : ''}:
				{#each selectedTopics as topic, i}
					<button
						class="relative hover-image cursor-pointer flex flex-row ml-2.5"
						on:click={() => removeTopic(topic)}
						>{topic.name}<img
							class="w-3.5 inline-block self-start"
							alt="delete"
							src={DeleteIcon}
						/>{i !== selectedTopics.length - 1 ? ', ' : ''}
					</button>
				{/each}
			{:else}
				No topic selected
			{/if}
		</div>
	</h1>
</div>

<style>
	.hover-image img {
		display: none;
	}
	.hover-image:hover img {
		display: inline;
	}
</style>
