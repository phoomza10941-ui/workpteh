import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { usePush } from '../lib/usePush'

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('th-TH') : '' }

export default function MemberPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [tab, setTab] = useState('tasks')
  const [tasks, setTasks] = useState([])
  const [submitting, setSubmitting] = useState(null)
  const [note, setNote] = useState('')
  const [qtyDone, setQtyDone] = useState(1)
  const [msg, setMsg] = useState('')
  const [pushAsked, setPushAsked] = useState(false)

  usePush(token)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = JSON.parse(localStorage.getItem('user') || 'null')
    if (!t || !u) { router.push('/'); return }
    if (u.role === 'boss') { router.push('/boss'); return }
    setToken(t); setUser(u)
  }, [])

  const apiFetch = useCallback(async (url, opts = {}) => {
    const t = localStorage.getItem('token')
    const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}`, ...opts.headers } })
    return res.json()
  }, [])

  useEffect(() => { if (token) loadTasks() }, [token])

  async function loadTasks() {
    const d = await apiFetch('/api/tasks')
    if (d.tasks) setTasks(d.tasks)
  }

  async function doSubmit(task) {
    setMsg('')
    const d = await apiFetch(`/api/tasks/${task.id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ note, qty_done: Number(qtyDone) })
    })
    if (d.ok) {
      setMsg('success:ส่งงานสำเร็จ! หัวหน้าได้รับแจ้งเตือนแล้ว')
      setSubmitting(null); setNote(''); setQtyDone(1)
      loadTasks()
    } else setMsg(d.error || 'เกิดข้อผิดพลาด')
  }

  const pending = tasks.filter(t => t.status === 'pending')
  const done = tasks.filter(t => t.status === 'done')

  async function enablePush() {
    setPushAsked(true)
    if (!('serviceWorker' in navigator)) return
    await Notification.requestPermission()
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="topbar-title">OrderWork</div>
          <div className="topbar-sub">สวัสดี {user?.display_name}</div>
        </div>
        <button onClick={() => { localStorage.clear(); router.push('/') }} style={{ background: 'rgba(255,255,255,.2)', color: '#fff', padding: '6px 12px', fontSize: 12 }}>ออก</button>
      </div>
      <div className="nav">
        {[['tasks',`งานของฉัน (${pending.length})`],['done','งานเสร็จแล้ว']].map(([k,l]) => (
          <button key={k} className={`nav-item${tab===k?' active':''}`} onClick={() => { setTab(k); setMsg('') }}>{l}</button>
        ))}
      </div>

      <div className="page">
        {!pushAsked && Notification && Notification.permission === 'default' && (
          <div className="push-banner">
            <span>เปิดรับแจ้งเตือนงานใหม่</span>
            <button onClick={enablePush} style={{ background: '#185FA5', color: '#fff', padding: '6px 12px', fontSize: 12 }}>เปิด</button>
          </div>
        )}
        {msg && <div className={msg.startsWith('success:') ? 'success-msg' : 'error-msg'} style={{ marginBottom: 12 }}>{msg.replace('success:','')}</div>}

        {tab === 'tasks' && (
          <>
            <div className="stat-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="stat-box"><div className="num" style={{ color: '#854F0B' }}>{pending.length}</div><div className="lbl">งานที่รอส่ง</div></div>
              <div className="stat-box"><div className="num" style={{ color: '#3B6D11' }}>{done.length}</div><div className="lbl">ส่งแล้ว</div></div>
            </div>
            {!pending.length && <div className="empty">ไม่มีงานค้างอยู่ เยี่ยม!</div>}
            {pending.map(t => (
              <div key={t.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{t.title}<span className="qty-pill">{t.qty} {t.unit}</span></div>
                    {t.description && <div style={{ fontSize: 13, color: '#666', marginTop: 3 }}>{t.description}</div>}
                    {t.due_date && <div style={{ fontSize: 12, color: '#A32D2D', marginTop: 3 }}>กำหนดส่ง: {fmtDate(t.due_date)}</div>}
                  </div>
                  <span className="badge badge-pending">รอส่ง</span>
                </div>
                {submitting === t.id ? (
                  <div>
                    <label>จำนวนที่ทำเสร็จ</label>
                    <div className="form-row" style={{ marginBottom: 10 }}>
                      <input type="number" value={qtyDone} onChange={e => setQtyDone(e.target.value)} min="1" max={t.qty} style={{ width: 80 }} />
                      <span style={{ fontSize: 13, color: '#888' }}>จาก {t.qty} {t.unit}</span>
                    </div>
                    <label>หมายเหตุ</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="สรุปสิ่งที่ทำ..." style={{ height: 60, marginBottom: 10, resize: 'vertical' }} />
                    <div className="form-row">
                      <button className="btn-primary" style={{ flex: 1 }} onClick={() => doSubmit(t)}>ยืนยันส่งงาน</button>
                      <button className="btn-outline" onClick={() => setSubmitting(null)}>ยกเลิก</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-primary" onClick={() => { setSubmitting(t.id); setQtyDone(t.qty); setNote('') }}>ส่งงาน</button>
                )}
              </div>
            ))}
          </>
        )}

        {tab === 'done' && (
          <div className="card">
            {!done.length && <div className="empty">ยังไม่มีงานที่ส่งแล้ว</div>}
            {done.map(t => (
              <div key={t.id} className="task-row">
                <div className="task-meta">
                  <div className="task-title">{t.title}<span className="qty-pill">{t.qty_done || t.qty}/{t.qty} {t.unit}</span></div>
                  <div className="task-sub">{t.note}{t.submitted_at ? ' · ส่งเมื่อ ' + new Date(t.submitted_at).toLocaleDateString('th-TH') : ''}</div>
                </div>
                <span className="badge badge-done">เสร็จ</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
