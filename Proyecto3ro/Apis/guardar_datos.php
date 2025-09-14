<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/db.php";

$input = file_get_contents('php://input');
$body = json_decode($input, true);
if (!is_array($body)) $body = $_POST;

$id_persona = intval($body["id_persona"] ?? 0);
$id_usuario = intval($body["id_usuario"] ?? 0);
$telefono   = trim($body["telefono"] ?? "");
$email        = trim($body["email"] ?? "");
$usuario_login = trim($body["usuario_login"] ?? "");

if ($id_usuario <= 0) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Falta id_usuario."]);
  exit;
}

$stmt = $mysqli->prepare("UPDATE usuario  SET id_persona = ?, telefono_cont = ?, usuario_login = ?, email_cont = ?
  WHERE id_usuario = ?
");

if (!$stmt) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al preparar el UPDATE."]);
  exit;
}

$stmt->bind_param("isssi", $id_persona, $telefono, $usuario_login, $email, $id_usuario);

if (!$stmt->execute()) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al guardar los datos."]);
  $stmt->close();
  exit;
}
$stmt->close();

// Devolver usuario actualizado
$stmt = $mysqli->prepare("
  SELECT id_usuario, id_persona, usuario_login, nombre, apellido, email_cont, telefono_cont, rol
  FROM usuario WHERE id_usuario = ? LIMIT 1
");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$res = $stmt->get_result();
$user = $res->fetch_assoc();
$stmt->close();

echo json_encode(["ok" => true, "msg" => "Datos guardados correctamente", "user" => $user]);
