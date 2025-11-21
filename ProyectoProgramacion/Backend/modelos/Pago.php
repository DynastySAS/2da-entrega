<?php
class Pago {
    private $conn;
    private $table_name = "pago";

    public $id_pago;
    public $tipo_pago;
    public $monto;
    public $id_usuario;
    public $estado;
    public $fecha;
    public $fecha_aprobado;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO {$this->table_name} (tipo_pago, monto, id_usuario, estado)
                  VALUES (?, ?, ?, 'solicitado')";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) return false;

        $stmt->bind_param("sdi", $this->tipo_pago, $this->monto, $this->id_usuario);
        return $stmt->execute();
    }

    public function update($data) {
    $stmt = $this->conn->prepare(
        "UPDATE $this->table_name 
         SET monto=?, tipo_pago=?, estado=?, fecha=?, fecha_aprobado=?, id_usuario=? 
         WHERE id_pago=?"
    );

    $stmt->bind_param("dssssii", 
    $data->monto,
    $data->tipo_pago,
    $data->estado,
    $data->fecha,
    $data->fecha_aprobado,
    $data->id_usuario,
    $data->id_pago

);
    if (!$stmt->execute()) {
        error_log("Error update pago: " . $stmt->error);
        return false;
    }
    return true;
}

    public function getAll() {
        $query = "SELECT * FROM {$this->table_name}";
        $result = $this->conn->query($query);
        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function show($id_pago) {
        $query = "SELECT * FROM {$this->table_name} WHERE id_pago=? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id_pago);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function tienePagosSolicitados($id_usuario) {
    $sql = "SELECT COUNT(*) AS total 
            FROM {$this->table_name} 
            WHERE id_usuario = ? AND estado = 'solicitado'";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    return $result["total"] > 0;
}

    public function usuarioTienePago($id_usuario) {
    $query = "SELECT COUNT(*) AS total FROM {$this->table_name} WHERE id_usuario = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    return $result['total'] > 0; // true si el usuario tiene al menos un pago
}

    public function getByUser($id_usuario) {
    $sql = "SELECT * FROM {$this->table_name} WHERE id_usuario = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    $pagos = [];
    while ($row = $result->fetch_assoc()) {
        $pagos[] = $row;
    }
    return $pagos;
}

    public function delete($id_pago) {
        $query = "DELETE FROM {$this->table_name} WHERE id_pago=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id_pago);
        return $stmt->execute();
    }
}
