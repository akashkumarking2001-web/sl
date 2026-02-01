import { supabase } from "@/integrations/supabase/client";

export type AuditEntity = 'product' | 'course' | 'episode' | 'settings' | 'user' | 'order' | 'ad' | 'affiliate';
export type AuditAction = 'create' | 'update' | 'delete' | 'toggle_status' | 'status_update';

export const logAudit = async (
    action: AuditAction,
    entityType: AuditEntity,
    entityId?: string,
    details?: any
) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from("audit_logs").insert({
            user_id: user.id,
            action,
            entity_type: entityType,
            entity_id: entityId,
            details: details || {}
        });

        if (error) console.error("Audit Log Failure:", error);
    } catch (err) {
        console.error("Audit log exception:", err);
    }
};
