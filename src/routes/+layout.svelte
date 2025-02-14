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

	// New local state for collapsible sections
	let yearOpen = {};
	let monthOpen = {};
	$: {
	  Object.keys(data.posts).forEach(year => {
	    if (yearOpen[year] === undefined) yearOpen[year] = true;
	    Object.keys(data.posts[year]).forEach(month => {
	      if (!monthOpen[year]) monthOpen[year] = {};
	      if (monthOpen[year][month] === undefined) monthOpen[year][month] = true;
	    });
	  });
	}

	function handleKeydown(event, callback) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            callback();
        }
    }

    // Add hover state tracking for social icons
    let hoveredIcon = '';
</script>

<style>
</style>

<!-- Overlay for mobile -->
{#if sidebarOpen && !isDesktop}
    <button 
        type="button"
        class="fixed inset-0 bg-black opacity-50 z-30 w-full h-full cursor-pointer"
        on:click={toggleSidebar}
        on:keydown={(e) => handleKeydown(e, toggleSidebar)}
        aria-label="Close navigation menu"
    ></button>
{/if}
  
<div class="flex min-h-screen relative">
    <!-- Hamburger button as separate fixed element -->
    <div class="fixed top-4 z-50 transition-transform duration-300 ease-in-out"
         style="transform: translateX({sidebarOpen ? '21rem' : '1rem'})">
        <button 
            on:click={toggleSidebar} 
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={sidebarOpen}
            class="bg-gray-900 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {#if sidebarOpen}
                <svg class="w-6 h-6 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            {:else}
                <svg class="w-6 h-6 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            {/if}
        </button>
    </div>

	<aside class="fixed top-0 left-0 h-screen w-80 bg-gray-900 text-gray-100 transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto"
	  style="transform: translateX({sidebarOpen ? '0' : '-100%'})"
	  role="navigation"
	  aria-label="Blog navigation">
	  
	  <div class="p-8 pb-4">
		<a href="/" class="block rounded-lg p-2 -m-2 transition-colors duration-200 hover:bg-gray-800/50 flex items-center justify-center">
			<span class="text-2xl font-bold">Dry Creations</span>
		</a>
	  </div>
	  <div class="flex space-x-4 px-8 py-4">
		<a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" 
		   on:mouseenter={() => hoveredIcon = 'linkedin'}
           on:mouseleave={() => hoveredIcon = ''}
		   class="transition-all duration-200"
		   aria-label="Visit LinkedIn profile">
			<SocialIcons 
				alt="LinkedIn" 
				network="linkedin" 
				fgColor="#eeeeee" 
				bgColor={hoveredIcon === 'linkedin' ? "oklch(0.25 0.034 264.665)" : "oklch(0.21 0.034 264.665)"}
				className="transition-colors duration-200" />
		</a>
		<a href="https://www.github.com" target="_blank" rel="noopener noreferrer" 
		   on:mouseenter={() => hoveredIcon = 'github'}
           on:mouseleave={() => hoveredIcon = ''}
		   class="transition-all duration-200"
		   aria-label="Visit GitHub profile">
			<SocialIcons 
				alt="GitHub" 
				network="github" 
				fgColor="#eeeeee" 
				bgColor={hoveredIcon === 'github' ? "oklch(0.25 0.034 264.665)" : "oklch(0.21 0.034 264.665)"}
				className="transition-colors duration-200" />
		</a>
		<a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" 
		   on:mouseenter={() => hoveredIcon = 'youtube'}
           on:mouseleave={() => hoveredIcon = ''}
		   class="transition-all duration-200"
		   aria-label="Visit YouTube profile">
			<SocialIcons 
				alt="YouTube" 
				network="youtube" 
				fgColor="#eeeeee" 
				bgColor={hoveredIcon === 'youtube' ? "oklch(0.25 0.034 264.665)" : "oklch(0.21 0.034 264.665)"}
				className="transition-colors duration-200" />
		</a>
		<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" 
		   on:mouseenter={() => hoveredIcon = 'instagram'}
           on:mouseleave={() => hoveredIcon = ''}
		   class="transition-all duration-200"
		   aria-label="Visit Instagram profile">
			<SocialIcons 
				alt="Instagram" 
				network="instagram" 
				fgColor="#eeeeee" 
				bgColor={hoveredIcon === 'instagram' ? "oklch(0.25 0.034 264.665)" : "oklch(0.21 0.034 264.665)"}
				className="transition-colors duration-200" />
		</a>
	</div>
	  <nav class="px-4 pt-2 space-y-2" aria-label="Blog archive">
		{#each Object.keys(data.posts).sort((a, b) => b - a) as year}
			<!-- Year heading -->
				<div class="group/year">
					<button 
						type="button"
						class="w-full text-left rounded-lg transition-colors duration-200 hover:bg-gray-800/50 p-2 font-bold cursor-pointer mb-2 flex items-center"
						on:click={() => yearOpen[year] = !yearOpen[year]}
						on:keydown={(e) => handleKeydown(e, () => yearOpen[year] = !yearOpen[year])}
						aria-expanded={yearOpen[year]}
						aria-controls="year-{year}-content">
							<span class="flex-grow">{year}</span>
						<svg class="w-4 h-4 mr-2 transition-transform duration-200 {yearOpen[year] ? 'rotate-90' : ''}" 
							 viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M7.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</button>
					{#if yearOpen[year]}
						<div id="year-{year}-content" class="space-y-2 mt-2 rounded-lg transition-all duration-200 group-hover/year:bg-gray-800/10 p-2">
							{#each Object.keys(data.posts[year]).sort((a, b) => {
							  const order = ["January","February","March","April","May","June","July","August","September","October","November","December"];
							  return order.indexOf(b) - order.indexOf(a);
							}) as month}
								<!-- Month heading and posts container -->
								<div class="group/month">
									<button 
										type="button"
										class="w-full text-left rounded-lg transition-colors duration-200 hover:bg-gray-800/50 p-2 italic text-sm cursor-pointer mb-1 flex items-center"
										on:click={() => monthOpen[year][month] = !monthOpen[year][month]}
										on:keydown={(e) => handleKeydown(e, () => monthOpen[year][month] = !monthOpen[year][month])}
										aria-expanded={monthOpen[year][month]}
										aria-controls="month-{year}-{month}-content">
											<span class="flex-grow">{month}</span>
										<svg class="w-4 h-4 transition-transform duration-200 {monthOpen[year][month] ? 'rotate-90' : ''}" 
											 viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M7.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd" />
										</svg>
									</button>
									
									{#if monthOpen[year][month]}
										<div 
											id="month-{year}-{month}-content"
											class="ml-2 rounded-lg transition-all duration-200 group-hover/month:bg-gray-800/20 p-2">
											<ul class="space-y-1 list-none">
												{#each data.posts[year][month] as post}
													<li>
														<a href={post.url} 
														   class="block text-sm py-1 px-2 rounded-lg transition-colors duration-200 hover:bg-gray-800/80"
														   aria-label="Read post: {post.title}">
															{post.title}
														</a>
													</li>
												{/each}
											</ul>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
		{/each}
	  </nav>
	</aside>
  
	<main class="flex-1 w-full transition-all duration-300" style="margin-left: {isDesktop && sidebarOpen ? '20rem' : '0'}">
	  <article class="p-4 pb-0 mb-0 prose prose-sm sm:prose lg:prose-lg w-full max-w-[100vw] sm:max-w-none mx-auto mt-1">
		<slot />
	  </article>
	</main>
</div>