const { Pool } = require('pg');
async function m() {
  const p = new Pool({connectionString: 'postgresql://neondb_owner:npg_34hJdzaoBqAQ@ep-silent-art-ayy6kwrx.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'});
  await p.query(`
    INSERT INTO admin_users (id, username, email, password, full_name, role, is_active, last_login, created_at, updated_at) VALUES 
    (6, 'Praise Uzu', 'support@falcusmedia.com', '$argon2id$v=19$m=65536,t=3,p=2$hDN8mZRohezoyYgCYZ+PBA$AjS5WNsL16DPNS9XbjbWBkoI05JLf38Q8XZ9FhvT1nw', 'Praise Uzu', 'admin', true, '2026-02-09 15:50:09.467342', '2026-02-09 15:11:26.995943', '2026-02-09 15:11:26.995943'), 
    (3, 'Falcus ', 'falcus@falcusmedia.com', '$argon2id$v=19$m=65536,t=3,p=2$vZNRmQ/mQ/F5NVFBK+Ri3Q$oICUClTeT/nkB+rV4gbRZc6Idbb7uxXSUn1ht64osak', 'Praise Ebube Uzu', 'admin', true, '2026-04-28 09:02:12.753254', '2026-02-02 18:49:44.503333', '2026-04-28 09:02:12.753254'), 
    (4, 'raynix001', 'nix@gmail.com', '$argon2id$v=19$m=65536,t=3,p=2$DgohjHif8BPJR0kIf48tjg$o9goGLi5zG1N0kzdLetrLZV/aJO5o0rVXYGBJ0RVOaQ', 'Raynix', 'admin', true, '2026-02-10 08:51:52.195542', '2026-02-03 11:25:22.362646', '2026-02-03 11:25:22.362646'), 
    (9, 'Gideon Olawoye', 'olawoyegideonayomide@falcusmedia.com', '$argon2id$v=19$m=65536,t=3,p=2$FCUv3pNBWgchzcKaqHNvhA$6hZgDce2pm7itGAbrd8QVsbDFG55nIqbHSP3E8dCuBc', 'Gideon Olawoye Ayomide', 'admin', true, '2026-08-11 07:32:09.299711', '2026-02-26 15:01:05.483389', '2026-08-11 07:32:09.299711'), 
    (1, 'Raynix@001', 'raymondakhamiojie@gmail.com', '$argon2id$v=19$m=65536,t=3,p=2$u0aHAlL6jHrhfLNLYitEEw$1hsL3JJkkjFYJxAjBVnHh8zLWzkU8xmDrt7hLYqLkgc', 'Raymond Akhamiojie', 'admin', true, '2026-08-17 22:39:57.94942', '2026-02-01 01:05:32.393514', '2026-08-17 22:39:57.94942') 
    ON CONFLICT DO NOTHING;
  `);
  console.log('Admin users inserted!');
  await p.end();
}
m().catch(console.error);
