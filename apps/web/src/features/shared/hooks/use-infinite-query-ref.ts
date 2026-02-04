import {type RefCallback, useCallback, useRef} from "react";

interface IUseInfiniteScrollOptions {
	fetchNextPage: () => void;
	hasNextPage: boolean;
	isFetching: boolean;
	isLoading: boolean;
	threshold?: number;
}

export const useInfiniteQueryRef = ({
	fetchNextPage,
	hasNextPage,
	isFetching,
	isLoading,
	threshold
}: IUseInfiniteScrollOptions) => {
	const observer = useRef<IntersectionObserver | null>(null);

	const ref = useCallback(
		(node: HTMLDivElement) => {
			if (isLoading) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(
				([entry]) => {
					if (entry?.isIntersecting && hasNextPage && !isFetching) {
						fetchNextPage();
					}
				},
				{
					threshold: threshold ?? 0.5
				}
			);

			if (node) observer.current.observe(node);
		},
		[fetchNextPage, hasNextPage, isFetching, isLoading, threshold]
	);

	return ref as RefCallback<HTMLElement>;
};
