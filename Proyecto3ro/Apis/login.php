<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/db.php";

$input = file_get_contents('php://input');
$body = json_decode($input, true);
if (!is_array($body)) $body = $_POST;

$identificador = trim($body["identificador"] ?? "");
$pwd = (string)($body["password"] ?? "");

if (!$identificador || !$pwd) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Faltan credenciales."]);
  exit;
}

$stmt = $mysqli->prepare("
  SELECT id_usuario, id_persona, usuario_login, nombre, apellido, email_cont, telefono_cont, rol, contrasena
  FROM usuario
  WHERE usuario_login = ? OR email_cont = ?
  LIMIT 1
");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al preparar consulta."]);
  exit;
}
$stmt->bind_param("ss", $identificador, $identificador);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($pwd, $user["contrasena"])) {
  http_response_code(401);
  echo json_encode(["ok" => false, "msg" => "Usuario/contraseña incorrectos."]);
  exit;
}

// No devolver la contraseña
unset($user["contrasena"]);

echo json_encode([
  "ok" => true,
  "msg" => "Login correcto",
  "user" => $user
]);
