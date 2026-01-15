import { createClient } from './prismicio';

async function testFetch() {
    try {
        const client = createClient();
        const post = await client.getByUID('blog_post', 'web-building-strategies-for-the-ai-search-era-a-technical-guide-to-geo-implementation');
        console.log(JSON.stringify(post.data.content, null, 2));
    } catch (e) {
        console.error(e);
    }
}

testFetch();
