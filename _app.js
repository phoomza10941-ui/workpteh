import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'เข้าสู่ระบบไม่ได้'); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user.role === 'boss') router.push('/boss')
      else router.push('/member')
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">
          <h1>OrderWork</h1>
          <p>ระบบสั่งงานและติดตามทีม</p>
        </div>
        <form onSubmit={handleLogin}>
          <label>ชื่อผู้ใช้</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" autoComplete="username" required />
          <label>รหัสผ่าน</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" autoComplete="current-password" required />
          <div style={{ marginTop: 16 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>
          {error && <div className="error-msg">{error}</div>}
        </form>
      </div>
    </div>
  )
}
