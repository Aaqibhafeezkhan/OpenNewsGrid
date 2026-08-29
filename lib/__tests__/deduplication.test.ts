import { cleanArticles } from '../news-aggregator';

const article = (overrides = {}) => ({
  id: 'article-1',
  title: 'Story A',
  description: 'Description',
  url: 'https://example.com/a',
  imageUrl: 'https://example.com/image.jpg',
  source: {
    id: 'source-a',
    name: 'Source A',
    url: 'https://source-a.com',
    category: 'general',
    language: 'en',
    country: 'us',
  },
  publishedAt: '2026-08-30T08:00:00Z',
  category: 'general',
  language: 'en',
  country: 'us',
  ...overrides,
});

describe('cleanArticles', () => {
  it('removes exact URL duplicates', () => {
    const articles = [
      article(),
      article({ id: 'article-2', title: 'Story A copy', publishedAt: '2026-08-30T08:01:00Z' }),
    ];

    expect(cleanArticles(articles)).toHaveLength(1);
  });

  it('removes articles with invalid URLs', () => {
    const articles = [article(), article({ id: 'article-2', url: 'not-a-url' })];

    expect(cleanArticles(articles)).toHaveLength(1);
  });

  it('removes articles with blank titles', () => {
    const articles = [article(), article({ id: 'article-2', title: '   ' })];

    expect(cleanArticles(articles)).toHaveLength(1);
  });

  it('removes mock articles', () => {
    const articles = [article(), article({ id: 'mock-example' })];

    expect(cleanArticles(articles)).toHaveLength(1);
  });

  it('keeps distinct URLs from different sources', () => {
    const articles = [
      article(),
      article({
        id: 'article-2',
        url: 'https://example.com/b',
        source: {
          id: 'source-b',
          name: 'Source B',
          url: 'https://source-b.com',
          category: 'general',
          language: 'en',
          country: 'us',
        },
      }),
    ];

    expect(cleanArticles(articles)).toHaveLength(2);
  });

  it('sorts retained articles by publication time descending', () => {
    const articles = [
      article({ id: 'article-1', url: 'https://example.com/older', publishedAt: '2026-08-30T08:00:00Z' }),
      article({ id: 'article-2', url: 'https://example.com/newer', publishedAt: '2026-08-30T10:00:00Z' }),
      article({ id: 'article-3', url: 'https://example.com/mid', publishedAt: '2026-08-30T09:00:00Z' }),
    ];

    expect(cleanArticles(articles).map((item) => item.id)).toEqual(['article-2', 'article-3', 'article-1']);
  });
});
