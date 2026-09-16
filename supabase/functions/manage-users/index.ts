import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const allowedRoles = new Set(["consulta", "operacional", "financeiro", "admin"]);
const adminRoles = new Set(["admin", "administrador", "owner", "proprietario"]);
const ownerEmail = "jedsonpc@hotmail.com";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function role(value: unknown) { return String(value || "").toLowerCase(); }
function profile(user: any) {
  if (String(user.email || "").toLowerCase() === ownerEmail) return { role: "admin", active: true };
  const access = user.app_metadata?.app_access?.dhplay;
  return access ? { role: role(access.role) || "consulta", active: access.active !== false } : null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authorization = request.headers.get("Authorization") || "";
    if (!url || !anonKey || !serviceKey || !authorization) return json({ error: "Configuração de autenticação incompleta." }, 401);
    const body = await request.json().catch(() => ({}));
    if (String(body.appId || "").toLowerCase() !== "dhplay") return json({ error: "Aplicativo não identificado." }, 400);
    const authClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
    const token = authorization.replace(/^Bearer\s+/i, "");
    const { data: callerData, error: callerError } = await authClient.auth.getUser(token);
    if (callerError || !callerData.user) return json({ error: "Sessão inválida ou expirada." }, 401);
    const callerProfile = profile(callerData.user);
    if (!callerProfile?.active || !adminRoles.has(callerProfile.role)) return json({ error: "Apenas administradores podem gerenciar usuários." }, 403);
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const action = String(body.action || "");

    if (action === "invite") {
      const email = String(body.email || "").trim().toLowerCase();
      const name = String(body.name || "").trim();
      const userRole = role(body.role || "operacional");
      if (!email || !name || !allowedRoles.has(userRole)) return json({ error: "Nome, e-mail ou perfil inválido." }, 400);
      const { data: listed, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (listError) throw listError;
      const existing = listed.users.find((item) => String(item.email || "").toLowerCase() === email);
      if (existing) {
        const currentAccess = existing.app_metadata?.app_access || {};
        const { error } = await admin.auth.admin.updateUserById(existing.id, { user_metadata: { ...(existing.user_metadata || {}), name, full_name: name }, app_metadata: { ...(existing.app_metadata || {}), app_access: { ...currentAccess, dhplay: { role: userRole, active: true } } } });
        if (error) throw error;
        return json({ existing: true, user: { user_id: existing.id, email, name, role: userRole, active: true } });
      }
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { data: { name, full_name: name }, redirectTo: String(body.redirectTo || "") });
      if (error) throw error;
      if (data.user) {
        const currentAccess = data.user.app_metadata?.app_access || {};
        const { error: updateError } = await admin.auth.admin.updateUserById(data.user.id, { app_metadata: { ...(data.user.app_metadata || {}), app_access: { ...currentAccess, dhplay: { role: userRole, active: true } } } });
        if (updateError) throw updateError;
      }
      return json({ user: { user_id: data.user?.id, email, name, role: userRole, active: true } });
    }

    if (action === "list") {
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) throw error;
      return json({ users: data.users.filter((item) => profile(item)).map((item) => { const p = profile(item)!; return { user_id: item.id, email: item.email || "", name: item.user_metadata?.name || item.user_metadata?.full_name || item.email || "", role: p.role, active: p.active, last_sign_in_at: item.last_sign_in_at || null }; }) });
    }
    return json({ error: "Operação desconhecida." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
});
