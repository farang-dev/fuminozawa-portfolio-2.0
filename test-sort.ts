import { createClient } from './prismicio';

async function testFetch() {
    try {
        const client = createClient();
        const posts = await client.getAllByType('blog_post', {
            orderings: [
                { field: 'my.blog_post.published_date', direction: 'desc' },
                { field: 'document.first_publication_date', direction: 'desc' },
            ],
        });
        console.log(`Total posts found: ${posts.length}`);
        posts.forEach(p => {
            console.log(`- ${p.uid} | Published Date Field: ${p.data.published_date} | First Pub: ${p.first_publication_date}`);
        });
    } catch (e) {
        console.error(e);
    }
}

testFetch();
