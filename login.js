import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { usePush } from '../lib/usePush'

const COLORS = [['#EEEDFE','#534AB7'],['#E1F5EE','#0F6E56'],['#FAEEDA','#854F0B'],['#FBEAF0','#993556'],['#E6F1FB','#185FA5'],['#EAF3DE','#3B6D11']]
const PROG = ['#534AB7','#0F6E56','#854F0B','#993556','#185FA5','#3B6D11']

function initials(n) { return n ? n.slice(0,2).toUpperCase() : '?' }
function colorOf(i) { return COLORS[i % COLORS.length] }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('th-TH') : '' }

export default function BossPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [tab, setTab] = useState('assign')
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [due, setDue] = useState('')
  const [qty, setQty] = useState(1)
  const [unit, setUnit] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  const [newUsername, setNewUsername] = useState('')
  const [newDisplay, setNewDisplay] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newRole, setNewRole] = useState('member')

  usePush(token)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = JSON.parse(localStorage.getItem('user') || 'null')
    if (!t || !u || u.role !== 'boss') { router.push('/'); return }
    setToken(t); setUser(u)
  }, [])

  const apiFetch = useCallback(async (url, opts = {}) => {
    const t = localStorage.getItem('token')
    const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}`, ...opts.headers } })
    return res.json()
  }, [])

  useEffect(() => { if (token) { loadTasks(); loadMembers() } }, [token])

  async function loadTasks() {
    const d = await apiFetch('/api/tasks')
    if (d.tasks) setTasks(d.tasks)
  }
  async function loadMembers() {
    const d = await apiFetch('/api/users')
    if (d.users) setMembers(d.users.filter(u => u.role === 'member'))
  }

  function toggleId(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function doAssign() {
    if (!title.trim()) { setMsg('กรุณาใส่ชื่องาน'); return }
    if (!selectedIds.length) { setMsg('กรุณาเลือกผู้รับงาน'); return }
    setLoading(true); setMsg('')
    const d = await apiFetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description: desc, due_date: due, qty: Number(qty), unit: unit || 'ชิ้น', assigned_to_ids: selectedIds })
    })
    setLoading(false)
    if (d.tasks) {
      setMsg('success:สั่งงานสำเร็จ!')
      setTitle(''); setDesc(''); setDue(''); setQty(1); setUnit(''); setSelectedIds([])
      loadTasks()
    } else setMsg(d.error || 'เกิดข้อผิดพลาด')
  }

  async function addUser() {
    if (!newUsername || !newPass || !newDisplay) { setMsg('กรุณากรอกข้อมูลให้ครบ'); return }
    setLoading(true)
    const d = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: newUsername, password: newPass, display_name: newDisplay, role: newRole })
    })
    setLoading(false)
    if (d.user) {
      setMsg('success:เพิ่มสมาชิกสำเร็จ')
      setNewUsername(''); setNewPass(''); setNewDisplay(''); setNewRole('member')
      loadMembers()
    } else setMsg(d.error || 'เกิดข้อผิดพลาด')
  }

  const done = tasks.filter(t => t.status === 'done')
  const pending = tasks.filter(t => t.status === 'pending')
  const totalQty = tasks.reduce((s, t) => s + (t.qty || 0), 0)
  const doneQty = done.reduce((s, t) => s + (t.qty_done || 0), 0)

  const allUsers = members
  function memberTasks(uid) { return tasks.filter(t => t.assigned_to === uid) }

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="topbar-title">OrderWork</div>
          <div className="topbar-sub">สวัสดี {user?.display_name} · หัวหน้า</div>
        </div>
        <button onClick={() => { localStorage.clear(); router.push('/') }} style={{ background: 'rgba(255,255,255,.2)', color: '#fff', padding: '6px 12px', fontSize: 12 }}>ออก</button>
      </div>
      <div className="nav">
        {[['assign','สั่งงาน'],['track','ติดตาม'],['reports','รายงาน'],['team','จัดการทีม']].map(([k,l]) => (
          <button key={k} className={`nav-item${tab===k?' active':''}`} onClick={() => { setTab(k); setMsg(''); if(k==='track') loadTasks() }}>{l}</button>
        ))}
      </div>

      <div className="page">
        {msg && <div className={msg.startsWith('success:') ? 'success-msg' : 'error-msg'} style={{ marginBottom: 12 }}>{msg.replace('success:','')}</div>}

        {tab === 'assign' && (
          <div className="card">
            <label>ชื่องาน</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="เช่น จัดทำรายงานยอดขาย" />
            <label>รายละเอียด</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="รายละเอียดงาน..." style={{ height: 70, resize: 'vertical' }} />
            <label>วันกำหนดส่ง</label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)} />
            <label>จำนวนงาน</label>
            <div className="form-row" style={{ marginBottom: 12 }}>
              <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1" style={{ width: 80 }} />
              <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="หน่วย เช่น ชิ้น, ชุด, หน้า" style={{ flex: 1 }} />
            </div>
            <label>มอบหมายให้</label>
            <div className="chip-grid">
              {members.map((m, i) => {
                const [bg, fg] = colorOf(i)
                return (
                  <div key={m.id} className={`chip${selectedIds.includes(m.id) ? ' on' : ''}`} onClick={() => toggleId(m.id)}>
                    <div className="avatar" style={{ background: bg, color: fg, width: 28, height: 28, fontSize: 11, margin: '0 auto 4px' }}>{initials(m.display_name)}</div>
                    {m.display_name}
                  </div>
                )
              })}
              {!members.length && <div style={{ fontSize: 13, color: '#aaa', gridColumn: '1/-1' }}>ยังไม่มีสมาชิก — ไปเพิ่มที่แท็บ "จัดการทีม"</div>}
            </div>
            <button className="btn-primary" onClick={doAssign} disabled={loading}>{loading ? 'กำลังสั่งงาน...' : 'สั่งงาน'}</button>
          </div>
        )}

        {tab === 'track' && (
          <>
            <div className="stat-grid">
              <div className="stat-box"><div className="num">{tasks.length}</div><div className="lbl">ทั้งหมด</div></div>
              <div className="stat-box"><div className="num" style={{ color: '#3B6D11' }}>{done.length}</div><div className="lbl">เสร็จแล้ว</div></div>
              <div className="stat-box"><div className="num" style={{ color: '#854F0B' }}>{pending.length}</div><div className="lbl">กำลังทำ</div></div>
              <div className="stat-box"><div className="num" style={{ color: '#185FA5', fontSize: 18 }}>{doneQty}/{totalQty}</div><div className="lbl">จำนวนรวม</div></div>
            </div>
            <div className="card">
              {!tasks.length && <div className="empty">ยังไม่มีงาน</div>}
              {tasks.map(t => (
                <div key={t.id} className="task-row">
                  <div className="task-meta">
                    <div className="task-title">{t.title}<span className="qty-pill">{t.qty} {t.unit}</span></div>
                    <div className="task-sub">{t.assigned_to_user?.display_name}{t.due_date ? ' · ' + fmtDate(t.due_date) : ''}{t.note ? ' · ' + t.note : ''}</div>
                  </div>
                  <span className={`badge badge-${t.status}`}>{t.status === 'done' ? 'เสร็จ' : 'รอ'}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'reports' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {members.map((m, i) => {
                const mt = memberTasks(m.id)
                const md = mt.filter(t => t.status === 'done').length
                const tq = mt.reduce((s, t) => s + (t.qty || 0), 0)
                const dq = mt.filter(t => t.status === 'done').reduce((s, t) => s + (t.qty_done || 0), 0)
                const pct = mt.length ? Math.round(md / mt.length * 100) : 0
                return (
                  <div key={m.id} className="card" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div className="avatar" style={{ background: colorOf(i)[0], color: colorOf(i)[1], width: 30, height: 30, fontSize: 11 }}>{initials(m.display_name)}</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{m.display_name}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#888' }}>{md}/{mt.length} งาน · {dq}/{tq} จำนวน</div>
                    <div className="prog-bar"><div className="prog-fill" style={{ width: pct + '%', background: PROG[i % PROG.length] }} /></div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 16 }}>
              {done.slice(0, 10).map(t => (
                <div key={t.id} className="notif-item">
                  <strong>{t.assigned_to_user?.display_name}</strong> ส่งงาน "{t.title}" — {t.qty_done || t.qty}/{t.qty} {t.unit}
                  {t.note && <div style={{ marginTop: 3, fontSize: 12 }}>{t.note}</div>}
                  <div className="notif-time">{t.submitted_at ? new Date(t.submitted_at).toLocaleString('th-TH') : ''}</div>
                </div>
              ))}
              {!done.length && <div className="empty">ยังไม่มีรายงานงานสำเร็จ</div>}
            </div>
          </>
        )}

        {tab === 'team' && (
          <>
            <div className="card">
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>เพิ่มสมาชิกใหม่</div>
              <label>ชื่อที่แสดง</label>
              <input value={newDisplay} onChange={e => setNewDisplay(e.target.value)} placeholder="เช่น สมชาย" />
              <label>ชื่อผู้ใช้ (username)</label>
              <input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="เช่น somchai" />
              <label>รหัสผ่าน</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="รหัสผ่าน" />
              <label>ตำแหน่ง</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ marginBottom: 12 }}>
                <option value="member">ลูกน้อง</option>
                <option value="boss">หัวหน้า</option>
              </select>
              <button className="btn-primary" onClick={addUser} disabled={loading}>{loading ? 'กำลังเพิ่ม...' : 'เพิ่มสมาชิก'}</button>
            </div>
            <div className="card">
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>สมาชิกในทีม ({members.length} คน)</div>
              {members.map((m, i) => {
                const [bg, fg] = colorOf(i)
                return (
                  <div key={m.id} className="task-row">
                    <div className="avatar" style={{ background: bg, color: fg }}>{initials(m.display_name)}</div>
                    <div className="task-meta">
                      <div className="task-title">{m.display_name}</div>
                      <div className="task-sub">@{m.username}</div>
                    </div>
                    <span className="badge badge-member">ลูกน้อง</span>
                  </div>
                )
              })}
              {!members.length && <div className="empty">ยังไม่มีสมาชิก</div>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
