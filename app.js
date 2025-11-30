(function(){

const demoKey = "bk_demo_users";

function getPage(){
  const q = new URLSearchParams(location.search);
  return (q.get("page") || "home").toLowerCase();
}

function renderShell(title, mainHtml, sideHtml){
  document.title = "Bachat Khata — " + title;

  document.getElementById("mainContent").innerHTML = `
    <div class="page-shell">
      <section class="hero">
        <div class="card">${mainHtml}</div>
      </section>
      <aside class="side">${sideHtml}</aside>
    </div>
  `;
  bindActions();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
}

function mask(email){
  if(!email) return "";
  const [a,b] = email.split("@");
  return a[0] + "***@" + b;
}

function loadUsers(){
  return JSON.parse(localStorage.getItem(demoKey) || "{}");
}
function saveUsers(u){
  localStorage.setItem(demoKey, JSON.stringify(u));
}

function showModal(msg){
  document.getElementById("modalContent").innerHTML = msg;
  document.getElementById("backdrop").style.display = "flex";
}
function closeModal(){
  document.getElementById("backdrop").style.display = "none";
}

document.getElementById("closeModal").onclick = closeModal;

/* --- Pages --- */
function home(){
  renderShell("Home", `
    <h2>Practical Security Learning</h2>
    <p class="muted">This is a fictional banking UI demo.</p>

    <div class="card" style="margin-top:14px;">
      <h3>Features</h3>
      <ul>
        <li>Guided phishing simulation</li>
        <li>Interactive dashboard</li>
        <li>Local-only login system</li>
      </ul>
      <a href="?page=signup"><button class="btn btn-primary">Create Demo Account</button></a>
    </div>
  `, `
    <div class="card">
      <h3>Quick Login</h3>
      <input id="quickEmail" class="input" placeholder="demo@example.com">
      <input id="quickPass" class="input" type="password" placeholder="password">
      <button id="quickLoginBtn" class="btn btn-primary" style="margin-top:10px;">Login</button>
    </div>
  `);
}

function login(){
  renderShell("Login", `
    <h2>Login</h2>
    <input id="loginEmail" class="input" type="email" placeholder="email@example.com">
    <input id="loginPass" class="input" type="password" placeholder="password">
    <button id="loginBtn" class="btn btn-primary" style="margin-top:10px;">Login</button>
  `, `
    <div class="card"><h3>Need Help?</h3></div>
  `);
}

function signup(){
  renderShell("Signup", `
    <h2>Create Demo Account</h2>
    <input id="signupEmail" class="input" type="email" placeholder="email@example.com">
    <input id="signupPass" class="input" type="password" placeholder="password">
    <button id="signupBtn" class="btn btn-primary" style="margin-top:10px;">Create</button>
  `, `<div class="card"><h3>Note</h3>Do not use real passwords.</div>`);
}

function dashboard(user){
  renderShell("Dashboard", `
    <h2>Hello, ${escapeHtml(user.name)}</h2>
    <p>Account: <b>${user.acct}</b></p>
    <h3>Balance: ₹${user.balance}</h3>
  `, `
    <div class="card">
      <h3>Email</h3>
      ${mask(user.email)}
    </div>
  `);
}

/* --- Event Actions --- */
function bindActions(){

  // Quick Login
  const quick = document.getElementById("quickLoginBtn");
  if(quick){
    quick.onclick = () => {
      const email = document.getElementById("quickEmail").value.trim();
      const pass = document.getElementById("quickPass").value;
      const users = loadUsers();

      if(!users[email]) return showModal("User not found!");

      if(users[email].password !== pass) return showModal("Wrong password!");

      sessionStorage.setItem("bk_current", email);
      showModal("Login successful! Redirecting...");
      setTimeout(()=>location.href="?page=dashboard",800);
    };
  }

  // Regular Login
  const loginBtn = document.getElementById("loginBtn");
  if(loginBtn){
    loginBtn.onclick = () => {
      const email = document.getElementById("loginEmail").value.trim();
      const pass = document.getElementById("loginPass").value;

      const users = loadUsers();

      if(!users[email]) return showModal("User not found!");
      if(users[email].password !== pass) return showModal("Wrong password!");

      sessionStorage.setItem("bk_current", email);
      showModal("Login successful! Redirecting...");
      setTimeout(()=>location.href="?page=dashboard",800);
    };
  }

  // Signup
  const signupBtn = document.getElementById("signupBtn");
  if(signupBtn){
    signupBtn.onclick = () => {
      const email = document.getElementById("signupEmail").value.trim();
      const pass = document.getElementById("signupPass").value;

      const users = loadUsers();
      if(users[email]) return showModal("Account already exists!");

      users[email] = {
        name: "Demo User",
        email,
        password: pass,
        acct: "SAV-" + (1000 + Math.floor(Math.random()*9000)),
        balance: 12000
      };

      saveUsers(users);
      showModal("Account created! Redirecting...");
      sessionStorage.setItem("bk_current", email);
      setTimeout(()=>location.href="?page=dashboard",800);
    };
  }
}

/* --- Router --- */
function router(){
  const p = getPage();

  if(p==="home") home();
  else if(p==="login") login();
  else if(p==="signup") signup();
  else if(p==="dashboard"){
    const email = sessionStorage.getItem("bk_current");
    const users = loadUsers();
    if(!email || !users[email]) return location.href="?page=login";
    dashboard(users[email]);
  }
  else home();
}

/* Cookie */
document.getElementById("acceptCookie").onclick =
document.getElementById("dismissCookie").onclick = 
()=> document.getElementById("cookieBar").style.display="none";

router();

})();
