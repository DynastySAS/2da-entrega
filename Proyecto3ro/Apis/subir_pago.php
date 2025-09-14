<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/db.php";

$input = file_get_contents('php://input');
$body = json_decode($input, true);
if (!is_array($body)) $body = $_POST;

$id_usuario = intval($body["id_usuario"] ?? 0);
$fecha = trim($body["fecha"] ?? "");
$monto = (float)($body["monto"] ?? 0);
$tipo = trim(strtolower($body["tipo-pago"] ?? $body["tipo"] ?? ""));

// Validaciones
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
if ($monto <= 0) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Monto inválido."]);
  exit;
}

// Normalizar tipo
$allowed = ["mensual", "inicial", "compensatorio"];
if ($tipo === "compensatorio") $tipo = "compensatorio";
if (!in_array($tipo, $allowed)) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Tipo de pago inválido. Valores permitidos: mensual, inicial, compensatorio."]);
  exit;
}

// Validar fecha
$ts = strtotime($fecha);
if ($ts === false) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Fecha inválida."]);
  exit;
}
$fecha_sql = date('Y-m-d', $ts);

// Insertar en pago
$stmt = $mysqli->prepare("
  INSERT INTO pago (tipo_pago, monto, fecha, id_usuario)
  VALUES (?, ?, ?, ?)
");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al preparar INSERT."]);
  exit;
}
$stmt->bind_param("sdsi", $tipo, $monto, $fecha_sql, $id_usuario);

if ($stmt->execute()) {
  echo json_encode(["ok" => true, "msg" => "Pago registrado.", "id_pago" => $stmt->insert_id]);
} else {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al guardar pago.", "error" => $stmt->error]);
}
$stmt->close();
