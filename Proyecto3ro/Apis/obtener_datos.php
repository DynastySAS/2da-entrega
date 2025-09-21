<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/db.php";

$id_usuario = intval($_GET["id_usuario"] ?? 0);
if (!$id_usuario) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Falta el id_usuario"]);
  exit;
}

$stmt = $mysqli->prepare("
  SELECT id_usuario, id_persona, usuario_login, nombre, apellido, 
         email_cont, telefono_cont, rol
  FROM usuario
  WHERE id_usuario = ?
  LIMIT 1
");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al preparar consulta."]);
  exit;
}
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$res = $stmt->get_result();
$user = $res->fetch_assoc();
$stmt->close();

if ($user) {
  echo json_encode(["ok" => true, "user" => $user]);
} else {
  http_response_code(404);
  echo json_encode(["ok" => false, "msg" => "Usuario no encontrado"]);
}
