<script>
	export let title;
	export let date;
</script>

<main>
	<article class="prose max-w-3xl mx-auto p-4">
		<h1>{title}</h1>
		<p>{date}</p>
		<slot />
	</article>
</main>
