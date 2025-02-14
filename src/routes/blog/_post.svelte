<script>
	export let title;
	export let date;
	export let author;
	export let tags = [];
	export let image = ''; // Optional image URL
	export let color = ''; // Optional color

	const darkColors = ['bg-gray-900'];
	const randomColor = darkColors[Math.floor(Math.random() * darkColors.length)];

	import { onMount, onDestroy } from 'svelte';
	import { beforeNavigate } from '$app/navigation'; // Updated import

	let sketchLoaded = false;
	let sketchScript;
	let contentHeight;
	let containerHeight;

	onMount(() => {
		updateHeights();
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', updateHeights);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', updateHeights);
		}
	});

	beforeNavigate(() => {
		cleanupSketch();
	});

	onDestroy(() => {
		cleanupSketch();
	});

	function cleanupSketch() {
		if (typeof document !== 'undefined') {
			if (sketchScript) {
				sketchScript.remove();
			}
			const container = document.getElementById("sketch-container");
			if (container) {
				container.innerHTML = "";
				const canvases = document.querySelectorAll('.p5Canvas');
				canvases.forEach(canvas => canvas.remove());
			}
		}
	}

	function handleScroll() {
		if (sketchLoaded) return;
		const scrollPosition = window.scrollY + window.innerHeight;
		const threshold = document.body.scrollHeight - 100; // Adjust the threshold as needed
		if (scrollPosition >= threshold) {
			loadSketch();
			sketchLoaded = true;
		}
	}

	function loadSketch() {
		console.log("LOADING SKETCH")
		fetch('/api/random-sketch')
			.then(response => response.text())
			.then(scriptContent => {
				const script = document.createElement('script');
				script.textContent = scriptContent;
				document.body.appendChild(script);
				sketchScript = script;
			});
	}

	function updateHeights() {
		if (typeof window !== 'undefined') {
			contentHeight = document.body.scrollHeight;
			containerHeight = Math.max(window.innerHeight, contentHeight);
		}
	}
</script>

<main>
	<div class="relative z-10 max-w-screen-xl mx-auto p-5 sm:p-8 md:p-12">
		{#if image}
			<div class="bg-cover h-64 text-center overflow-hidden absolute inset-0 w-full" style="height: 450px; background-image: url('{image}')"></div>
		{:else}
			<div class="{color || randomColor} h-64 text-center overflow-hidden absolute inset-0 w-full" style="height: 450px;"></div>
		{/if}
		<div class="relative max-w-2xl mx-auto mt-64 z-10">
			<div class="bg-white opacity-90 rounded flex flex-col justify-between leading-normal p-4">
				<div class="relative">
					{#each tags as tag}
						<a href="javascript:void(0);" class="text-xs text-indigo-600 uppercase font-medium hover:text-gray-900 transition duration-500 ease-in-out">{tag}</a>{#if tag !== tags[tags.length - 1]}, {/if}
					{/each}
					<h1 class="text-gray-900 font-bold text-3xl mb-2">{title}</h1>
					<p class="text-gray-700 text-xs mt-2">Written By: <span class="text-indigo-600 font-medium">{author}</span></p>
					<p class="text-gray-700 text-xs">{date}</p>
				</div>
				<article class="prose max-w-none mt-4">
					<slot />
				</article>
			</div>
		</div>
	</div>
</main>

<div id="sketch-container" 
     class="fixed bottom-0 left-0 w-screen" 
     style="height: {containerHeight}px; z-index: -1;">
	<!-- Canvas will be appended here by p5.js -->
</div>
