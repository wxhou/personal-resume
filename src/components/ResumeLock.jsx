import { useState } from 'react'
import './ResumeLock.css'

export default function ResumeLock({ onSubmit, loading, error }) {
  const [password, setPassword] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (loading || !password) return
    onSubmit(password)
  }

  return (
    <main className="resume-lock">
      <form className="resume-lock__card" onSubmit={submit}>
        <div className="resume-lock__head">
          <h1 className="resume-lock__title">简历已加密</h1>
          <span className="resume-lock__seal" aria-hidden="true">莓</span>
        </div>
        <p className="resume-lock__desc">输入访问密码后查看简历。</p>
        <label className="resume-lock__label" htmlFor="resume-password">访问密码</label>
        <input
          id="resume-password"
          className="resume-lock__input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="off"
          spellCheck="false"
          autoFocus
          disabled={loading}
        />
        {error && <p className="resume-lock__error" role="alert">{error}</p>}
        <button className="resume-lock__submit" type="submit" disabled={loading || !password}>
          {loading ? '解密中…' : '解锁'}
        </button>
      </form>
    </main>
  )
}
