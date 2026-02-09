import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

// Categories
export function useCategories() {
	return useQuery(orpc.category.list.queryOptions());
}

export function useCategoryBySlug(slug: string) {
	return useQuery(orpc.category.getBySlug.queryOptions({ input: { slug } }));
}

// Products
export function useProducts(options?: {
	categoryId?: string;
	search?: string;
	sortBy?: "name" | "price" | "createdAt";
	sortOrder?: "asc" | "desc";
	limit?: number;
	offset?: number;
}) {
	return useQuery(
		orpc.product.list.queryOptions({
			input: {
				categoryId: options?.categoryId,
				search: options?.search,
				sortBy: options?.sortBy,
				sortOrder: options?.sortOrder,
				limit: options?.limit ?? 20,
				offset: options?.offset ?? 0,
			},
		}),
	);
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
