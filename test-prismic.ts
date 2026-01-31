import { createClient } from './prismicio';

async function testFetch() {
    try {
        const client = createClient();

        console.log('--- Japanese (ja-jp) ---');
        const jaPosts = await client.getAllByType('blog_post', { lang: 'ja-jp' });
        console.log(`Total ja-jp posts: ${jaPosts.length}`);
        jaPosts.forEach(p => {
            console.log(`- ${p.uid} | Tags: ${JSON.stringify(p.tags)}`);
        });

        console.log('\n--- English (en-us) ---');
        const enPosts = await client.getAllByType('blog_post', { lang: 'en-us' });
        console.log(`Total en-us posts: ${enPosts.length}`);
        enPosts.forEach(p => {
            console.log(`- ${p.uid} | Tags: ${JSON.stringify(p.tags)}`);
        });

    } catch (e) {
        console.error(e);
    }
}

testFetch();
