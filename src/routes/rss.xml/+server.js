export async function GET() {
	const posts = import.meta.glob('/src/routes/blog/**/+page.md', { eager: true });
	const baseUrl = 'drycreations.github.com';

	const items = Object.keys(posts)
		.map((path) => {
			const post = posts[path];
			const route = path.replace('/src/routes', '').replace('/+page.md', '');
			const url = `${baseUrl}${route}`;
			return {
				title: post.metadata.title,
				date: new Date(post.metadata.date),
				url
			};
		})
		.sort((a, b) => b.date - a.date);

	const feedItems = items
		.map(
			item => `
    <item>
      <title>${item.title}</title>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <link>${item.url}</link>
      <guid>${item.url}</guid>
    </item>`
		)
		.join('');

	const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Your Blog Title</title>
    <link>${baseUrl}</link>
    <description>Your blog description.</description>
    ${feedItems}
  </channel>
</rss>`;

	return new Response(rssFeed.trim(), {
		headers: { 'Content-Type': 'application/rss+xml' }
	});
}
