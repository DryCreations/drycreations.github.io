<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import SocialIcons from '@rodneylab/svelte-social-icons';
	export let data;
  
	let innerWidth = 1024;
	let sidebarOpen = true;
  
	$: isDesktop = innerWidth >= 800;
	$: toggleLeft = sidebarOpen ? '20.5rem' : '0.5rem';
  
	function toggleSidebar() {
	  sidebarOpen = !sidebarOpen;
	}
  
	onMount(() => {
	  innerWidth = window.innerWidth;
	  sidebarOpen = innerWidth >= 800;
	  const onResize = () => {
		innerWidth = window.innerWidth;
	  };
	  window.addEventListener('resize', onResize);
	  return () => window.removeEventListener('resize', onResize);
	});
</script>
  
<div class="flex flex-1 relative">
	<aside class="bg-gray-900 text-gray-100 transform transition-transform duration-300 z-20 w-80 h-screen overflow-y-auto"
	  class:fixed={true}
	  style="transform: { sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }">
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
  
	<main class="flex-1 relative">
	  <article class="p-4 prose max-w-3xl mx-auto" style="margin-top:4rem;">
		<slot />
	  </article>
	</main>
</div>
  
<div class="fixed top-4 z-50 transition-all duration-300" style="left: {toggleLeft}">
	<button on:click={toggleSidebar} aria-label="Toggle Sidebar" class="bg-gray-800/70 p-2 rounded">
	  <svg class="w-6 h-6 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
	  </svg>
	</button>
</div>