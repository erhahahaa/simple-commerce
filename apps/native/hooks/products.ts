import type { ProductListQuery } from "@simple-commerce/schema";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

const _CATEGORY_KEYS = {
	LIST: orpc.category.list.queryKey(),
	GET_BY_SLUG: (slug: string) =>
		orpc.category.getBySlug.queryKey({ input: { slug } }),
} as const;

// Categories
export function useCategories() {
	return useQuery(orpc.category.list.queryOptions());
}

export function useCategoryBySlug(slug: string) {
	return useQuery(orpc.category.getBySlug.queryOptions({ input: { slug } }));
}

const _PRODUCT_KEYS = {
	LIST: (query: ProductListQuery) =>
		orpc.product.list.queryKey({ input: query }),
	GET_BY_SLUG: (slug: string) =>
		orpc.product.getBySlug.queryKey({ input: { slug } }),
	GET_BY_ID: (id: string) => orpc.product.getById.queryKey({ input: { id } }),
	FEATURED: (limit: number) =>
		orpc.product.featured.queryKey({ input: { limit } }),
} as const;

// Products
export function useProducts(options?: Partial<ProductListQuery>) {
	return useQuery(orpc.product.list.queryOptions({ input: options ?? {} }));
}

export function useProductBySlug(slug: string) {
	return useQuery(orpc.product.getBySlug.queryOptions({ input: { slug } }));
}

export function useProductById(id: string) {
	return useQuery(orpc.product.getById.queryOptions({ input: { id } }));
}

export function useFeaturedProducts(limit?: number) {
	return useQuery(
		orpc.product.featured.queryOptions({ input: { limit: limit ?? 10 } }),
	);
}
