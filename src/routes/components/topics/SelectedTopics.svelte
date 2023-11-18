<script lang="ts">
	import type { CTopic } from '../../../models/Topic.js';

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
							src="data:image/png;base64,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"
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
