-- Add remaining 59 products (avoiding duplicates)
-- Run this after DEPLOY_ECOMMERCE_FIXED.sql

DO $$
DECLARE
    cat_electronics UUID;
    cat_fashion UUID;
    cat_home UUID;
    cat_beauty UUID;
    cat_sports UUID;
    cat_books UUID;
BEGIN
    SELECT id INTO cat_electronics FROM public.product_categories WHERE slug = 'electronics';
    SELECT id INTO cat_fashion FROM public.product_categories WHERE slug = 'fashion';
    SELECT id INTO cat_home FROM public.product_categories WHERE slug = 'home-kitchen';
    SELECT id INTO cat_beauty FROM public.product_categories WHERE slug = 'beauty-personal-care';
    SELECT id INTO cat_sports FROM public.product_categories WHERE slug = 'sports-fitness';
    SELECT id INTO cat_books FROM public.product_categories WHERE slug = 'books-stationery';

    -- ELECTRONICS (11 more products - avoiding duplicates)
    INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, gallery_images, mrp, price, cashback_amount, stock_quantity, is_featured, tags, specifications) VALUES
    
    (cat_electronics, 'Samsung Galaxy S24 Ultra 512GB', 'samsung-s24-ultra-512gb', 'Powerful flagship with Snapdragon 8 Gen 3, 200MP camera, S Pen, and AI features.', 'Samsung flagship with S Pen', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'], 134999, 119999, 6000, 40, true, ARRAY['smartphone', 'samsung'], '{"camera": "200MP"}'::jsonb),
    
    (cat_electronics, 'Apple MacBook Air M3 15-inch', 'macbook-air-m3-15', 'Supercharged by M3 chip with 15.3-inch display.', 'Latest MacBook Air', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'], 149900, 139900, 6995, 25, true, ARRAY['laptop', 'apple'], '{"processor": "M3"}'::jsonb),
    
    (cat_electronics, 'Dell XPS 13 Plus i7', 'dell-xps-13-plus', 'Premium ultrabook with InfinityEdge display.', 'Premium Windows laptop', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', ARRAY['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'], 129990, 114990, 5749, 30, false, ARRAY['laptop', 'dell'], '{"processor": "i7"}'::jsonb),
    
    (cat_electronics, 'iPad Pro 12.9 M2', 'ipad-pro-129-m2', 'Ultimate iPad with M2 chip.', 'Professional tablet', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'], 119900, 109900, 5495, 35, false, ARRAY['tablet', 'apple'], '{"display": "12.9 inch"}'::jsonb),
    
    (cat_electronics, 'Samsung 55 QLED 4K TV', 'samsung-55-qled-4k', 'Quantum Dot 4K TV with HDR10+.', '55-inch QLED TV', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800', ARRAY['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'], 74990, 64990, 3249, 20, false, ARRAY['tv', 'samsung'], '{"size": "55 inch"}'::jsonb),
    
    (cat_electronics, 'Canon EOS R6 Mark II', 'canon-eos-r6-mark2', 'Professional mirrorless camera.', 'Mirrorless camera', 'https://images.unsplash.com/photo-1606980707986-e6e23b4f6e23?w=800', ARRAY['https://images.unsplash.com/photo-1606980707986-e6e23b4f6e23?w=800'], 249990, 229990, 11499, 15, false, ARRAY['camera', 'canon'], '{"sensor": "24.2MP"}'::jsonb),
    
    (cat_electronics, 'Apple Watch Series 9', 'apple-watch-series-9', 'Advanced health tracking smartwatch.', 'Latest Apple Watch', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800', ARRAY['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'], 44900, 39900, 1995, 60, false, ARRAY['smartwatch', 'apple'], '{"display": "45mm"}'::jsonb),
    
    (cat_electronics, 'JBL Flip 6 Speaker', 'jbl-flip-6', 'Portable waterproof Bluetooth speaker.', 'Bluetooth speaker', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800', ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'], 12999, 9999, 499, 80, false, ARRAY['speaker', 'jbl'], '{"battery": "12 hours"}'::jsonb),
    
    (cat_electronics, 'Logitech MX Master 3S', 'logitech-mx-master-3s', 'Premium wireless mouse.', 'Wireless mouse', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', ARRAY['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'], 10995, 8995, 449, 100, false, ARRAY['mouse', 'logitech'], '{"dpi": "8000"}'::jsonb),
    
    (cat_electronics, 'Samsung T7 SSD 1TB', 'samsung-t7-ssd-1tb', 'Ultra-fast portable SSD.', 'Portable SSD', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800', ARRAY['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'], 12999, 10999, 549, 70, false, ARRAY['storage', 'samsung'], '{"capacity": "1TB"}'::jsonb),
    
    (cat_electronics, 'Kindle Paperwhite 11th Gen', 'kindle-paperwhite-11', 'E-reader with warm light.', 'E-reader', 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800', ARRAY['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800'], 14999, 12999, 649, 90, false, ARRAY['ereader', 'kindle'], '{"display": "6.8 inch"}'::jsonb)
    
    ON CONFLICT (slug) DO NOTHING;

    -- FASHION (12 more products)
    INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, gallery_images, mrp, price, cashback_amount, stock_quantity, is_featured, tags, specifications) VALUES
    
    (cat_fashion, 'Adidas Ultraboost 23', 'adidas-ultraboost-23', 'Premium running shoes with Boost cushioning.', 'Running shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'], 16999, 13999, 699, 60, false, ARRAY['running', 'adidas'], '{"type": "Running"}'::jsonb),
    
    (cat_fashion, 'Levis 501 Jeans', 'levis-501-jeans', 'Original blue jeans since 1873.', 'Classic jeans', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], 4999, 3999, 199, 100, false, ARRAY['jeans', 'levis'], '{"fit": "Straight"}'::jsonb),
    
    (cat_fashion, 'Ray-Ban Aviator', 'rayban-aviator-classic', 'Iconic aviator sunglasses.', 'Aviator sunglasses', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', ARRAY['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'], 12999, 10999, 549, 70, false, ARRAY['sunglasses', 'rayban'], '{"uv": "100%"}'::jsonb),
    
    (cat_fashion, 'Tommy Hilfiger Polo', 'tommy-polo-tshirt', 'Classic polo with flag logo.', 'Polo t-shirt', 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800', ARRAY['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800'], 3499, 2799, 139, 120, false, ARRAY['tshirt', 'tommy'], '{"material": "Cotton"}'::jsonb),
    
    (cat_fashion, 'Puma Tracksuit', 'puma-tracksuit', 'Comfortable full tracksuit.', 'Tracksuit set', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'], 5999, 4499, 224, 80, false, ARRAY['tracksuit', 'puma'], '{"type": "Full Set"}'::jsonb),
    
    (cat_fashion, 'Fossil Smartwatch', 'fossil-gen6-hybrid', 'Hybrid smartwatch.', 'Smartwatch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'], 18999, 15999, 799, 45, false, ARRAY['watch', 'fossil'], '{"battery": "2 weeks"}'::jsonb),
    
    (cat_fashion, 'Zara Leather Jacket', 'zara-leather-jacket', 'Faux leather jacket.', 'Leather jacket', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'], 7999, 6499, 324, 50, false, ARRAY['jacket', 'zara'], '{"material": "Faux Leather"}'::jsonb),
    
    (cat_fashion, 'H&M Dress Shirt', 'hm-dress-shirt', 'Cotton dress shirt.', 'Dress shirt', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'], 2499, 1999, 99, 100, false, ARRAY['shirt', 'hm'], '{"fit": "Slim"}'::jsonb),
    
    (cat_fashion, 'Converse Chuck Taylor', 'converse-chuck-taylor', 'Classic canvas sneakers.', 'Canvas sneakers', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800', ARRAY['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800'], 4999, 3999, 199, 90, false, ARRAY['sneakers', 'converse'], '{"type": "High-top"}'::jsonb),
    
    (cat_fashion, 'Michael Kors Handbag', 'mk-leather-handbag', 'Premium leather handbag.', 'Leather handbag', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'], 24999, 19999, 999, 35, false, ARRAY['handbag', 'michaelkors'], '{"material": "Leather"}'::jsonb),
    
    (cat_fashion, 'Timberland Boots', 'timberland-boots', 'Waterproof leather boots.', 'Premium boots', 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800', ARRAY['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800'], 16999, 14999, 749, 40, false, ARRAY['boots', 'timberland'], '{"waterproof": "Yes"}'::jsonb),
    
    (cat_fashion, 'Vans Old Skool', 'vans-old-skool', 'Classic skate shoes.', 'Skate sneakers', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', ARRAY['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'], 5499, 4499, 224, 75, false, ARRAY['sneakers', 'vans'], '{"type": "Low-top"}'::jsonb)
    
    ON CONFLICT (slug) DO NOTHING;

    -- HOME & KITCHEN (7 more products)
    INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, gallery_images, mrp, price, cashback_amount, stock_quantity, is_featured, tags, specifications) VALUES
    
    (cat_home, 'Dyson V15 Vacuum', 'dyson-v15-vacuum', 'Cordless vacuum with laser detection.', 'Cordless vacuum', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800', ARRAY['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'], 64990, 54990, 2749, 20, false, ARRAY['vacuum', 'dyson'], '{"runtime": "60 min"}'::jsonb),
    
    (cat_home, 'Instant Pot Duo 6L', 'instant-pot-duo-6l', '7-in-1 pressure cooker.', 'Pressure cooker', 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800', ARRAY['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'], 9999, 7999, 399, 50, false, ARRAY['instantpot', 'kitchen'], '{"capacity": "6L"}'::jsonb),
    
    (cat_home, 'Nespresso Coffee Maker', 'nespresso-vertuo-next', 'Pod coffee machine.', 'Coffee maker', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800', ARRAY['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'], 14999, 12999, 649, 35, false, ARRAY['coffee', 'nespresso'], '{"type": "Pod"}'::jsonb),
    
    (cat_home, 'KitchenAid Mixer', 'kitchenaid-stand-mixer', 'Professional stand mixer.', 'Stand mixer', 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800', ARRAY['https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800'], 39999, 34999, 1749, 25, false, ARRAY['mixer', 'kitchenaid'], '{"capacity": "4.8L"}'::jsonb),
    
    (cat_home, 'Tefal Cookware Set', 'tefal-cookware-set', 'Non-stick cookware 7-piece.', 'Cookware set', 'https://images.unsplash.com/photo-1584990347449-39b4aa8c6f69?w=800', ARRAY['https://images.unsplash.com/photo-1584990347449-39b4aa8c6f69?w=800'], 12999, 9999, 499, 45, false, ARRAY['cookware', 'tefal'], '{"pieces": "7"}'::jsonb),
    
    (cat_home, 'Xiaomi Air Purifier', 'xiaomi-air-purifier-3h', 'Smart HEPA air purifier.', 'Air purifier', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800', ARRAY['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800'], 14999, 11999, 599, 40, false, ARRAY['airpurifier', 'xiaomi'], '{"filter": "HEPA"}'::jsonb),
    
    (cat_home, 'Bosch Washing Machine', 'bosch-washing-machine-7kg', '7kg front load washer.', 'Washing machine', 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800', ARRAY['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800'], 34999, 29999, 1499, 15, false, ARRAY['washingmachine', 'bosch'], '{"capacity": "7kg"}'::jsonb)
    
    ON CONFLICT (slug) DO NOTHING;

    -- BEAUTY & PERSONAL CARE (11 products)
    INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, gallery_images, mrp, price, cashback_amount, stock_quantity, is_featured, tags, specifications) VALUES
    
    (cat_beauty, 'Lakme Foundation', 'lakme-mousse-foundation', 'Mousse foundation with SPF.', 'Mousse foundation', 'https://images.unsplash.com/photo-1631214524020-7e18db7f7e8c?w=800', ARRAY['https://images.unsplash.com/photo-1631214524020-7e18db7f7e8c?w=800'], 850, 595, 29, 100, true, ARRAY['foundation', 'lakme'], '{"spf": "8"}'::jsonb),
    
    (cat_beauty, 'Maybelline Foundation', 'maybelline-fitmematte', 'Matte liquid foundation.', 'Liquid foundation', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800', ARRAY['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'], 699, 549, 27, 120, false, ARRAY['foundation', 'maybelline'], '{"finish": "Matte"}'::jsonb),
    
    (cat_beauty, 'Philips Epilator', 'philips-epilator-bre650', 'Wet & dry epilator.', 'Epilator', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'], 7995, 6495, 324, 45, false, ARRAY['epilator', 'philips'], '{"accessories": "8"}'::jsonb),
    
    (cat_beauty, 'Neutrogena Hydro Boost', 'neutrogena-hydroboost', 'Water gel moisturizer.', 'Gel moisturizer', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800', ARRAY['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'], 999, 799, 39, 90, false, ARRAY['moisturizer', 'neutrogena'], '{"type": "Gel"}'::jsonb),
    
    (cat_beauty, 'LOreal Serum', 'loreal-revitalift-serum', 'Anti-aging serum.', 'Face serum', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'], 1499, 1199, 59, 75, false, ARRAY['serum', 'loreal'], '{"benefit": "Anti-aging"}'::jsonb),
    
    (cat_beauty, 'The Ordinary Niacinamide', 'ordinary-niacinamide', 'Niacinamide 10% serum.', 'Niacinamide serum', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800', ARRAY['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'], 599, 499, 24, 100, false, ARRAY['serum', 'ordinary'], '{"concentration": "10%"}'::jsonb),
    
    (cat_beauty, 'Gillette Fusion5', 'gillette-fusion5', '5-blade razor.', 'Premium razor', 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800', ARRAY['https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800'], 899, 699, 34, 110, false, ARRAY['razor', 'gillette'], '{"blades": "5"}'::jsonb),
    
    (cat_beauty, 'Biotique Shampoo', 'biotique-kelp-shampoo', 'Protein shampoo.', 'Hair shampoo', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800', ARRAY['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'], 399, 319, 15, 130, false, ARRAY['shampoo', 'biotique'], '{"type": "Protein"}'::jsonb),
    
    (cat_beauty, 'Plum Face Wash', 'plum-greentea-facewash', 'Green tea face wash.', 'Face wash', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800', ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800'], 375, 299, 14, 100, false, ARRAY['facewash', 'plum'], '{"key": "Green Tea"}'::jsonb),
    
    (cat_beauty, 'Nivea Moisturizer', 'nivea-soft-moisturizer', 'Light moisturizing cream.', 'Moisturizer', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800', ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800'], 249, 199, 9, 150, false, ARRAY['moisturizer', 'nivea'], '{"type": "Light"}'::jsonb),
    
    (cat_beauty, 'Dove Body Wash', 'dove-bodywash', 'Nourishing body wash.', 'Body wash', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800', ARRAY['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'], 399, 319, 15, 120, false, ARRAY['bodywash', 'dove'], '{"benefit": "Nourishing"}'::jsonb)
    
    ON CONFLICT (slug) DO NOTHING;

    -- SPORTS & FITNESS (11 products)
    INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, gallery_images, mrp, price, cashback_amount, stock_quantity, is_featured, tags, specifications) VALUES
    
    (cat_sports, 'Strauss Yoga Mat', 'strauss-yoga-mat-6mm', '6mm yoga mat with bag.', 'Yoga mat', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'], 1299, 799, 39, 90, true, ARRAY['yoga', 'strauss'], '{"thickness": "6mm"}'::jsonb),
    
    (cat_sports, 'Boldfit Shaker', 'boldfit-shaker-bottle', 'Protein shaker 700ml.', 'Shaker bottle', 'https://images.unsplash.com/photo-1622484211110-f6e3c3a6e1e1?w=800', ARRAY['https://images.unsplash.com/photo-1622484211110-f6e3c3a6e1e1?w=800'], 499, 299, 14, 150, false, ARRAY['shaker', 'boldfit'], '{"capacity": "700ml"}'::jsonb),
    
    (cat_sports, 'Nivia Football', 'nivia-storm-football', 'Size 5 football.', 'Football', 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800', ARRAY['https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800'], 1299, 999, 49, 70, false, ARRAY['football', 'nivia'], '{"size": "5"}'::jsonb),
    
    (cat_sports, 'Cosco Cricket Bat', 'cosco-cricket-bat', 'Kashmir willow bat.', 'Cricket bat', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', ARRAY['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'], 2499, 1999, 99, 50, false, ARRAY['cricket', 'cosco'], '{"material": "Kashmir Willow"}'::jsonb),
    
    (cat_sports, 'Yonex Shuttlecocks', 'yonex-mavis-shuttlecocks', 'Nylon shuttlecocks pack.', 'Shuttlecocks', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', ARRAY['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'], 999, 799, 39, 80, false, ARRAY['badminton', 'yonex'], '{"pack": "6"}'::jsonb),
    
    (cat_sports, 'Kore Dumbbells', 'kore-dumbbells-10kg', '10kg dumbbell set.', 'Dumbbells', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', ARRAY['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'], 1999, 1499, 74, 60, false, ARRAY['dumbbells', 'kore'], '{"weight": "10kg"}'::jsonb),
    
    (cat_sports, 'Fitkit Treadmill', 'fitkit-treadmill-ft200', 'Motorized treadmill.', 'Treadmill', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800', ARRAY['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800'], 34999, 27999, 1399, 15, false, ARRAY['treadmill', 'fitkit'], '{"motor": "2HP"}'::jsonb),
    
    (cat_sports, 'Resistance Bands', 'decathlon-resistance-bands', 'Set of 5 bands.', 'Resistance bands', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800', ARRAY['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800'], 999, 699, 34, 100, false, ARRAY['resistance', 'decathlon'], '{"bands": "5"}'::jsonb),
    
    (cat_sports, 'Nivia Basketball', 'nivia-basketball', 'Size 7 basketball.', 'Basketball', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'], 899, 699, 34, 65, false, ARRAY['basketball', 'nivia'], '{"size": "7"}'::jsonb),
    
    (cat_sports, 'Adidas Gym Gloves', 'adidas-training-gloves', 'Padded training gloves.', 'Gym gloves', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', ARRAY['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'], 1299, 999, 49, 85, false, ARRAY['gloves', 'adidas'], '{"feature": "Padded"}'::jsonb),
    
    (cat_sports, 'Skipping Rope', 'skipping-rope-counter', 'Digital counter rope.', 'Skipping rope', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800', ARRAY['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800'], 599, 399, 19, 120, false, ARRAY['skipping', 'rope'], '{"feature": "Counter"}'::jsonb)
    
    ON CONFLICT (slug) DO NOTHING;

    -- BOOKS & STATIONERY (11 products)
    INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, gallery_images, mrp, price, cashback_amount, stock_quantity, is_featured, tags, specifications) VALUES
    
    (cat_books, 'Atomic Habits', 'atomic-habits-book', 'Bestselling habits book by James Clear.', 'Habits book', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'], 599, 399, 19, 100, true, ARRAY['book', 'selfhelp'], '{"author": "James Clear"}'::jsonb),
    
    (cat_books, 'Psychology of Money', 'psychology-of-money', 'Personal finance book.', 'Finance book', 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800', ARRAY['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800'], 450, 299, 14, 95, false, ARRAY['book', 'finance'], '{"author": "Morgan Housel"}'::jsonb),
    
    (cat_books, 'Rich Dad Poor Dad', 'rich-dad-poor-dad', 'Financial education classic.', 'Finance book', 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800', ARRAY['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800'], 399, 249, 12, 110, false, ARRAY['book', 'finance'], '{"author": "Robert Kiyosaki"}'::jsonb),
    
    (cat_books, 'Ikigai', 'ikigai-book', 'Japanese philosophy book.', 'Philosophy book', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', ARRAY['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'], 399, 299, 14, 85, false, ARRAY['book', 'philosophy'], '{"author": "Héctor García"}'::jsonb),
    
    (cat_books, 'Classmate Notebook', 'classmate-notebook-a4', 'A4 ruled notebook 300 pages.', 'Notebook', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800', ARRAY['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800'], 199, 149, 7, 200, false, ARRAY['notebook', 'classmate'], '{"pages": "300"}'::jsonb),
    
    (cat_books, 'Parker Pen', 'parker-jotter-pen', 'Premium ballpoint pen.', 'Ballpoint pen', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800', ARRAY['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800'], 599, 449, 22, 120, false, ARRAY['pen', 'parker'], '{"type": "Ballpoint"}'::jsonb),
    
    (cat_books, 'Faber-Castell Pencils', 'fabercastell-pencils-48', '48 color pencils set.', 'Color pencils', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800', ARRAY['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800'], 999, 799, 39, 75, false, ARRAY['pencils', 'fabercastell'], '{"shades": "48"}'::jsonb),
    
    (cat_books, 'Staedtler Eraser', 'staedtler-eraser-pack', 'Premium erasers pack of 4.', 'Erasers', 'https://images.unsplash.com/photo-1587467512961-120760940315?w=800', ARRAY['https://images.unsplash.com/photo-1587467512961-120760940315?w=800'], 199, 149, 7, 150, false, ARRAY['eraser', 'staedtler'], '{"pack": "4"}'::jsonb),
    
    (cat_books, 'Casio Calculator', 'casio-fx991ex', 'Scientific calculator.', 'Calculator', 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800', ARRAY['https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800'], 1995, 1695, 84, 60, false, ARRAY['calculator', 'casio'], '{"functions": "552"}'::jsonb),
    
    (cat_books, 'Doms Sketch Pens', 'doms-sketch-pens-50', '50 colors sketch pens.', 'Sketch pens', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800', ARRAY['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800'], 499, 349, 17, 100, false, ARRAY['sketchpens', 'doms'], '{"colors": "50"}'::jsonb),
    
    (cat_books, 'Fevicol MR', 'fevicol-mr-1kg', 'Multipurpose adhesive 1kg.', 'Adhesive', 'https://images.unsplash.com/photo-1587467512961-120760940315?w=800', ARRAY['https://images.unsplash.com/photo-1587467512961-120760940315?w=800'], 299, 249, 12, 130, false, ARRAY['adhesive', 'fevicol'], '{"weight": "1kg"}'::jsonb)
    
    ON CONFLICT (slug) DO NOTHING;

END $$;

-- Verify results
SELECT 'Products added successfully!' as status,
       (SELECT COUNT(*) FROM product_categories) as categories,
       (SELECT COUNT(*) FROM products) as total_products;
