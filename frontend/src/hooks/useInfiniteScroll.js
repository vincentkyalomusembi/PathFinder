import { useState, useEffect, useCallback } from 'react';

export function useInfiniteScroll(fetchFn, query) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newJobs = await fetchFn({ page, q: query });
      setJobs(prev => [...prev, ...newJobs]);
      setHasMore(newJobs.length > 0);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, page, query, fetchFn]);

  useEffect(() => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    loadMore();
  }, [query]);

  return { jobs, loading, hasMore, loadMore };
}