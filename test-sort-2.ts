import { createClient } from './prismicio';

async function testFetch() {
    try {
        const client = createClient();
        console.log("--- Ordering by first_publication_date desc ---");
        const posts = await client.getAllByType('blog_post', {
            orderings: [
                { field: 'document.first_publication_date', direction: 'desc' },
            ],
        });
        posts.forEach(p => {
            console.log(`- ${p.uid} | First Pub: ${p.first_publication_date}`);
        });
    } catch (e) {
        console.error(e);
    }
}

testFetch();
