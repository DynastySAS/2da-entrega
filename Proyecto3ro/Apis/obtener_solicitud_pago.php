<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/db.php";

$stmt = $mysqli->prepare("
  SELECT id_pago, tipo_pago, monto, fecha, id_usuario, estado
  FROM pago
  WHERE estado = 'solicitado'
");

if (!$stmt) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al preparar consulta."]);
  exit;
}

$stmt->execute();
$res = $stmt->get_result();

$pagos = [];
while ($row = $res->fetch_assoc()) {
  $pagos[] = $row;
}

$stmt->close();

echo json_encode(["ok" => true, "pagos" => $pagos], JSON_UNESCAPED_UNICODE);
?>
