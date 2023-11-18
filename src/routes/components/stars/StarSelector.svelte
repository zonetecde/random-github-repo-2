<script lang="ts">
	export let minimumStars: Number = 0;
	export let maximumStars: Number = 1000000;
</script>

<div class="flex flex-row gap-3">
	<p>
		Minimum star : <input
			type="number"
			class="ml-1 w-24 outline-none bg-[#1E2025] px-1 selection:bg-slate-600"
			min="0"
			max="1000000"
			bind:value={minimumStars}
		/>
	</p>
	<p>
		Maximum star : <input
			type="number"
			class="ml-1 w-24 outline-none bg-[#1E2025] px-1 selection:bg-slate-600"
			min="0"
			max="1000000"
			bind:value={maximumStars}
		/>
	</p>
</div>
