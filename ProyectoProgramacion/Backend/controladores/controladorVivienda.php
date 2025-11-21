<?php
require_once __DIR__ . '/../modelos/Vivienda.php';

class ViviendaController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function index() {
        $vivienda = new Vivienda($this->db);
        $data = $vivienda->getAll();
        echo json_encode(["success" => true, "data" => $data]);
    }


    public function show($id) {
        $vivienda = new Vivienda($this->db);
        $data = $vivienda->show($id);
        if ($data) {
            echo json_encode(["success" => true, "data" => $data]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Vivienda no encontrada"]);
        }
    }

    public function store($input) {
        $vivienda = new Vivienda($this->db);
        $vivienda->calle      = $input->calle;
        $vivienda->estado     = $input->estado;
        $vivienda->nro_apt    = $input->nro_apt;
        $vivienda->nro_puerta = $input->nro_puerta;

        echo json_encode(["success" => $vivienda->create()]);
    }

    public function update($input) {
        if (empty($input->id_vivienda)) { 
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Falta ID de la vivienda"]);
            return;
        }
        $vivienda = new Vivienda($this->db);
        $ok = $vivienda->update($input);

        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Vivienda actualizada" : "Error al actualizar vivienda"
        ]);
    }

    public function getByUser($id) {
    $vivienda = new Vivienda($this->db);
    $data = $vivienda->getByUser($id );
    if ($data) {
            echo json_encode(["success" => true, "data" => $data]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Vivienda no encontrado"]);
        }
    }   

    public function delete($id) {
        $vivienda = new Vivienda($this->db);
        $ok = $vivienda->delete($id);
        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Vivienda eliminada" : "Error al eliminar vivienda"
        ]);
    }
}
