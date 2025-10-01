import React from 'react'

export default function App() {
  return (
    <main className="viewport">
      <article className="card" role="region" aria-label="Perfil y enlaces">
        <header className="header">
          <img className="avatar" src="/profile.jpg" alt="Foto de perfil de Luiciana" width="72" height="72" loading="eager" decoding="async" />
          <div>
            <h1 className="title">Luiciana Salas</h1>
            <p className="handle"> @luiciana-salas</p>
          </div>
        </header>

        <p className="bio">TEN ACCESO A TODOS MIS LINKS 💙💎 | ESCRÍBEME PARA INFO 💯</p>
        <p className="meta" aria-label="Cumpleaños y ubicación">🎂 23 de septiembre · 🇨🇷 Costa Rica</p>

        <nav className="links" aria-label="Enlaces">
          <a className="btn whatsapp" href="https://wa.link/z8v7rd" target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp">
            <span className="dot" aria-hidden="true"></span><span>WhatsApp</span>
          </a>
          <a className="btn facebook" href="https://facebook.com/Luicianasalas" target="_blank" rel="noopener noreferrer" aria-label="Abrir Facebook">
            <span className="dot" aria-hidden="true"></span><span>Facebook</span>
          </a>
          <a className="btn telegram" href="https://t.me/qFUw3I5SKg4N2U5" target="_blank" rel="noopener noreferrer" aria-label="Abrir Telegram">
            <span className="dot" aria-hidden="true"></span><span>Telegram</span>
          </a>
          <a className="btn onlyfans" href="https://onlyfans.com/luicianasalas" target="_blank" rel="noopener noreferrer" aria-label="Abrir OnlyFans">
            <span className="dot" aria-hidden="true"></span><span>OnlyFans</span>
          </a>
        </nav>

        <p className="footer">© 2025</p>
      </article>
    </main>
  )
}