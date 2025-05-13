import '../css/sidebar.style.css'
const container = document.createElement("div");

export const loadSidebar = () => {
  return (
    container.innerHTML = `

<div class="sidebar hidden" id="sidebar">
  <div class="x-icon">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" id="close-icon"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
  </div>
  <div class="sidebar-content">
    <div class="heading-group">
      <div class="meteor">
        <img src="/meteor.svg"/>
      </div>
      <div class="heading">
        <h2>cosmic</h2>
        <h1>solutions</h1>
      </div>
      <div class="heading-label">
        <h3 title="this site is in testing phase">beta</h3>
      </div>
    </div>
    <div class="actions-container">
      <div class="actions-top">
        <span>*these features are not available in this version</span>
        <button type="button" disabled>settings</button>
        <button type="button" disabled>faq</button>
      </div>
      <div class="actions-bottom">
        <button id="logout">Log Out</button>
      </div>
      <div class="watermark">
        <a href="https://misterhportfolio.vercel.app/" target="_blank">developed by: thehandsomedev</a>
      </div>
    </div>
  </div>
</div> 
`

  )
}

export const sidebarActions = () => {

  const sidebar = document.getElementById("sidebar");
  const closeIcon = document.getElementById("close-icon");
  const logOutBtn = document.getElementById("logout");

  closeIcon?.addEventListener("click", () => {
    sidebar?.classList.add("hidden")
  });

  logOutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    window.location.href = "/"
  })
}
