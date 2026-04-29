-- รัน SQL นี้ใน Supabase SQL Editor

-- ตาราง users
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  display_name text not null,
  role text not null default 'member' check (role in ('boss','member')),
  created_at timestamptz default now()
);

-- ตาราง tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  due_date date,
  qty int not null default 1,
  unit text not null default 'ชิ้น',
  assigned_to uuid references users(id),
  created_by uuid references users(id),
  status text not null default 'pending' check (status in ('pending','done')),
  note text,
  qty_done int default 0,
  submitted_at timestamptz,
  created_at timestamptz default now()
);

-- ตาราง push_subscriptions
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  role text,
  subscription text,
  created_at timestamptz default now(),
  unique(user_id)
);

-- เปิด RLS (Row Level Security) — ให้ API เข้าถึงได้
alter table users enable row level security;
alter table tasks enable row level security;
alter table push_subscriptions enable row level security;

-- Policy: อนุญาตให้ service role (API) เข้าถึงได้ทุกอย่าง
create policy "allow all for service" on users for all using (true);
create policy "allow all for service" on tasks for all using (true);
create policy "allow all for service" on push_subscriptions for all using (true);

-- สร้างบัญชีหัวหน้า (admin) — เปลี่ยน password ได้เลย
-- password: admin1234
insert into users (username, password_hash, display_name, role)
values ('admin', '$2a$10$rOzJqOPKNFXkMlvNy9ZxKuqHp.mxH.hOQFH.nfSxEYI8qVzPUyNKG', 'Admin หัวหน้า', 'boss');
