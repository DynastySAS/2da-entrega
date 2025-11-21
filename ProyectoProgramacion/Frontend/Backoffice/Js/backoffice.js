const API_URL = "../../Backend/Apis/backoffice.php";

// === Navegación entre secciones ===
function mostrar(id) {
  document.querySelectorAll(".content").forEach(div => {
    div.classList.remove("active");
  });
  const seccion = document.getElementById(id);
  if (seccion) seccion.classList.add("active");
}

// === Listar usuarios ===
async function listarUsuarios() {
  try {
    const res = await fetch(`${API_URL}/usuarios`, { method: "GET" });
    const data = await res.json();
    const contenedor = document.getElementById("lista-usuarios");
    contenedor.innerHTML = "";

    if (!data.data || !Array.isArray(data.data)) {
      contenedor.innerHTML = "<p>No hay usuarios.</p>";
      return;
  }
  data.data.forEach(usuario => {
    if (usuario.estado === "registrado" && usuario.pago_inicial ==="si")  {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
          <div class="card" id="card-usuario-${usuario.id_usuario}">
          <label>Nombre:</label>
          <input type="text" required name="nombre" id="nombre" value="${usuario.nombre}">

          <label>Apellido:</label>
          <input type="text" required name="apellido" id="apellido" value="${usuario.apellido}">

          <label>Id Usuario:</label>
          <input type="text" readonly name="id_usuario" id="id_usuario" value="${usuario.id_usuario}">

          <label>Usuario:</label>
          <input type="text" required name="usuario_login" id="usuario_login" value="${usuario.usuario_login}">

          <label>Número de documento:</label>
          <input type="number" name="id_persona" id="id_persona" value="${usuario.id_persona}">

          <label>Teléfono:</label>
          <input type="number" name="telefono" id="telefono" value="${usuario.telefono_cont}">

          <label>Email:</label>
          <input type="email" name="email" id="email" value="${usuario.email_cont}">

          <label>Estatus:</label>
            <select id="estatus-user" name="estatus-user" value="${usuario.estatus}">
              <option value="Al dia">Al dia</option>
              <option value="Atrasado">Atrasado</option>
            </select>

        <label>Rol</label>
          <select id="rol-user" name="rol-user" value="${usuario.rol}">
          <option value="cooperativista">Cooperativista</option>
          <option value="administrador">Administrador</option>
          </select>

    <button class="btn" onclick="actualizarInfoPersonal(${usuario.id_usuario})">
      Actualizar
    </button>
    <button class="eliminar" onclick="eliminarUsuario(${usuario.id_usuario})">
     Eliminar
    </button>
  </div>
        `;
        contenedor.appendChild(div);
    }
    });
  } catch (err) {
    console.error("Error cargando usuarios:", err);
  }
}

// === Listar pagos aprobados ===
async function listarPagos() {
  try {
    const res = await fetch(`${API_URL}/pagos`, { method: "GET" });
    const data = await res.json();
    const contenedor = document.getElementById("lista-pagos");
    contenedor.innerHTML = "";

    if (!data.data || !Array.isArray(data.data)) {
      contenedor.innerHTML = "<p>No hay pagos pendientes.</p>";
      return;
    }

    data.data.forEach(pago => {
      if (pago.estado === "aprobado") {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
          <div class="card" id="card-pago-${pago.id_pago}">
          <label>ID pago:</label>
          <input type="number" readonly name="id_pago" id="id_pago" value="${pago.id_pago}">

          <label>Monto:</label>
          <input type="number" name="monto" id="monto" min="0" value="${pago.monto}">

          <label>Id Usuario:</label>
          <input type="number" readonly name="id_usuario" id="id_usuario" value="${pago.id_usuario}">

          <label>Fecha de emisión:</label>
          <input type="date" name="fecha" id="fecha" value="${pago.fecha}">

          <label>Fecha de aprobación:</label>
          <input type="date" name="fecha_aprobado" id="fecha_aprobado" value="${pago.fecha_aprobado}">

          <label>Tipo de pago</label>
            <select id="tipo-pago" name="tipo-pago" value="${pago.tipo_pago}">
              <option value="mensual">Mensual</option>
              <option value="compensatorio">Compensatorio</option>
              <option value="inicial">Inicial</option>
            </select>

    <button class="btn" onclick="actualizarPago(${pago.id_pago})">
      Actualizar
    </button>
    <button class="eliminar" onclick="rechazarPago(${pago.id_pago})">
     Eliminar
    </button>
  </div>
        `;
        contenedor.appendChild(div);
      }
    });
  } catch (err) {
    console.error("Error cargando pagos:", err);
  }
}

// === Listar viviendas ===
async function listarViviendas() {
  try {
    const res = await fetch(`${API_URL}/viviendas`, { method: "GET" });
    const data = await res.json();
    const contenedor = document.getElementById("lista-viviendas");
    contenedor.innerHTML = "";

    if (!data.data || !Array.isArray(data.data)) {
      contenedor.innerHTML = "<p>No hay viviendas.</p>";
      return;
    }
    data.data.forEach(vivienda => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
          <div class="card" id="card-vivienda-${vivienda.id_vivienda}">
          <label>ID vivienda:</label>
          <input type="number" readonly name="id_vivienda" id="id_vivienda" value="${vivienda.id_vivienda}">

          <label>Calle:</label>
          <input type="text" name="calle" id="calle" value="${vivienda.calle}">

          <label>Nro Puerta:</label>
          <input type="number" name="nro_puerta" id="nro_puerta" value="${vivienda.nro_puerta}">

          <label>Nro de apt:</label>
          <input type="number" name="nro_apt" id="nro_apt" value="${vivienda.nro_apt}">

          <label>Id Usuario:</label>
          <input type="number" min="0" step="1" name="id_usuario" id="id_usuario" value="${vivienda.id_usuario}">

          <label>Estado:</label>
            <select id="estado-vivienda" name="estado-vivienda" value="${vivienda.estado}">
              <option value="Planificación">Planificación</option>
              <option value="Construcción">Construcción</option>
              <option value="Terminada">Terminada</option>
              <option value="Asignada">Asignada</option>
            </select>

    <button class="btn" onclick="actualizarVivienda(${vivienda.id_vivienda})">
      Actualizar
    </button>
    <button class="eliminar" onclick="eliminarVivienda(${vivienda.id_vivienda})">
     Eliminar
    </button>
  </div>
        `;
        contenedor.appendChild(div);
    });
  } catch (err) {
    console.error("Error cargando viviendas:", err);
  }
}

//completar
async function listarTrabajo() {
  try{
    const res = await fetch(`${API_URL}/trabajo`, { method: "GET" });
    const data = await res.json();
    const contenedor = document.getElementById("trabajo");
    contenedor.innerHTML = "";

    if (!data.data || !Array.isArray(data.data)) {
      contenedor.innerHTML = "<p>No hay trabajo.</p>";
      return;
    }
    data.data.forEach(trabajo => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
          <div class="card" id="card-trabajo-${trabajo.id_registro}">
          <label>ID registro de trabajo:</label>
          <input type="number" readonly name="id_registro" id="id_registro" value="${trabajo.id_registro}">

          <label>Semana:</label>
          <input type="number" min="0" step="1" max="52" name="semana" id="semana" value="${trabajo.semana}">

          <label>Horas cumplidas:</label>
          <input type="number" name="horas-cumplidas" step="0.25" min="0" max="200" id="horas-cumplidas" value="${trabajo.horas_cumplidas}">

          <label>Fecha de registro:</label>
          <input type="date" name="fch-registro" id="fch-registro" value="${trabajo.fch_registro}">

          <label>Id Usuario:</label>
          <input type="number" readonly name="id_usuario" id="id_usuario" value="${trabajo.id_usuario}">

          <label>Motivo:</label>
          <input type="text" name="motivo" id="motivo" value="${trabajo.motivo}">

    <button class="btn" onclick="actualizarTrabajo(${trabajo.id_registro})">
      Actualizar
    </button>
    <button class="eliminar" onclick="eliminarTrabajo(${trabajo.id_registro})">
     Eliminar
    </button>
  </div>
        `;
        contenedor.appendChild(div);
    });

  }catch{

  }
  
}

// === Listar usuarios pendientes ===
async function cargarUsuariosSolicitados() {
  try {
    const res = await fetch(`${API_URL}/usuarios`, { method: "GET" });
    const data = await res.json();
    const contenedor = document.getElementById("usuarios");
    contenedor.innerHTML = "";

    if (!data.data || !Array.isArray(data.data)) {
      contenedor.innerHTML = "<p>No hay usuarios pendientes.</p>";
      return;
  }
  data.data.forEach(usuario => {
  if (usuario.estado === "solicitado")  {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
          <div class="card">
    <h3>${usuario.nombre} ${usuario.apellido}</h3>
    <p><b>Id Usuario:</b> ${usuario.id_usuario}</p>
    <p><b>Email:</b> ${usuario.email_cont}</p>
    <p><b>Usuario:<b/> ${usuario.usuario_login}</p>
    <p><b>Estado:</b> ${usuario.estado}</p>
    <button class="btn" onclick="aprobarUsuario(${usuario.id_usuario})">
      Aprobar
    </button>
    <button class="eliminar" onclick="eliminarUsuario(${usuario.id_usuario})">
     Eliminar
    </button>
  </div>
        `;
        contenedor.appendChild(div);
      }
    });
  } catch (err) {
    console.error("Error cargando usuarios:", err);
  }
}

// === Listar pagos pendientes ===
async function cargarPagosSolicitados() {
  try {
    const res = await fetch(`${API_URL}/pagos`, { method: "GET" });
    const data = await res.json();
    const contenedor = document.getElementById("pagos");
    contenedor.innerHTML = "";

    if (!data.data || !Array.isArray(data.data)) {
      contenedor.innerHTML = "<p>No hay pagos pendientes.</p>";
      return;
    }

    data.data.forEach(pago => {
      if (pago.estado === "solicitado") {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
          <div class="card">
    <h3>Pago #${pago.id_pago}</h3>
    <p><b>Monto:</b> $${pago.monto}</p>
    <p><b>Usuario:</b> ${pago.id_usuario}</p>
    <p><b>Tipo de pago:</b> ${pago.tipo_pago}</p>
    <p><b>Estado:</b> ${pago.estado}</p>
    <button class="btn" onclick="aprobarPago(${pago.id_pago})">
      Aprobar
    </button>
    <button class="eliminar" onclick="rechazarPago(${pago.id_pago})">
      Rechazar
    </button>
  </div>
        `;
        contenedor.appendChild(div);
      }
    });
  } catch (err) {
    console.error("Error cargando pagos:", err);
  }
}

// === Actualizar datos de los usuarios ===
async function actualizarInfoPersonal(id) {
  try {
    const card = document.getElementById(`card-usuario-${id}`);

    const data = {
      id_usuario: card.querySelector("#id_usuario").value,
      nombre: card.querySelector("#nombre").value,
      apellido: card.querySelector("#apellido").value,
      usuario_login: card.querySelector("#usuario_login").value,
      id_persona: card.querySelector("#id_persona").value,
      telefono_cont: card.querySelector("#telefono").value,
      email_cont: card.querySelector("#email").value,
      rol: card.querySelector("#rol-user").value,
      estatus: card.querySelector("#estatus-user").value,
      estado: "registrado",
      pago_inicial: "si",
    };

    const res = await fetch(`${API_URL}/usuarios/${id}`, { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
   
    const result = await res.json();

    alert(result.message || (result.success ? "Perfil actualizado" : "Error al actualizar"));
    listarUsuarios();
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    alert("Error de conexión al actualizar perfil");
  }
}

// === Aprobar usuario ===
async function aprobarUsuario(id) {
  try {
    const resGet = await fetch(`${API_URL}/usuarios/${id}`, { method: "GET" });
    const usuario = await resGet.json();

    const user = usuario.data || usuario;

    const data = {
      ...user, 
      pago_inicial: "no",
      estado: "registrado",
    };

    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message || "Usuario aprobado correctamente");
    cargarUsuariosSolicitados();
    listarUsuarios();
  } catch (err) {
    console.error("Error al aprobar usuario:", err);
    alert("Error de conexión al aprobar usuario");
  }
}

// ===Eliminar Usuario===
async function eliminarUsuario(id) {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE"
  });
  const data = await res.json();
  alert(data.message);
  cargarUsuarios();
  listarUsuarios();
}

// === Actualizar pago ===
async function actualizarPago(id) {
  try {
  const card = document.getElementById(`card-pago-${id}`);

    const data = {
      id_pago: card.querySelector("#id_pago").value,
      monto: card.querySelector("#monto").value,
      fecha_aprobado: card.querySelector("#fecha_aprobado").value,
      fecha: card.querySelector("#fecha").value,
      id_usuario: card.querySelector("#id_usuario").value,
      tipo_pago: card.querySelector("#tipo-pago").value,
      estado: "aprobado",
    };

  const res = await fetch(`${API_URL}/pagos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

  const result = await res.json();

  alert(result.message || (result.success ? "Pago actualizado correctamente" : "Error al actualizar"));
  listarPagos();
  } catch (err){
      console.error("Error al actualizar pago:", err);
      alert("Error de conexión al actualizar pago");
  }
}

// === Aprobar pago ===
async function aprobarPago(id) {
  try {
    const resGetPago = await fetch(`${API_URL}/pagos/${id}`, { method: "GET" });
    const pago = await resGetPago.json();
    const p = pago.data || pago;
    const id_usuario_pago = p.id_usuario;

    const dataPago = { ...p, estado: "aprobado" };

    const resPago = await fetch(`${API_URL}/pagos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataPago),
    });

    const resultPago = await resPago.json();

    if (p.tipo_pago === "inicial") {
      const resGetUsuario = await fetch(`${API_URL}/usuarios/${id_usuario_pago}`, { method: "GET" });
      const usuario = await resGetUsuario.json();
      const u = usuario.data || usuario;

      const dataUsuario = { ...u, pago_inicial: "si" };

      const resUsuario = await fetch(`${API_URL}/usuarios/${u.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataUsuario),
      });
      alert(resUsuario.message || "Usuario actualizado con pago inicial");
      listarUsuarios();
    }
    alert(resultPago.message || "Pago aprobado correctamente");
    cargarPagos();
    listarPagos();

  } catch (err) {
    console.error("Error al aprobar pago:", err);
    alert("Error de conexión al aprobar pago");
  }
}


// ===Rechazar pago===
async function rechazarPago(id) {
  const res = await fetch(`${API_URL}/pagos/${id}`, {
    method: "DELETE"
  });
  const data = await res.json();
  alert(data.message);
  cargarPagos();
  listarPagos();
}

// === Actualizar vivienda ===
async function actualizarVivienda(id) {
  try {
  const card = document.getElementById(`card-vivienda-${id}`);

    const data = {
      id_vivienda: card.querySelector("#id_vivienda").value,
      calle: card.querySelector("#calle").value,
      nro_puerta: card.querySelector("#nro_puerta").value,
      nro_apt: card.querySelector("#nro_apt").value,
      id_usuario: card.querySelector("#id_usuario").value,
      estado: card.querySelector("#estado-vivienda").value,
    };

  const res = await fetch(`${API_URL}/viviendas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

  const result = await res.json();

  alert(result.message || (result.success ? "Vivienda actualizada correctamente" : "Error al actualizar"));
  listarViviendas();
  } catch (err){
      console.error("Error al actualizar vivienda:", err);
      alert("Error de conexión al actualizar vivienda");
  }
}

// === Eliminar vivienda ===
async function eliminarVivienda(id) {
  const res = await fetch(`${API_URL}/viviendas/${id}`, {
    method: "DELETE"
  });
  const data = await res.json();
  alert(data.message);
  listarViviendas();
}

// === Actualizar trabajo ===
async function actualizarTrabajo(id) {
  try {
  const card = document.getElementById(`card-trabajo-${id}`);

    const data = {
      id_registro: card.querySelector("#id_registro").value,
      semana: card.querySelector("#semana").value,
      horas_cumplidas: card.querySelector("#horas-cumplidas").value,
      fch_registro: card.querySelector("#fch-registro").value,
      id_usuario: card.querySelector("#id_usuario").value,
      motivo: card.querySelector("#motivo").value,
    };

  const res = await fetch(`${API_URL}/trabajo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

  const result = await res.json();

  alert(result.message || (result.success ? "Trabajo actualizado correctamente" : "Error al actualizar"));
  listarTrabajo();
  } catch (err){
      console.error("Error al actualizar trabajo:", err);
      alert("Error de conexión al actualizar trabajo");
  }
}

// === Eliminar trabajo ===
async function eliminarTrabajo(id) {
  const res = await fetch(`${API_URL}/trabajo/${id}`, {
    method: "DELETE"
  });
  const data = await res.json();
  alert(data.message);
  listarTrabajo();
}

// === Simulación de cierre de sesión ===
function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "../index.html";
}

// === Inicializar ===
window.onload = () => {
  cargarUsuariosSolicitados();
  cargarPagosSolicitados();
  listarUsuarios();
  listarPagos();
  listarViviendas();
  listarTrabajo();
};
