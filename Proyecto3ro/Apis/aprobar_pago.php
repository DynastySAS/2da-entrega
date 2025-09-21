<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/db.php";

$input = json_decode(file_get_contents("php://input"), true);
$id_pago = intval($input["id_pago"] ?? 0);

if ($id_pago <= 0) {
    echo json_encode(["ok" => false, "msg" => "ID de pago inválido"]);
    exit;
}

$stmt = $mysqli->prepare("UPDATE pago SET estado = 'aprobado' WHERE id_pago = ?");
$stmt->bind_param("i", $id_pago);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["ok" => true, "msg" => "Pago aprobado"]);
} else {
    echo json_encode(["ok" => false, "msg" => "No se encontró el pago o ya estaba aprobado"]);
}

$stmt->close();