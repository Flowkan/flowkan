import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
	hasMoreData: boolean;
	fetchMoreData: () => void;
	threshold?: number;
	rootMargin?: string;
}

export const useInfiniteScroll = ({
	hasMoreData,
	fetchMoreData,
	threshold = 1,
	rootMargin = "0px",
}: UseInfiniteScrollOptions) => {
	const loadingElementRef = useRef<HTMLDivElement | null>(null);

	// Para evitar re-renderizaciones innecesarias
	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const targetEntry = entries[0];
			if (targetEntry.isIntersecting && hasMoreData) {
				fetchMoreData();
			}
		},
		[hasMoreData, fetchMoreData],
	);

	useEffect(() => {
		const currentElement = loadingElementRef.current;
		if (!currentElement) return;

		const intersectionObserver = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin,
			threshold,
		});

		intersectionObserver.observe(currentElement);

		return () => {
			try {
				if (currentElement) {
					intersectionObserver.unobserve(currentElement);
				}
			} finally {
				intersectionObserver.disconnect();
			}
		};
	}, [handleIntersection, rootMargin, threshold]);

	return loadingElementRef;
};
