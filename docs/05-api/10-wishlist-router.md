# Wishlist Router

API endpoints for wishlist management.

## Procedures

### list

Get user's wishlist.

**Access:** Protected

**Input:** None

**Output:** Array of wishlist items with product details.

### add

Add product to wishlist.

**Access:** Protected

**Input:** `{ productId: string }`

### remove

Remove product from wishlist.

**Access:** Protected

**Input:** `{ productId: string }`

### check

Check if product is in wishlist.

**Access:** Protected

**Input:** `{ productId: string }`

**Output:** `{ isInWishlist: boolean }`
