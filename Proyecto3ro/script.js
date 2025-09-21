// ====================
// Mostrar secciones (index.html)
// ====================
function mostrar(seccion) {
  const secciones = ['inicio', 'nosotros', 'proyectos', 'contacto', 'login', 'registro','info-personal','hs-semanales','subir-comprobante-pago'];
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
      switch(data.user.rol){
        case "administrador":
          window.location.href = "backoffice.html";
          break;
        case "cooperativista":
          window.location.href = "cooperativista.html";
          break;
        default:
          window.location.href = "index.html";
          break;  
      }
    } else {
      alert(data.msg || "Credenciales inválidas");
    }
  } catch (err) {
    alert(err.message);
  }
  return false;
}

// ====================
// Cargar panel (cooperativista.html)
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
  const idpField = document.getElementById("id_persona"); 
  const nomField = document.getElementById("nombre"); 
  const apField = document.getElementById("apellido");
  const usField = document.getElementById("usuario_login");
  const ceField = document.getElementById("email");
  if (nomField) nomField.value = usuario.nombre || "";
  if (apField) apField.value = usuario.apellido ||"";
  if (idField) idField.value = usuario.id_usuario || "";
  if (usField) usField.value = usuario.usuario_login
  if (idpField) idpField.value = usuario.id_persona || "";
  if (telField) telField.value = usuario.telefono_cont || "";
  if (ceField) ceField.value = usuario.email_cont || "";

  // Rellenar hidden id_usuario en formularios de horas y pagos si existen
  const hiddenHoras = document.getElementById("horas-id-usuario");
  const hiddenPago = document.getElementById("pago-id-usuario");
  if (hiddenHoras) hiddenHoras.value = usuario.id_usuario || "";
  if (hiddenPago) hiddenPago.value = usuario.id_usuario || "";
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
}

async function cargarInfoPersonal() {
  if (!document.getElementById("nombre")) return;
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.id_usuario) return;
    const res = await fetch("Apis/obtener_datos.php?id_usuario=" + usuario.id_usuario);
    const data = await res.json();

    if (data.ok && data.user) {
      document.getElementById("nombre").value = data.user.nombre;
      document.getElementById("apellido").value = data.user.apellido;
      document.getElementById("usuario_login").value = data.user.usuario_login;
      document.getElementById("id_persona").value = data.user.id_persona || "";
      document.getElementById("telefono").value = data.user.telefono_cont || "";
      document.getElementById("email").value = data.user.email_cont || "";
    }
  } catch (err) {
    console.error("Error al cargar info personal:", err);
  }
}

// Cargar al abrir la página
cargarInfoPersonal();

const formInfo = document.getElementById("form-info");
if (formInfo) {
  formInfo.removeEventListener("submit", handleInfoSubmit);
  formInfo.addEventListener("submit", handleInfoSubmit);
}

const formHoras = document.getElementById("form-horas");
if (formHoras) {
  formHoras.removeEventListener("submit", handleHorasSubmit);
  formHoras.addEventListener("submit", handleHorasSubmit);
}

const formPago = document.getElementById("form-pago");
if (formPago) {
  formPago.removeEventListener("submit", handlePagoSubmit);
  formPago.addEventListener("submit", handlePagoSubmit);
}

async function handleInfoSubmit(e) {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const datos = {
    id_usuario: usuario.id_usuario,
    usuario_login: document.getElementById("usuario_login").value,
    id_persona: document.getElementById("id_persona").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
  };

  try {
    const res = await fetch("Apis/guardar_datos.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const respuesta = await res.json();

    if (respuesta.ok) {
      alert("Información actualizada correctamente");
    } else {
      alert("Error: " + (respuesta.message || "No se pudo guardar"));
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Informacion en uso");
  }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("datos-usuario")) {
    cargarPanel();
  }
  });

async function handleHorasSubmit(e) {
  e.preventDefault();
  const form = e.target;
  // Asegurarse de rellenar id_usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario || !usuario.id_usuario) {
    alert("Usuario no autenticado.");
    window.location.href = "index.html";
    return false;
  }
  // poner id en el form (campo hidden)
  const hidden = form.querySelector('input[name="id_usuario"]');
  if (hidden) hidden.value = usuario.id_usuario;

  try {
    const data = await postForm("Apis/registrar_horas.php", form);
    alert(data.msg || "Horas registradas");
    form.reset();
  } catch (err) {
    alert(err.message || "Error al registrar horas");
  }
  return false;
}

async function handlePagoSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario || !usuario.id_usuario) {
    alert("Usuario no autenticado.");
    window.location.href = "index.html";
    return false;
  }
  const hidden = form.querySelector('input[name="id_usuario"]');
  if (hidden) hidden.value = usuario.id_usuario;

  try {
    const data = await postForm("Apis/subir_pago.php", form);
    alert(data.msg || "Pago registrado");
    form.reset();
  } catch (err) {
    alert(err.message || "Error al registrar pago");
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
});

// ====================
// Cargar solicitudes de pago
// ====================
async function cargarPagos() {
  const contenedor = document.getElementById("lista-pagos");
  contenedor.innerHTML = "<p>Cargando solicitudes de pago...</p>";

  try {
    const res = await fetch("Apis/obtener_solicitud_pago.php");
    const data = await res.json();

    if (!data.ok) {
      contenedor.innerHTML = "<p>No se pudieron obtener los pagos.</p>";
      return;
    }

    if (data.pagos.length === 0) {
      contenedor.innerHTML = "<p>No hay solicitudes de pago pendientes.</p>";
      return;
    }

    contenedor.innerHTML = ""; // limpiar

    data.pagos.forEach(pago => {
      const card = document.createElement("div");
      card.className = "card-pago";

      card.innerHTML = `
        <h3>Solicitud #${pago.id_pago}</h3>
        <p><strong>ID usuario:</strong> ${pago.id_usuario}</p>
        <p><strong>Tipo de pago:</strong> ${pago.tipo_pago}</p>
        <p><strong>Monto:</strong> $${pago.monto}</p>
        <p><strong>Fecha:</strong> ${pago.fecha}</p>
        <p><strong>Estado:</strong> ${pago.estado}</p>
        <button class="btn" onclick="aprobarPago(${pago.id_pago})">Aprobar</button>
      `;

      contenedor.appendChild(card);
    });
  } catch (err) {
    contenedor.innerHTML = "<p>Error al cargar los pagos.</p>";
    console.error(err);
  }
}

// ====================
// Aprobar un pago
// ====================
async function aprobarPago(id_pago) {
  if (!confirm("¿Seguro que deseas aprobar este pago?")) return;

  try {
    const res = await fetch("Apis/aprobar_pago.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pago })
    });

    const data = await res.json();
    if (data.ok) {
      alert("Pago aprobado correctamente");
      cargarPagos(); 
    } else {
      alert("Error: " + (data.msg || "No se pudo aprobar el pago"));
    }
  } catch (err) {
    alert("Error de conexión al servidor" );
    console.error(err);
  }
}

// ====================
// Inicializar
// ====================
document.addEventListener("DOMContentLoaded", cargarPagos);