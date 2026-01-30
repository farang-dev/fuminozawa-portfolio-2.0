import { Client } from '@notionhq/client';
import type { BlockObjectResponse, PageObjectResponse, PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { slugify } from './utils';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  publishedDate?: string;
  description?: string;
  content?: BlockObjectResponse[];
}

export const getNotionClient = () => {
  const notionApiKey = process.env.NOTION_API_KEY;
  if (!notionApiKey) {
    throw new Error('NOTION_API_KEY is not set');
  }
  return new Client({ auth: notionApiKey });
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const notion = getNotionClient();
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID;
  if (!parentPageId) {
    throw new Error('NOTION_PARENT_PAGE_ID is not set');
  }

  const blocks = await notion.blocks.children.list({
    block_id: parentPageId,
  });

  const posts: BlogPost[] = [];

  function isChildPageBlock(block: BlockObjectResponse | PartialBlockObjectResponse): block is Extract<BlockObjectResponse, { type: 'child_page' }> {
    return 'type' in block && block.type === 'child_page';
  }

  for (const block of blocks.results) {
    if (isChildPageBlock(block)) {
      const pageId = block.id;
      const pageDetails = await notion.pages.retrieve({ page_id: pageId }) as PageObjectResponse;

      const title = block.child_page.title || 'Untitled';

      let publishedDate: string | undefined;
      if (pageDetails.properties && 'published' in pageDetails.properties && pageDetails.properties.published.type === 'date') {
        publishedDate = pageDetails.properties.published.date?.start;
      }

      let description: string | undefined;
      if (pageDetails.properties && 'description' in pageDetails.properties && pageDetails.properties.description.type === 'rich_text' && pageDetails.properties.description.rich_text.length > 0) {
        description = pageDetails.properties.description.rich_text[0].plain_text;
      }

      posts.push({
        id: pageId,
        slug: slugify(title),
        title,
        publishedDate,
        description,
      });
    }
  }

  return posts;
};

export const getBlogPostById = async (postId: string): Promise<BlogPost> => {
  const notion = getNotionClient();
  const page = await notion.pages.retrieve({ page_id: postId }) as PageObjectResponse;

  // Fetch all blocks with pagination
  let allBlocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: postId,
      start_cursor: cursor,
      page_size: 100 // Maximum allowed by Notion API
    });

    allBlocks = [...allBlocks, ...(response.results as BlockObjectResponse[])];
    cursor = response.next_cursor || undefined;
  } while (cursor);

  let title = 'Untitled';
  const titleProp = page.properties.title;
  if (titleProp?.type === 'title' && titleProp.title.length > 0) {
    title = titleProp.title[0].plain_text;
  }

  let publishedDate: string | undefined;
  const publishedProp = page.properties.published;
  if (publishedProp?.type === 'date') {
    publishedDate = publishedProp.date?.start;
  }

  let description: string | undefined;
  const descriptionProp = page.properties.description;
  if (descriptionProp?.type === 'rich_text' && descriptionProp.rich_text.length > 0) {
    description = descriptionProp.rich_text[0].plain_text;
  }

  return {
    id: postId,
    slug: slugify(title),
    title,
    publishedDate,
    description,
    content: allBlocks,
  };
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  return getBlogPostById(post.id);
};