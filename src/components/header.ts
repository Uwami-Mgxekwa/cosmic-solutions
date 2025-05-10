import '../css/header.style.css'

const container = document.createElement("div");

export const loadHeader = (title: string) => {
  return (
    container.innerHTML = `
<header>
  <div>
    <h1>cosmic solutions</h1>
    <h2>${title}</h2>
  </div>
  <div>
    <div class="bars-icon">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="bars-icon"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
      </div>
  </div>
</header>
`
  )
}

export const headerActions = () => {
  const barsIcon = document.getElementById("bars-icon");
  const sidebar = document.getElementById("sidebar");

  barsIcon?.addEventListener("click", () => {
    sidebar?.classList.remove("hidden");
  })
}
