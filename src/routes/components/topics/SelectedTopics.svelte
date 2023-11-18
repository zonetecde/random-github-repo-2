<script lang="ts">
	import type { CTopic } from '../../../models/Topic.js';

	export let selectedTopics: CTopic[] = [];
</script>

<div class="flex items-center justify-center flex-col">
	<h1 class="mb-6 text-xl md:text-3xl font-bold text-center max-w-screen-lg">
		{#if selectedTopics.length > 0}
			Selected topic{selectedTopics.length > 1 ? 's' : ''}:
			{#each selectedTopics as topic, i}
				<span>{topic.name}{i !== selectedTopics.length - 1 ? ', ' : ''} </span>
			{/each}
		{:else}
			No topic selected
		{/if}
	</h1>
</div>
