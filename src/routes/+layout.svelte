<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import SocialIcons from '@rodneylab/svelte-social-icons';
	export let data;
  
	let innerWidth = 1024;
	let sidebarOpen = false;
  
	$: isDesktop = innerWidth >= 800;
  
	function toggleSidebar() {
	  sidebarOpen = !sidebarOpen;
	}
  
	onMount(() => {
	  innerWidth = window.innerWidth;
	  sidebarOpen = innerWidth >= 800;
	  const onResize = () => {
		innerWidth = window.innerWidth;
		if (innerWidth >= 800) {
		  sidebarOpen = true;
		}
	  };
	  window.addEventListener('resize', onResize);
	  return () => window.removeEventListener('resize', onResize);
	});
</script>

<!-- Overlay for mobile -->
{#if sidebarOpen && !isDesktop}
  <div class="fixed inset-0 bg-black opacity-50 z-30" on:click={toggleSidebar}></div>
{/if}
  
<div class="flex min-h-screen relative">
    <!-- Hamburger button as separate fixed element -->
    <div class="fixed top-4 z-50 transition-transform duration-300 ease-in-out"
         style="transform: translateX({sidebarOpen ? '21rem' : '1rem'})">
        <button 
            on:click={toggleSidebar} 
            aria-label="Toggle Sidebar" 
            class="bg-gray-800/70 p-2 rounded hover:bg-gray-700/70 transition-colors duration-200">
            <svg class="w-6 h-6 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
    </div>

	<aside class="fixed top-0 left-0 h-screen w-80 bg-gray-900 text-gray-100 transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto"
	  style="transform: translateX({sidebarOpen ? '0' : '-100%'})">
	  
	  <div class="p-4 pb-0 text-2xl font-bold">
		<a href="/">Dry Creations</a>
	  </div>
	  <div class="flex space-x-0 m-2">
		<a href="https://www.linkedin.com" target="_blank" class="social-icon">
			<SocialIcons alt="LinkedIn" network="linkedin" fgColor="#eeeeee" bgColor="oklch(0.21 0.034 264.665)" />
		</a>
		<a href="https://www.github.com" target="_blank" class="social-icon">
			<SocialIcons alt="GitHub" network="github" fgColor="#eeeeee" bgColor="oklch(0.21 0.034 264.665)" />
		</a>
		<a href="https://www.youtube.com" target="_blank" class="social-icon">
			<SocialIcons alt="YouTube" network="youtube" fgColor="#eeeeee" bgColor="oklch(0.21 0.034 264.665)" />
		</a>
		<a href="https://www.instagram.com" target="_blank" class="social-icon">
			<SocialIcons alt="Instagram" network="instagram" fgColor="#eeeeee" bgColor="oklch(0.21 0.034 264.665)" />
		</a>
	</div>
	  <div class="px-4 pt-0">
		{#each Object.keys(data.posts).sort((a, b) => b - a) as year}
		  <details class="mb-2" open>
			<summary class="font-bold">{year}</summary>
			{#each Object.keys(data.posts[year]).sort((a, b) => {
			  const order = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			  return order.indexOf(b) - order.indexOf(a);
			}) as month}
			  <details class="ml-4 mb-1" open>
				<summary class="italic text-sm">{month}</summary>
				<ul class="ml-4">
				  {#each data.posts[year][month] as post}
					<li class="text-xs">
					  <a class="hover:underline" href={post.url}>{post.title}</a>
					</li>
				  {/each}
				</ul>
			  </details>
			{/each}
		  </details>
		{/each}
	  </div>
	</aside>
  
	<main class="flex-1 w-full transition-all duration-300" style="margin-left: {isDesktop && sidebarOpen ? '20rem' : '0'}">
	  <article class="p-4 pb-0 mb-0 prose prose-sm sm:prose lg:prose-lg w-full max-w-[100vw] sm:max-w-none mx-auto mt-1">
		<slot />
	  </article>
	</main>
</div>