<?php
$servername = "localhost";
$username   = "root";
$password   = ""; 
$dbname     = "cooperativa_viviendas";

$mysqli = new mysqli($servername, $username, $password, $dbname);
if ($mysqli->connect_errno) {
  http_response_code(500);
  die("Error de conexión MySQL: " . $mysqli->connect_error);
}

$mysqli->set_charset("utf8mb4");
