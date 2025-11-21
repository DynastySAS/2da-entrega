<?php

class Trabajo {
    private $conn;
    private $table_name = "trabajo";

    public $fch_registro;
    public $horas_cumplidas;
    public $id_registro;
    public $id_usuario;
    public $motivo;
    public $semana;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table_name;
        return $this->conn->query($query);
    }

    public function create() {
    $query = "INSERT INTO " . $this->table_name . "
              (horas_cumplidas, id_usuario, motivo, semana) 
              VALUES (?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    if (!$stmt) return false;

    $stmt->bind_param(
        "iiss",
        $this->horas_cumplidas,
        $this->id_usuario,
        $this->motivo,
        $this->semana
    );
    return $stmt->execute();
}


    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET fch_registro=?, horas_cumplidas=?, id_usuario=?, motivo=?, semana=?
                  WHERE id_registro=?";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) return false;

        $stmt->bind_param(
            "siissi",
            $this->fch_registro,
            $this->horas_cumplidas,
            $this->id_usuario,
            $this->motivo,
            $this->semana,
            $this->id_registro
        );
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM $this->table_name WHERE id_registro=?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
