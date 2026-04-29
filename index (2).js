* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f5;
  color: #1a1a1a;
  font-size: 15px;
}

a { text-decoration: none; color: inherit; }

input, textarea, select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: #fff;
  outline: none;
  transition: border .15s;
}
input:focus, textarea:focus, select:focus { border-color: #185FA5; }

button {
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  transition: background .15s, opacity .15s;
}
button:disabled { opacity: .5; cursor: not-allowed; }

.btn-primary {
  background: #185FA5;
  color: #fff;
  padding: 11px 20px;
  width: 100%;
}
.btn-primary:hover:not(:disabled) { background: #0C447C; }

.btn-outline {
  background: transparent;
  border: 1px solid #ddd;
  color: #444;
  padding: 8px 16px;
}
.btn-outline:hover { background: #f0f0f0; }

.card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 20px;
  font-weight: 500;
}
.badge-pending { background: #FAEEDA; color: #854F0B; }
.badge-done    { background: #EAF3DE; color: #3B6D11; }
.badge-boss    { background: #E6F1FB; color: #185FA5; }
.badge-member  { background: #EEEDFE; color: #534AB7; }

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #f0f0f0;
  color: #555;
  margin: 2px;
}

label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
  margin-top: 12px;
}
label:first-child { margin-top: 0; }

.form-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 1.25rem;
}
.stat-box {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}
.stat-box .num { font-size: 26px; font-weight: 600; }
.stat-box .lbl { font-size: 11px; color: #888; margin-top: 2px; }

.nav {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
}
.nav-item {
  padding: 14px 16px;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  background: none;
  border-radius: 0;
}
.nav-item.active { color: #185FA5; border-bottom-color: #185FA5; font-weight: 500; }
.nav-item:hover:not(.active) { color: #444; }

.topbar {
  background: #185FA5;
  color: #fff;
  padding: 0 1rem;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.topbar-title { font-size: 16px; font-weight: 600; }
.topbar-sub { font-size: 12px; opacity: .8; }

.page { max-width: 680px; margin: 0 auto; padding: 1rem; }

.empty { text-align: center; padding: 2rem; color: #aaa; font-size: 14px; }

.notif-item {
  background: #EAF3DE;
  border: 1px solid #C0DD97;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: #3B6D11;
  margin-bottom: 8px;
}
.notif-time { font-size: 11px; opacity: .7; margin-top: 3px; }

.prog-bar { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-top: 6px; }
.prog-fill { height: 100%; border-radius: 3px; transition: width .3s; }

.chip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 6px; margin-bottom: 12px; }
.chip {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 6px;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  color: #555;
  transition: .15s;
  background: #fff;
}
.chip.on { border-color: #185FA5; background: #E6F1FB; color: #0C447C; }

.task-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.task-row:last-child { border-bottom: none; }
.task-meta { flex: 1; min-width: 0; }
.task-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.task-sub { font-size: 12px; color: #888; margin-top: 2px; }

.qty-pill { font-size: 11px; background: #E6F1FB; color: #185FA5; padding: 2px 7px; border-radius: 20px; margin-left: 5px; }

.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
}
.login-box {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  border: 1px solid #eee;
}
.login-logo { text-align: center; margin-bottom: 1.5rem; }
.login-logo h1 { font-size: 20px; color: #185FA5; }
.login-logo p { font-size: 13px; color: #888; margin-top: 4px; }

.error-msg { background: #FCEBEB; color: #A32D2D; border-radius: 8px; padding: 9px 12px; font-size: 13px; margin-top: 10px; }
.success-msg { background: #EAF3DE; color: #3B6D11; border-radius: 8px; padding: 9px 12px; font-size: 13px; margin-top: 10px; }

.push-banner {
  background: #E6F1FB;
  border: 1px solid #B5D4F4;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #0C447C;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
