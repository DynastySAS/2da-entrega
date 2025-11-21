<?php
require_once __DIR__ . '/../modelos/Trabajo.php';

class TrabajoController {
    private $db;
    public function __construct($db) { $this->db = $db; }

    public function index() {
        $trabajo = new Trabajo($this->db);
        $result = $trabajo->getAll();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["success" => true, "data" => $data]);
    }

    public function store($input) {
    if (empty($input->id_usuario) || $input->horas_cumplidas === null) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Datos incompletos"]);
        return;
    }

    $trabajo = new Trabajo($this->db);
    $trabajo->id_usuario      = $input->id_usuario;
    $trabajo->horas_cumplidas = $input->horas_cumplidas;
    $trabajo->motivo          = $input->motivo ?? null;
    $trabajo->semana          = $input->semana ?? null;

    $ok = $trabajo->create();
    echo json_encode(["success" => $ok, "message" => $ok ? "Horas registradas" : "Error al registrar horas"]);
}

    public function update($input) {
        $trabajo = new Trabajo($this->db);
        $trabajo->id_registro     = $input->id_registro;
        $trabajo->fch_registro    = $input->fch_registro ?? null;
        $trabajo->horas_cumplidas = $input->horas_cumplidas;
        $trabajo->id_usuario      = $input->id_usuario;
        $trabajo->motivo          = $input->motivo ?? null;
        $trabajo->semana          = $input->semana ?? null;

        echo json_encode(["success" => $trabajo->update()]);
    }

    public function delete($id) {
        $trabajo = new Trabajo($this->db);
        $ok = $trabajo->delete($id);
        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Trabajo eliminado" : "Error al eliminar trabajo"
        ]);
    }
}
