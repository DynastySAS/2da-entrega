<?php
require_once __DIR__ . '/../modelos/Pago.php';

class PagoController {
    private $db;
    public function __construct($db) { $this->db = $db; }

    
    public function create($input) {
        $pago = new Pago($this->db);
        $pago->tipo_pago = $input->tipo_pago ?? '';
        $pago->monto     = $input->monto ?? 0;
        $pago->id_usuario = $input->id_usuario ?? null;

        $ok = $pago->create();
        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Pago registrado, pendiente de aprobación" : "Error al registrar pago"
        ]);
    }

     
    public function index() {
        $pago = new Pago($this->db);
        $data = $pago->getAll();
        echo json_encode(["success" => true, "data" => $data]);
    }
     
    public function show($id) {
        $pago = new Pago($this->db);
        $data = $pago->show($id);
        if ($data) {
            echo json_encode(["success" => true, "data" => $data]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Pago no encontrado"]);
        }
    }

    public function getByUser($id) {
    $pago = new Pago($this->db);
    $data = $pago->getByUser($id);
    echo json_encode($data);
    }   

    public function update($input) {
        if (empty($input->id_pago)) { 
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Falta ID del pago"]);
            return;
        }
        $pago = new Pago($this->db);
        $ok = $pago->update($input);

        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Pago actualizado" : "Error al actualizar pago"
        ]);
    }

    public function tienePagosSolicitados($id_usuario) {
    $pago = new Pago($this->db);
    return $pago->tienePagosSolicitados($id_usuario);
}



    public function delete($id) {
        $pago = new Pago($this->db);
        $ok = $pago->delete($id);
        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Pago eliminado" : "Error al eliminar pago"
        ]);
    }
}
