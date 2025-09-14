<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/db.php";

// Soportar JSON o form-data
$input = file_get_contents('php://input');
$body = json_decode($input, true);
if (!is_array($body)) $body = $_POST;

$id_usuario = intval($body["id_usuario"] ?? 0);
$fecha = trim($body["fecha"] ?? "");
$horas = (float)($body["horas"] ?? 0);
$motivo = trim($body["motivo"] ?? "");

//Validaciones
if ($id_usuario <= 0) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Falta id_usuario."]);
  exit;
}
if (!$fecha) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Falta la fecha."]);
  exit;
}
if ($horas < 0 || $horas > 200) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Horas inválidas."]);
  exit;
}

// Calcular número de semana ISO
$ts = strtotime($fecha);
if ($ts === false) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Fecha inválida."]);
  exit;
}
$semana = intval(date('W', $ts));
$fch_registro = date('Y-m-d', $ts);

// Insertar en tabla trabajo
$stmt = $mysqli->prepare("
  INSERT INTO trabajo (semana, horas_cumplidas, fch_registro, id_usuario, motivo)
  VALUES (?, ?, ?, ?, ?)
");

if (!$stmt) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error en la preparación de la consulta."]);
  exit;
}
$stmt->bind_param("idsis", $semana, $horas, $fch_registro, $id_usuario, $motivo);

if ($stmt->execute()) {
  echo json_encode(["ok" => true, "msg" => "Registro de horas guardado.", "id_registro" => $stmt->insert_id]);
} else {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al guardar registro.", "error" => $stmt->error]);
}
$stmt->close();
