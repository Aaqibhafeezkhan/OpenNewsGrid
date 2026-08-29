import { deduplicateArticles } from '../news-aggregator';

describe('deduplicateArticles', () => {
  it('removes exact URL duplicates', () => {
    const articles = [
      { title: 'Story A', url: 'https://example.com/a', publishedAt: '2026-08-30T08:00:00Z', source: { id: 'source-a', name: 'Source A', url: 'https://source-a.com' } },
      { title: 'Story A copy', url: 'https://example.com/a', publishedAt: '2026-08-30T08:01:00Z', source: { id: 'source-b', name: 'Source B', url: 'https://source-b.com' } },
    ];
    expect(deduplicateArticles(articles)).toHaveLength(1);
  });

  it('merges equivalent stories with slightly different titles', () => {
    const articles = [
      { title: 'Major storm hits Mumbai today', url: 'https://a.com/1', publishedAt: '2026-08-30T08:00:00Z', source: { id: 'a', name: 'A', url: 'https://a.com' } },
      { title: 'Major storm hits Mumbai today!', url: 'https://b.com/2', publishedAt: '2026-08-30T08:02:00Z', source: { id: 'b', name: 'B', url: 'https://b.com' } },
    ];
    expect(deduplicateArticles(articles)).toHaveLength(1);
  });

  it('keeps same-title stories from different sources when URLs and timing indicate distinct articles', () => {
    const articles = [
      { title: 'Budget announced', url: 'https://a.com/1', publishedAt: '2026-08-30T08:00:00Z', source: { id: 'a', name: 'A', url: 'https://a.com' } },
      { title: 'Budget announced', url: 'https://b.com/9', publishedAt: '2026-08-30T20:00:00Z', source: { id: 'b', name: 'B', url: 'https://b.com' } },
    ];
    expect(deduplicateArticles(articles)).toHaveLength(2);
  });

  it('keeps distinct stories with only superficially similar titles', () => {
    const articles = [
      { title: 'India wins cricket series', url: 'https://a.com/1', publishedAt: '2026-08-30T08:00:00Z', source: { id: 'a', name: 'A', url: 'https://a.com' } },
      { title: 'India wins cricket series opener', url: 'https://b.com/2', publishedAt: '2026-08-29T08:00:00Z', source: { id: 'b', name: 'B', url: 'https://b.com' } },
    ];
    expect(deduplicateArticles(articles)).toHaveLength(2);
  });

  it('considers publication timestamps when identifying duplicates', () => {
    const articles = [
      { title: 'Central bank raises rates', url: 'https://a.com/1', publishedAt: '2026-08-30T09:00:00Z', source: { id: 'a', name: 'A', url: 'https://a.com' } },
      { title: 'Central bank raises rates', url: 'https://b.com/2', publishedAt: '2026-08-30T09:04:00Z', source: { id: 'b', name: 'B', url: 'https://b.com' } },
    ];
    expect(deduplicateArticles(articles)).toHaveLength(1);
  });

  it('collapses multiple representations of the same story to one article', () => {
    const articles = [
      { title: 'Election results released', url: 'https://a.com/1', publishedAt: '2026-08-30T10:00:00Z', source: { id: 'a', name: 'A', url: 'https://a.com' } },
      { title: 'Election results released', url: 'https://b.com/2', publishedAt: '2026-08-30T10:01:00Z', source: { id: 'b', name: 'B', url: 'https://b.com' } },
      { title: 'Election result released', url: 'https://c.com/3', publishedAt: '2026-08-30T10:02:00Z', source: { id: 'c', name: 'C', url: 'https://c.com' } },
    ];
    expect(deduplicateArticles(articles)).toHaveLength(1);
  });
});