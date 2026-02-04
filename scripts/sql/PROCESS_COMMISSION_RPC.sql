-- RPC Procedure to process affiliate commission for shopping orders
CREATE OR REPLACE FUNCTION process_affiliate_commission(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
    v_affiliate_id UUID;
    v_commission_amount DECIMAL(12,2);
    v_product_name TEXT;
BEGIN
    -- 1. Get order details
    SELECT affiliate_user_id, affiliate_commission, p.name
    INTO v_affiliate_id, v_commission_amount, v_product_name
    FROM shopping_orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.id = p_order_id;

    -- 2. If no affiliate or commission is zero, exit
    IF v_affiliate_id IS NULL OR v_commission_amount <= 0 THEN
        RETURN;
    END IF;

    -- 3. Credit affiliate's wallet in agent_income
    UPDATE agent_income
    SET wallet = wallet + v_commission_amount,
        total_income = total_income + v_commission_amount
    WHERE user_id = v_affiliate_id;

    -- If no record in agent_income, create one
    IF NOT FOUND THEN
        INSERT INTO agent_income (user_id, wallet, total_income)
        VALUES (v_affiliate_id, v_commission_amount, v_commission_amount);
    END IF;

    -- 4. Log transaction in wallet_history
    INSERT INTO wallet_history (user_id, amount, status, income_type, description, reference_id, reference_type)
    VALUES (
        v_affiliate_id, 
        v_commission_amount, 
        'credit', 
        'affiliate_commission', 
        'Commission for ' || v_product_name, 
        p_order_id, 
        'shopping_order'
    );

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
