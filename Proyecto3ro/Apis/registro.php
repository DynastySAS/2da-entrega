<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/db.php";

// Soportar tanto JSON (fetch) como form-data
$input = file_get_contents('php://input');
$body = json_decode($input, true);
if (!is_array($body)) $body = $_POST;

$nombre   = trim($body["nombre"] ?? "");
$apellido = trim($body["apellido"] ?? "");
$emailRaw = trim($body["email"] ?? "");
$usuario  = trim($body["usuario"] ?? "");
$pwd      = (string)($body["password"] ?? "");
$id_doc   = trim($body["id_persona"] ?? "");

// Normalizar y manejar email vacío
$usuario = strtolower($usuario);
$email   = $emailRaw === "" ? null : strtolower($emailRaw);
$id_doc  = $id_doc === "" ? null : $id_doc; // si está vacío lo guardamos como NULL

// Validación básica
if (!$usuario || !$pwd || !$nombre || !$apellido) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Faltan datos obligatorios."]);
  exit;
}

$hash = password_hash($pwd, PASSWORD_DEFAULT);

// Comprobar existencia (si email es NULL solo chequea usuario)
if ($email === null) {
  $stmt = $mysqli->prepare("SELECT 1 FROM usuario WHERE usuario_login = ? LIMIT 1");
  $stmt->bind_param("s", $usuario);
} else {
  $stmt = $mysqli->prepare("SELECT 1 FROM usuario WHERE usuario_login = ? OR email_cont = ? LIMIT 1");
  $stmt->bind_param("ss", $usuario, $email);
}
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al preparar la consulta."]);
  exit;
}
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
  $stmt->close();
  http_response_code(409);
  echo json_encode(["ok" => false, "msg" => "Usuario o email ya existen."]);
  exit;
}
$stmt->close();

// Insertar (columna contrasena según tu versión)
$stmt = $mysqli->prepare("
  INSERT INTO usuario (id_persona, usuario_login, nombre, apellido, email_cont, contrasena)
  VALUES (?, ?, ?, ?, ?, ?)
");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al preparar insert."]);
  exit;
}
$stmt->bind_param("ssssss", $id_doc, $usuario, $nombre, $apellido, $email, $hash);

if ($stmt->execute()) {
  echo json_encode(["ok" => true, "msg" => "Cuenta creada"]);
} else {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al crear usuario", "error" => $stmt->error]);
}
$stmt->close();
