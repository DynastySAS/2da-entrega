<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../config/db.php";
require_once "../controladores/controladorUsuario.php";

// Preflight CORS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Conexión DB
$db = (new Database())->getConnection();
$controller = new UsuarioController($db);

// Método y parámetros
$method = $_SERVER["REQUEST_METHOD"];
$input  = json_decode(file_get_contents("php://input")); 
$path = explode("/", trim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), "/"));
$action = $path[4] ?? null; 
$id = $path[5] ?? null;


switch ($method) {
    case "GET":
        if ($id) {
            $controller->show((int)$id);
        } else {
            $controller->index();
        }
        break;

    case "POST":
        if ($action === "login") {
            $controller->login($input); 
        } else {
            $controller->store($input); 
        }
        break;

    case "PUT":
            if ($id) $controller->update($input); 
            break;

    case "DELETE":
        if ($id) {
            $controller->delete((int)$id); 
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Falta ID"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
