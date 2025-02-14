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
		const documentHeight = document.documentElement.scrollHeight;
		// Load sketch when scrolled halfway down the page
		if (scrollPosition >= documentHeight / 2) {
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
			const wrapper = document.getElementById('canvas-wrapper');
			const isMobile = window.innerWidth <= 640; // Standard mobile breakpoint

			if (wrapper && wrapper.getBoundingClientRect().height > 0) {
				containerHeight = isMobile 
					? wrapper.getBoundingClientRect().height 
					: Math.max(wrapper.getBoundingClientRect().height - 100, 0);
			} else {
				const mainEl = document.querySelector('main');
				containerHeight = mainEl 
					? (isMobile 
						? mainEl.getBoundingClientRect().height 
						: Math.max(mainEl.getBoundingClientRect().height - 100, 0))
					: document.documentElement.clientHeight;
			}
		}
	}
</script>

<main style="margin: 0; padding: 0;">
	<div class="relative z-10 w-full max-w-full sm:max-w-screen-xl mx-auto p-2 sm:p-8 md:p-12">
		{#if image}
			<div class="bg-cover h-[450px] text-center overflow-hidden absolute left-2 right-2 sm:left-8 md:left-12 lg:left-[3rem] sm:right-8 md:right-12 lg:right-[3rem] top-0" style="background-image: url('{image}')"></div>
		{:else}
			<div class="{color || randomColor} h-[450px] text-center overflow-hidden absolute left-2 right-2 sm:left-8 md:left-12 lg:left-[3rem] sm:right-8 md:right-12 lg:right-[3rem] top-0"></div>
		{/if}
		
		<!-- Header section -->
		<div class="relative w-full max-w-full sm:max-w-2xl mx-auto mt-24 z-10">
			<div class="rounded rounded-b-none flex flex-col justify-between leading-normal p-4 min-h-[350px]" style="background:rgba(255,255,255,.9)">
				<div class="relative">
					{#each tags as tag}
						<a href="#tag-{tag}" 
						   class="text-xs text-indigo-600 uppercase font-medium hover:text-gray-900 transition duration-500 ease-in-out">
							{tag}
						</a>{#if tag !== tags[tags.length - 1]}, {/if}
					{/each}
					<h1 class="text-gray-900 font-bold text-3xl mb-2">{title}</h1>
					<p class="text-gray-700 text-xs mt-2">Written By: <span class="text-indigo-600 font-medium">{author}</span></p>
					<p class="text-gray-700 text-xs">{date}</p>
				</div>
			</div>
		</div>

		<!-- Article content -->
		<div class="relative w-full max-w-full sm:max-w-2xl mx-auto z-10">
			<div class="rounded rounded-t-none flex flex-col justify-between leading-normal p-4" style="background:rgba(255,255,255,.9)">
				<article class="prose prose-sm sm:prose lg:prose-lg w-full max-w-[100vw] sm:max-w-none">
					<slot />
				</article>
			</div>
		</div>
	</div>
</main>

<!-- Adjust canvas wrapper and sketch container widths -->
<div id="canvas-wrapper" style="position: fixed; bottom: 0; left: 0; width: 100%; overflow: hidden;">
	<div id="sketch-container" 
	     style="height: {containerHeight}px; width: 100%; z-index: -1;">
		<!-- Canvas will be appended here by p5.js -->
	</div>
</div>
