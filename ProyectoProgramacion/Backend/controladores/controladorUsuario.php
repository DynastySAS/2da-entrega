<?php
require_once __DIR__ . '/../modelos/Usuario.php';

class UsuarioController {
    private $db;
    public function __construct($db) { $this->db = $db; }

    // Listar todos
    public function index() {
    $usuario = new Usuario($this->db);
    $data = $usuario->getAll();
    echo json_encode(["success" => true, "data" => $data]);
}

    // Obtener uno
    public function show($id) {
        $usuario = new Usuario($this->db);
        $data = $usuario->getById($id);
        if ($data) {
            echo json_encode(["success" => true, "data" => $data]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
        }
    }

    // Login
    public function login($input) {
        $identificador = $input->identificador ?? "";
        $password = $input->password ?? "";

        if (!$identificador || !$password) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Faltan credenciales"]);
            return;
        }

        $usuarioModel = new Usuario($this->db);
        $usuario = $usuarioModel->login($identificador, $password);

        if ($usuario) {
            echo json_encode(["success" => true, "usuario" => $usuario]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Usuario no encontrado o pendiente de aprobación"]);
        }
    }

    // Crear usuario
    public function store($input) {
        $required = ['id_persona','nombre','apellido','usuario_login','password','email_cont'];
        foreach ($required as $field) {
            if (empty($input->$field)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Faltan datos requeridos: $field"]);
                return;
            }
        }
        $usuario = new Usuario($this->db);
        $ok = $usuario->create($input);

        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Usuario registrado, pendiente de aprobación" : "Error al registrar usuario"
        ]);
    }

    // Actualizar usuario
    public function update($input) {
        $usuario = new Usuario($this->db);
        $ok = $usuario->update($input);

        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Usuario actualizado" : "Error al actualizar usuario"
        ]);
    }

    // Aprobar usuario (para backoffice)
    public function aprobar($id) {
        $usuario = new Usuario($this->db);
        $ok = $usuario->aprobar($id);
        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Usuario aprobado" : "Error al aprobar usuario"
        ]);
    }

    // Aprobar pago inicial
    public function pagoInicial($id){
        $usuario = new Usuario($this->db);
        $ok = $usuario->pagoInicial($id);
        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Usuario aprobado" : "Error al aprobar usuario"
        ]);
    }

    // Borrar usuario
    public function delete($id) {
    $usuario = new Usuario($this->db);
    $ok = $usuario->delete($id);

    if ($ok) {
        echo json_encode(["success" => true, "message" => "Usuario eliminado"]);
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Error eliminando usuario"]);
    }
}
}