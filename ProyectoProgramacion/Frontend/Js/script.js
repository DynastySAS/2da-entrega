// === Navegación ===
function mostrar(id) {
  document.querySelectorAll(".content, .login-box, .register-box").forEach((div) => {
    div.classList.remove("active");
  });
  const seccion = document.getElementById(id);
  if (seccion) seccion.classList.add("active");
}

// === Toggle password ===
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
}

// === Login ===
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    identificador: form.identificador.value,
    password: form.password.value,
  };

  try {
      const res = await fetch(`../Backend/Apis/usuario.php/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({})); // por si no hay body válido
    // aca hay que poner el if de pago_inicial === "si"
    if (res.ok && result.success) {
      
      const usuario = result.usuario;
      localStorage.setItem("usuario", JSON.stringify(usuario));
      if(usuario.pago_inicial === 'no'){
        window.location.href = "pagoInicial.html"
      } else {
      window.location.href =
        usuario.rol === "administrador"
          ? "Backoffice/backoffice.html"
          : "cooperativista.html";
      }
    } else {
      alert(result.message || "Usuario no encontrado o pendiente de aprobación");
    }
  } catch (err) {
    console.error("Error en login:", err);
    alert("Error de conexión con el servidor");
  }
  return false;
}

// === Registro ===
async function handleRegisterForm(e) {
  e.preventDefault();
  const form = e.target;
  try {
    const data = {
    nombre: form.querySelector("#nombre").value,
    apellido: form.querySelector("#apellido").value,
    email_cont: form.querySelector("#email_cont").value,
    usuario_login: form.querySelector("#usuario_login").value,
    id_persona: form.querySelector("#id_persona").value,
    password: form.querySelector("#registro-password").value,
  };

    const res = await fetch("../Backend/Apis/usuario.php/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      alert("Registro de usuario solicitado con éxito");
      mostrar("login");
    } else {
      alert(result.message || "Error al registrarse");
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión");
  }
  return false;
}

// === Panel de usuario ===
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (document.getElementById("form-info") && usuario) {
    cargarEstadoCuenta(usuario.id_usuario);
    cargarInfoPersonal(usuario.id_usuario);
    document.getElementById("form-info").addEventListener("submit", actualizarInfoPersonal);
    document.getElementById("form-pago").addEventListener("submit", registrarPago);
    document.getElementById("form-horas").addEventListener("submit", registrarHoras);
  }
});

// === Cargar datos ===
async function cargarInfoPersonal(id) {
  try {
    const res = await fetch(`../Backend/Apis/cooperativa.php/usuario/${id}`, { method: "GET" });
    const data = await res.json();

    if (data.success && data.data) {
      const u = data.data;
      document.getElementById("nombre").value = u.nombre || "";
      document.getElementById("apellido").value = u.apellido || "";
      document.getElementById("id_usuario").value = u.id_usuario || "";
      document.getElementById("usuario_login").value = u.usuario_login || "";
      document.getElementById("id_persona").value = u.id_persona || "";
      document.getElementById("telefono").value = u.telefono_cont || "";
      document.getElementById("email").value = u.email_cont || "";

      document.getElementById("horas-id-usuario").value = u.id_usuario || "";
      document.getElementById("pago-id-usuario").value = u.id_usuario || "";
    } else {
      console.warn("Usuario no encontrado o error:", data.message);
    }
  } catch (err) {
    console.error("Error al cargar info personal:", err);
  }
}

// === Actualizar perfil ===
async function actualizarInfoPersonal(e) {
  e.preventDefault();
  const id = document.getElementById("id_usuario").value;
  
  if(window.location.href.endsWith("pagoInicial.html")){
    pagoInicial = "no";
  } else {
    pagoInicial = "si";
  }
  const pago_inicial = pagoInicial;
  
  try {
    
  const data = {
    id_usuario: document.getElementById("id_usuario").value,
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    usuario_login: document.getElementById("usuario_login").value,
    id_persona: document.getElementById("id_persona").value,
    telefono_cont: document.getElementById("telefono").value,
    email_cont: document.getElementById("email").value,
    rol: "cooperativista",
    estatus: "Al dia",
    estado: "registrado",
    pago_inicial: pago_inicial,
  };

    const res = await fetch(`../Backend/Apis/usuario.php/actualizarInfo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    alert(result.message || (result.success ? "Perfil actualizado" : "Error al actualizar"));
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    alert("Error de conexión al actualizar perfil");
  }
}

function semana(fecha = new Date()) {
  const primerDia = new Date(fecha.getFullYear(), 0, 1);
  const diasPasados = Math.floor((fecha - primerDia) / (24 * 60 * 60 * 1000));
  return Math.ceil((diasPasados + primerDia.getDay() + 1) / 7);
}

// === Registrar horas ===
async function registrarHoras(e) {
  e.preventDefault();
  const form = e.target;

  const idUsuario = document.getElementById("horas-id-usuario")?.value || form["id_usuario"]?.value;
  const semana = (d => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  return Math.ceil((((d - new Date(Date.UTC(d.getUTCFullYear(),0,1))) / 86400000) + 1)/7);
})(new Date());

  const data = {
    id_usuario: idUsuario,
    horas_cumplidas: form["horas"] ? form["horas"].value : null,
    motivo: form["motivo"] ? form["motivo"].value : null,
    semana: semana,
    id_registro: null
  };

  try {
    const res = await fetch(`../Backend/Apis/cooperativa.php/trabajo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    alert(json.message || (json.success ? "Horas registradas" : "Error al registrar horas"));
  } catch (err) {
    console.error("Error registrar horas:", err);
    alert("Error de red al registrar horas");
  }
}

// === Registrar pago ===
async function registrarPago(e) {
  e.preventDefault();
  const form = e.target;
  try {
    const idUsuario = document.getElementById("id_usuario").value;
    console.log("ID usuario:", idUsuario);
    const data = {
    id_usuario: idUsuario,
    tipo_pago: form["tipo-pago"] ? form["tipo-pago"].value : null,
    monto: form["monto"] ? form["monto"].value : null,
  };
    const res = await fetch("../Backend/Apis/cooperativa.php/pago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    alert(json.message || (json.success ? "Pago registrado" : "Error al registrar pago"));
  } catch (err) {
    console.error("Error registrar pago:", err);
    alert("Error de red al registrar pago");
  }
}

async function cargarEstadoCuenta(id) {
  try {
    const resU = await fetch(`../Backend/Apis/cooperativa.php/usuario/${id}`, { method: "GET" });
      const dataU = await resU.json();
      const u = dataU.data;
      document.getElementById("estatus").value = u.estatus || "";
        
    const resV = await fetch(`../Backend/Apis/cooperativa.php/vivienda/${id}`, { method: "GET" });   
    const dataV = await resV.json();
    const v = dataV.data;
    document.getElementById("direccion").value = `${v.calle || ""} ${v.nro_puerta || ""}${v.nro_apt > 0 ? " - Apto " + v.nro_apt : ""}`;
    document.getElementById("estado-vivienda").value = v.estado || "";

      
    
      console.warn("Error:", dataV.message);
    
  } catch (err) {
    console.error("Error al cargar estado de cuenta:", err);
  }
}

// === Cerrar sesión ===
function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
}
