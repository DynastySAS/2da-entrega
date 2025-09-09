// ====================
// Mostrar secciones (index.html)
// ====================
function mostrar(seccion) {
  const secciones = ['inicio', 'nosotros', 'proyectos', 'contacto', 'login', 'registro'];
  secciones.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) elem.classList.remove('active');
  });
  const target = document.getElementById(seccion);
  if (target) target.classList.add('active');
}

// ====================
// Toggle mostrar/ocultar contraseña
// ====================
function togglePassword(id) {
  const input = document.getElementById(id);
  const icon = document.getElementById('icon-' + id);
  if (!input || !icon) return;

  if (input.type === "password") {
    input.type = "text";
    icon.innerHTML = `
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zM2 12a10 10 0 0 0 20 0 10 10 0 0 0-20 0z"/>
      <circle cx="12" cy="12" r="3.5" />
    `;
  } else {
    input.type = "password";
    icon.innerHTML = `
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
      <circle cx="12" cy="12" r="2.5"/>
    `;
  }
}

// ====================
// Utilidad para enviar formularios (envía JSON)
// ====================
async function postForm(url, formElement) {
  const formData = new FormData(formElement);
  const obj = Object.fromEntries(formData.entries());

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || "Error en el servidor");
  return data;
}

// ====================
// Registro
// ====================
async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;

  try {
    const data = await postForm("Apis/registro.php", form);
    alert(data.msg || "Registro exitoso");
    form.reset();
    mostrar('login');
  } catch (err) {
    alert(err.message);
  }
  return false;
}

// ====================
// Login (usuario o correo)
// ====================
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;

  try {
    const data = await postForm("Apis/login.php", form);

    if (data.ok) {
      // Guardamos usuario completo en localStorage
      // data.user tiene: id_usuario, id_persona, usuario_login, nombre, apellido, email_cont, telefono_cont, rol
      localStorage.setItem("usuario", JSON.stringify(data.user));
      alert(`¡Bienvenido, ${data.user.nombre || data.user.usuario_login}!`);
      window.location.href = "infopersonal.html";
    } else {
      alert(data.msg || "Credenciales inválidas");
    }
  } catch (err) {
    alert(err.message);
  }
  return false;
}

// ====================
// Cargar panel (infopersonal.html)
// ====================
function cargarPanel() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "index.html";
    return;
  }

  const cont = document.getElementById("datos-usuario");
  if (cont) {
    cont.innerHTML = `
      <table border="1" cellpadding="5">
        <tr><th>ID Usuario</th><td>${usuario.id_usuario}</td></tr>
        <tr><th>ID Persona</th><td>${usuario.id_persona || ""}</td></tr>
        <tr><th>Usuario</th><td>${usuario.usuario_login}</td></tr>
        <tr><th>Nombre</th><td>${usuario.nombre}</td></tr>
        <tr><th>Apellido</th><td>${usuario.apellido}</td></tr>
        <tr><th>Email</th><td>${usuario.email_cont || ""}</td></tr>
        <tr><th>Teléfono</th><td>${usuario.telefono_cont || ""}</td></tr>
        <tr><th>Rol</th><td>${usuario.rol || ""}</td></tr>
      </table>
    `;
  }

  // Rellenar el formulario para actualizar datos
  const idField = document.getElementById("id_usuario");
  const telField = document.getElementById("telefono");
  if (idField) idField.value = usuario.id_usuario || "";
  if (telField) telField.value = usuario.telefono_cont || "";
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
}

// ====================
// Guardar datos (infopersonal.html)
// ====================
async function guardarDatos(e) {
  e.preventDefault();
  const form = e.target;

  try {
    const data = await postForm("Apis/guardar_datos.php", form);
    if (data.ok && data.user) {
      // Actualizamos localStorage con los datos nuevos
      localStorage.setItem("usuario", JSON.stringify(data.user));
      alert(data.msg || "Datos actualizados");
      cargarPanel();
    } else {
      alert(data.msg || "No se pudieron actualizar los datos");
    }
  } catch (err) {
    alert(err.message);
  }
  return false;
}

// ====================
// Inicializar
// ====================
document.addEventListener("DOMContentLoaded", () => {
  // Si estamos en index.html
  if (document.getElementById("inicio")) {
    mostrar("inicio");
    document.getElementById("login-form")?.addEventListener("submit", handleLogin);
    document.getElementById("register-form")?.addEventListener("submit", handleRegister);
  }

  // Si estamos en infopersonal.html
  if (document.getElementById("datos-usuario")) {
    cargarPanel();
    document.getElementById("datos-form")?.addEventListener("submit", guardarDatos);
  }
});
