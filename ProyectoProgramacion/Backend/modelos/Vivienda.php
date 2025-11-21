<?php

class Vivienda {
    private $conn;
    private $table_name = "vivienda";

    public $id_vivienda;
    public $calle;
    public $estado;
    public $nro_apt;
    public $nro_puerta;
    public $id_usuario;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
    $sql = "SELECT * 
            FROM $this->table_name";
    $result = $this->conn->query($sql);
    $viviendas = [];
    while ($row = $result->fetch_assoc()) {
        $viviendas[] = $row;
    }
    return $viviendas; 
    }

    public function create() {
        $query = "INSERT INTO  $this->table_name 
                  (calle, estado, nro_apt, nro_puerta) 
                  VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) return false;

        $stmt->bind_param(
            "ssii",
            $this->calle,
            $this->estado,
            $this->nro_apt,
            $this->nro_puerta
        );
        return $stmt->execute();
    }

    public function update($data) {
        $stmt = $this->conn->prepare(
            "UPDATE  $this->table_name 
            SET calle=?, estado=?, nro_apt=?, nro_puerta=?, id_usuario=?
            WHERE id_vivienda=?");

        $stmt->bind_param(
            "ssiiii",
            $data->calle,
            $data->estado,
            $data->nro_apt,
            $data->nro_puerta,
            $data->id_usuario,
            $data->id_vivienda            
        );
        if (!$stmt->execute()) {
        error_log("Error update vivienda: " . $stmt->error);
        return false;
    }
    return true;
    }

    public function show($id_vivienda) {
        $query = "SELECT * FROM $this->table_name WHERE id_vivienda=? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id_vivienda);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function getByUser($id) {
    $sql = "SELECT * FROM {$this->table_name} WHERE id_usuario = ? limit 1";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $vivienda = $result->fetch_assoc();
    return $vivienda ?: null;
}

    public function delete($id) {
        $query = "DELETE FROM  $this->table_name WHERE id_vivienda=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
