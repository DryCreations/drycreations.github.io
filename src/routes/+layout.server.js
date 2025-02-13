export const prerender = true;

export async function load() {
	const allPosts = import.meta.glob('/src/routes/blog/**/+page.md', { eager: true });
	const posts = [];

	for (const path in allPosts) {
		const post = allPosts[path];
		const dateObj = new Date(post.metadata.date);
		const year = dateObj.getFullYear();
		const month = dateObj.toLocaleString('default', { month: 'long' });
		const url = path.replace('/src/routes', '').replace('/+page.md', '');
		posts.push({ title: post.metadata.title, date: dateObj, year, month, url });
	}

	const grouped = {};
	posts.forEach((post) => {
		if (!grouped[post.year]) grouped[post.year] = {};
		if (!grouped[post.year][post.month]) grouped[post.year][post.month] = [];
		grouped[post.year][post.month].push(post);
	});

	for (const year in grouped) {
		for (const month in grouped[year]) {
			grouped[year][month].sort((a, b) => b.date - a.date);
		}
	}

	return { posts: grouped };
}
