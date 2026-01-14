import { createClient } from './prismicio';

async function testFetch() {
    try {
        const client = createClient();
        const posts = await client.getAllByType('blog_post');
        console.log(`Total posts found: ${posts.length}`);
        posts.forEach(p => {
            console.log(`- ${p.uid} | Published: ${p.first_publication_date} | Updated: ${p.last_publication_date}`);
        });
    } catch (e) {
        console.error(e);
    }
}

testFetch();
