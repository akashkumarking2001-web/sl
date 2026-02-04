SELECT p.name, c.name as category FROM products p JOIN product_categories c ON p.category_id = c.id WHERE p.is_featured = true;
