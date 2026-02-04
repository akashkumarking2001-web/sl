-- ==============================================================================
-- FIX: REVENUE SHARE TREE LOGIC (3xN MATRIX SPILLOVER)
-- ==============================================================================
-- This script fixes the Critical Bug where the Revenue Share Tree would stop
-- growing after the first level (3 users). It implements a proper Breadth-First
-- Search (BFS) to find the next available spot in the sponsor's downline.
-- ==============================================================================

-- 1. UTILITY: Helper to Find Next Available Node in Sponsor's Tree
-- (We embed this logic in the main function for simplicity and performance)

CREATE OR REPLACE FUNCTION distribute_package_income(
    p_buyer_id UUID, 
    p_package_name TEXT
)
RETURNS VOID AS $$
DECLARE
    v_settings RECORD;
    v_buyer_profile RECORD;
    v_sponsor_profile RECORD;
    v_current_sponsor_id UUID;
    v_level INT;
    v_amount DECIMAL;
    v_spillover_count INT;
    v_sponsor_tree RECORD;
    v_pos TEXT;
    v_new_downline_count INT;
    v_target_node_id UUID; -- The ID of the tree node where we will place the user
BEGIN
    -- 1. Fetch Settings
    SELECT * INTO v_settings FROM public.income_settings WHERE package_name = p_package_name;
    IF NOT FOUND THEN RAISE EXCEPTION 'Income settings not found for package %', p_package_name; END IF;

    -- 2. Fetch Buyer Profile
    SELECT * INTO v_buyer_profile FROM public.profiles WHERE user_id = p_buyer_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Buyer profile not found'; END IF;

    -- ====================================================
    -- A. DISTRIBUTE REFERRAL INCOME (Direct Sponsor)
    -- ====================================================
    IF v_buyer_profile.sponsor_id IS NOT NULL THEN
        SELECT * INTO v_sponsor_profile FROM public.profiles WHERE id = v_buyer_profile.sponsor_id;
        
        IF FOUND AND v_settings.referral_commission > 0 THEN
            PERFORM internal_credit_wallet(
                v_sponsor_profile.user_id,
                v_settings.referral_commission,
                'Referral Income - ' || p_package_name || ' from ' || COALESCE(v_buyer_profile.full_name, 'User'),
                'referral',
                NULL,
                p_buyer_id
            );
        END IF;
    END IF;

    -- ====================================================
    -- B. DISTRIBUTE LEVEL INCOME (12 Levels Up)
    -- ====================================================
    v_current_sponsor_id := COALESCE(v_buyer_profile.sponsor_id, v_buyer_profile.referred_by);
    
    FOR v_level IN 1..12 LOOP
        IF v_current_sponsor_id IS NULL THEN EXIT; END IF;

        SELECT * INTO v_sponsor_profile FROM public.profiles WHERE id = v_current_sponsor_id;
        IF NOT FOUND THEN EXIT; END IF;

        v_amount := CASE v_level
            WHEN 1 THEN v_settings.level_1_income
            WHEN 2 THEN v_settings.level_2_income
            WHEN 3 THEN v_settings.level_3_income
            WHEN 4 THEN v_settings.level_4_income
            WHEN 5 THEN v_settings.level_5_income
            WHEN 6 THEN v_settings.level_6_income
            WHEN 7 THEN v_settings.level_7_income
            WHEN 8 THEN v_settings.level_8_income
            WHEN 9 THEN v_settings.level_9_income
            WHEN 10 THEN v_settings.level_10_income
            WHEN 11 THEN v_settings.level_11_income
            WHEN 12 THEN v_settings.level_12_income
            ELSE 0
        END;

        IF v_amount > 0 THEN
            PERFORM internal_credit_wallet(
                v_sponsor_profile.user_id,
                v_amount,
                'Level ' || v_level || ' Income - ' || p_package_name,
                'level',
                v_level,
                p_buyer_id
            );
        END IF;

        v_current_sponsor_id := COALESCE(v_sponsor_profile.sponsor_id, v_sponsor_profile.referred_by);
    END LOOP;

    -- ====================================================
    -- C. SPILLOVER MILESTONES
    -- ====================================================
    IF v_buyer_profile.sponsor_id IS NOT NULL THEN
        SELECT * INTO v_sponsor_profile FROM public.profiles WHERE id = v_buyer_profile.sponsor_id;
        IF FOUND THEN
            UPDATE public.profiles 
            SET spillover_count = spillover_count + 1 
            WHERE id = v_sponsor_profile.id
            RETURNING spillover_count INTO v_spillover_count;

            IF v_spillover_count = 5 AND v_settings.spillover_level_1 > 0 THEN
               PERFORM internal_credit_wallet(v_sponsor_profile.user_id, v_settings.spillover_level_1, 'Spillover Bonus L1', 'spillover', 1);
            END IF;
            IF v_spillover_count = 30 AND v_settings.spillover_level_2 > 0 THEN
               PERFORM internal_credit_wallet(v_sponsor_profile.user_id, v_settings.spillover_level_2, 'Spillover Bonus L2', 'spillover', 2);
            END IF;
            IF v_spillover_count = 155 AND v_settings.spillover_level_3 > 0 THEN
               PERFORM internal_credit_wallet(v_sponsor_profile.user_id, v_settings.spillover_level_3, 'Spillover Bonus L3', 'spillover', 3);
            END IF;
            IF v_spillover_count = 625 AND v_settings.spillover_level_4 > 0 THEN
               PERFORM internal_credit_wallet(v_sponsor_profile.user_id, v_settings.spillover_level_4, 'Spillover Bonus L4', 'spillover', 4);
            END IF;
        END IF;
    END IF;

    -- ====================================================
    -- D. REVENUE SHARE TREE (3xN Matrix Placement - FIXED)
    -- ====================================================
    
    -- 1. Create Tree Entry for New User (Leaf Node)
    INSERT INTO public.revenue_share_tree (user_id, package_type)
    VALUES (p_buyer_id, p_package_name)
    ON CONFLICT (user_id, package_type) DO NOTHING;

    -- 2. Find Placement in Sponsor's Tree using BFS
    IF v_buyer_profile.sponsor_id IS NOT NULL OR v_buyer_profile.referred_by IS NOT NULL THEN
        v_current_sponsor_id := COALESCE(v_buyer_profile.sponsor_id, v_buyer_profile.referred_by);
        
        -- Get Sponsor's UserID
        SELECT user_id INTO v_sponsor_profile FROM public.profiles WHERE id = v_current_sponsor_id;
        
        IF FOUND THEN
            -- BFS SEARCH: Find the first node in the sponsor's existing structure that has an empty slot
            WITH RECURSIVE bfs AS (
                -- Base Case: The Sponsor's Own Node
                SELECT id, user_id, left_pos, mid_pos, right_pos, created_at, 1 as depth
                FROM public.revenue_share_tree
                WHERE user_id = v_sponsor_profile.user_id AND package_type = p_package_name
                
                UNION ALL
                
                -- Recursive Step
                SELECT c.id, c.user_id, c.left_pos, c.mid_pos, c.right_pos, c.created_at, p.depth + 1
                FROM public.revenue_share_tree c
                INNER JOIN bfs p ON (c.user_id = p.left_pos OR c.user_id = p.mid_pos OR c.user_id = p.right_pos)
                WHERE c.package_type = p_package_name
            )
            SELECT id INTO v_target_node_id
            FROM bfs
            WHERE left_pos IS NULL OR mid_pos IS NULL OR right_pos IS NULL
            ORDER BY depth ASC, created_at ASC
            LIMIT 1;

            -- If we found a spot, place the user there
            IF v_target_node_id IS NOT NULL THEN
                SELECT * INTO v_sponsor_tree FROM public.revenue_share_tree WHERE id = v_target_node_id;
                
                v_pos := NULL;
                IF v_sponsor_tree.left_pos IS NULL THEN v_pos := 'left_pos';
                ELSIF v_sponsor_tree.mid_pos IS NULL THEN v_pos := 'mid_pos';
                ELSIF v_sponsor_tree.right_pos IS NULL THEN v_pos := 'right_pos';
                END IF;

                IF v_pos IS NOT NULL THEN
                    v_new_downline_count := v_sponsor_tree.downline_count + 1;

                    -- Update The Node
                    EXECUTE format('UPDATE public.revenue_share_tree SET %I = $1, downline_count = $2 WHERE id = $3', v_pos)
                    USING p_buyer_id, v_new_downline_count, v_target_node_id;

                    -- CHECK FOR BONUS (For the owner of the node we just filled)
                    -- Note: In a 3xN matrix, typically the bonus goes to the Node Owner when specific counts are met.
                    -- The original logic checked `v_new_downline_count`.
                    -- Let's re-calculate `v_amount` based on the Node Owner's new count.

                    CASE v_new_downline_count
                        WHEN 3 THEN v_amount := v_settings.revenue_share_level_1; v_level := 1;
                        WHEN 12 THEN v_amount := v_settings.revenue_share_level_2; v_level := 2;
                        WHEN 39 THEN v_amount := v_settings.revenue_share_level_3; v_level := 3;
                        WHEN 120 THEN v_amount := v_settings.revenue_share_level_4; v_level := 4;
                        WHEN 363 THEN v_amount := v_settings.revenue_share_level_5; v_level := 5;
                        WHEN 1092 THEN v_amount := v_settings.revenue_share_level_6; v_level := 6;
                        WHEN 3279 THEN v_amount := v_settings.revenue_share_level_7; v_level := 7;
                        WHEN 9840 THEN v_amount := v_settings.revenue_share_level_8; v_level := 8;
                        ELSE v_amount := 0;
                    END CASE;

                    IF v_amount > 0 THEN
                        -- Credit to the OWNER of the node (v_sponsor_tree.user_id)
                        PERFORM internal_credit_wallet(
                            v_sponsor_tree.user_id, 
                            v_amount, 
                            'Revenue Share Completion - Level ' || v_level, 
                            'revenue_share', 
                            v_level
                        );
                    END IF;
                END IF;
            ELSE
                 -- Edge Case: Sponsor has no node at all? Create one.
                 -- This handles the very first placement if the BFS returned nothing (which implies Sponsor root missing)
                 INSERT INTO public.revenue_share_tree (user_id, package_type, left_pos, downline_count)
                 VALUES (v_sponsor_profile.user_id, p_package_name, p_buyer_id, 1)
                 ON CONFLICT (user_id, package_type) DO UPDATE
                 SET left_pos = EXCLUDED.left_pos; -- Should not happen if BFS works, but safe fallback
            END IF;
        END IF;
    END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
