<?php
class Usuario {
    private $conn;
    private $table_name = "usuario";

    public $id_usuario;
    public $id_persona;
    public $nombre;
    public $apellido;
    public $email_cont;
    public $telefono_cont;
    public $estado;
    public $usuario_login;
    public $estatus;
    public $rol;
    public $contrasena;
    public $pago_inicial;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todos los usuarios
    public function getAll() {
    $sql = "SELECT * 
            FROM $this->table_name";
    $result = $this->conn->query($sql);
    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
    return $usuarios; 
}


    // Obtener usuario por ID
    public function getById($id) {
        $stmt = $this->conn->prepare(
            "SELECT id_usuario, id_persona, nombre, apellido, email_cont, telefono_cont, 
                    usuario_login, estado, estatus, rol, pago_inicial 
             FROM $this->table_name WHERE id_usuario=?"
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Crear usuario
    public function create($data) {
        $stmt = $this->conn->prepare(
            "INSERT INTO $this->table_name 
             (id_persona, nombre, apellido, email_cont, usuario_login, contrasena, estado, estatus, rol, pago_inicial)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        $hash = password_hash($data->password, PASSWORD_BCRYPT);
        $estado_default = 'solicitado';
        $rol_default = $data->rol ?? 'cooperativista';
        $pago_inicial_default = 'no';
        $estatus_default = 'Al dia';

        $stmt->bind_param(
            "isssssssss",
            $data->id_persona,
            $data->nombre,
            $data->apellido,
            $data->email_cont,
            $data->usuario_login,
            $hash,
            $estado_default,
            $estatus_default,
            $rol_default,
            $pago_inicial_default
        );

        return $stmt->execute();
    }

    // Login
    public function login($identificador, $password) {
        $stmt = $this->conn->prepare(
            "SELECT * FROM $this->table_name WHERE usuario_login=? OR email_cont=?"
        );
        $stmt->bind_param("ss", $identificador, $identificador);
        $stmt->execute();
        $usuario = $stmt->get_result()->fetch_assoc();

        if ($usuario && password_verify($password, $usuario['contrasena'])) {
            if ($usuario['estado'] !== 'registrado') {
                return false; // Usuario aún no aprobado
            }
            unset($usuario['contrasena']);
            return $usuario;
        }
        return false;
    }

    // Actualizar usuario (admin/backoffice)
    public function update($data) {
    $stmt = $this->conn->prepare(
        "UPDATE $this->table_name 
         SET id_persona=?, nombre=?, apellido=?, email_cont=?, telefono_cont=?, usuario_login=?, estado=?, estatus=?, rol=?, pago_inicial=? 
         WHERE id_usuario=?"
    );

    $stmt->bind_param("isssssssssi", 
    $data->id_persona,
    $data->nombre,
    $data->apellido,
    $data->email_cont,
    $data->telefono_cont,
    $data->usuario_login,
    $data->estado,
    $data->estatus,
    $data->rol,
    $data->pago_inicial,
    $data->id_usuario
        );

    if (!$stmt->execute()) {
        error_log("Error update usuario: " . $stmt->error);
        return false;
    }
    return true;
}

    // Aprobar usuario
    public function aprobar($id) {
            $sql = "UPDATE usuario SET estado = 'registrado' WHERE id_usuario = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $id);
            return $stmt->execute();
        }

    public function pagoInicial($id) {
            $sql = "UPDATE usuario SET pago_inicial = 'si' WHERE id_usuario = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $id);
            return $stmt->execute();
        }    
      
    
    // Borrar usuario
public function delete($id) {
    $sql = "DELETE FROM usuario WHERE id_usuario = ?";
    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
        error_log("Error prepare delete: " . $this->conn->error);
        return false;
    }

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        error_log("Error execute delete: " . $stmt->error);
        return false;
    }

    return $stmt->affected_rows > 0;
}


}
