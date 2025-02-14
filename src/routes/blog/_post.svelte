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
	import { page } from '$app/stores';

	let sketchLoaded = false;
	let sketchScript;
	let containerHeight;
	let browserHeight = typeof window !== 'undefined' ? window.innerHeight : 1024;
	let canvasContainer;

	const MAX_CANVAS_HEIGHT = 1080;

	// Consolidate resize handling into one listener.
	function updateHeights() {
		const contentEl = document.querySelector('.article-content');
		if (contentEl) {
			containerHeight = Math.min(contentEl.getBoundingClientRect().height, MAX_CANVAS_HEIGHT);
		}
	}
	// Throttle scroll handling
	let scrollTimeout;
	function handleScroll() {
		if (sketchLoaded) return;
		if (scrollTimeout) return;
		scrollTimeout = setTimeout(() => {
			const scrollPosition = window.scrollY + window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			if (scrollPosition >= documentHeight / 2) {
				loadSketch();
				sketchLoaded = true;
			}
			scrollTimeout = null;
		}, 50);
	}

	onMount(() => {
		updateHeights();
		window.addEventListener('scroll', handleScroll);
		const onResize = () => {
			browserHeight = window.innerHeight;
			updateHeights();
		};
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', onResize);
		};
	});

	beforeNavigate(() => {
		cleanupSketch();
	});

	onDestroy(() => {
		cleanupSketch();
	});

	function cleanupSketch() {
		if (typeof document !== 'undefined' && sketchScript) {
			sketchScript.remove();
			const container = document.getElementById("sketch-container");
			if (container) {
				container.innerHTML = "";
				document.querySelectorAll('.p5Canvas').forEach(canvas => canvas.remove());
			}
		}
	}

	function loadSketch() {
		if (typeof window === 'undefined') return;
		window.SKETCH_CONFIG = {
			isLowPerformance: window.innerWidth <= 640 && window.navigator.hardwareConcurrency <= 4,
			targetFrameRate: window.innerWidth <= 640 ? 24 : 30,
			container: canvasContainer
			};
		
		// Fetch and load the sketch script with page URL as seed
		const loadScript = (delay = 0) => {
			setTimeout(() => {
				const seedUrl = $page.url.pathname;
				fetch(`/api/random-sketch?seed=${encodeURIComponent(seedUrl)}`)
					.then(response => response.json())
					.then(data => {
						const script = document.createElement('script');
						script.textContent = data.sketch;
						document.body.appendChild(script);
						sketchScript = script;
					});
			}, delay);
		};
		loadScript(window.innerWidth <= 640 ? 1000 : 0);
	}
</script>

<main style="margin: 0; padding: 0; position: relative; overflow: hidden;">
    <!-- Canvas container expanded to cover full viewport width -->
    <div bind:this={canvasContainer}
         class="absolute bottom-0"
         style="left: 50%; transform: translateX(-50%); z-index: -1; width: 100vw; height: {Math.min(browserHeight, MAX_CANVAS_HEIGHT)}px; pointer-events: none; {sketchLoaded ? '' : 'display: none;'}">
    </div>

    <!-- Main content with higher z-index -->
    <div class="relative w-full max-w-full sm:max-w-screen-xl mx-auto p-2 sm:p-8 md:p-12">
        {#if image}
            <div class="bg-cover h-[450px] rounded text-center overflow-hidden absolute left-2 right-2 sm:left-8 md:left-12 lg:left-[3rem] sm:right-8 md:right-12 lg:right-[3rem] top-0" style="background-image: url('{image}')"></div>
        {:else}
            <div class="{color || randomColor} h-[450px] rounded text-center overflow-hidden absolute left-2 right-2 sm:left-8 md:left-12 lg:left-[3rem] sm:right-8 md:right-12 lg:right-[3rem] top-0"></div>
        {/if}
        
        <!-- Header section -->
        <div class="relative w-full max-w-full sm:max-w-2xl mx-auto mt-40 z-10">
            <div class="rounded rounded-b-none sm:rounded-t-none flex flex-col justify-between leading-normal p-4 min-h-[280px]" style="background:rgba(255,255,255,.9)">
                <div class="relative">
                    {#each tags as tag}
                        <a href="#tag-{tag}" 
                           class="inline-block rounded px-2 py-1 text-xs text-indigo-600 uppercase font-medium transition-colors duration-200 hover:bg-gray-800/10">
                            {tag}
                        </a>
                    {/each}
                    <h1 class="text-gray-900 font-bold text-3xl mb-2">{title}</h1>
                    <p class="text-gray-700 text-xs mt-2">Written By: <span class="text-indigo-600 font-medium">{author}</span></p>
                    <p class="text-gray-700 text-xs">{date}</p>
                </div>
            </div>
        </div>

        <!-- Article content - Add class for targeting -->
        <div class="article-content relative w-full max-w-full sm:max-w-2xl mx-auto z-10">
            <div class="rounded rounded-t-none flex flex-col justify-between leading-normal p-4" 
                 style="background: rgba(255,255,255,.9)">
                <article class="prose prose-sm sm:prose lg:prose-lg w-full max-w-[100vw] sm:max-w-none">
                    <slot />
                </article>
            </div>
        </div>
    </div>
</main>
