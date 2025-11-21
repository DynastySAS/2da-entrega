<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../config/db.php";
require_once "../controladores/controladorUsuario.php";
require_once "../controladores/controladorPago.php";
require_once "../controladores/controladorTrabajo.php";
require_once "../controladores/controladorVivienda.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$db     = (new Database())->getConnection();
$method = $_SERVER["REQUEST_METHOD"];
$path = explode("/", trim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), "/"));
$action = $path[4] ?? null; 
$id = $path[5] ?? null;
$input  = json_decode(file_get_contents("php://input"));
if (!$action && isset($_GET['id_usuario'])) {
    $action = 'usuario';
}

switch ($action) {
    case "usuario":
        $controller = new UsuarioController($db);

        if ($method === "GET") {
            $controller->show($id);
        } elseif ($method === "PUT") {
            $controller->update($input);
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método no permitido en usuario"]);
        }
        break;

    case "pago":
        $controller = new PagoController($db);

        if ($method === "POST") {
            $controller->create($input);
        } elseif ($method === "GET") {
            $id ? $controller->show((int)$id) : $controller->index();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método no permitido en pago"]);
        }
        break;
 
    case "trabajo":
        $controller = new TrabajoController($db);

        if ($method === "POST") {
            $controller->store($input);
        } elseif ($method === "GET") {
            $controller->index();
        } elseif ($method === "PUT") {
            $controller->update($input);
        } elseif ($method === "DELETE") {
            $controller->delete($input);
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método no permitido en trabajo"]);
        }
        break;

    case "vivienda":
        $controller = new ViviendaController($db);
        
        if ($method=== "GET"){
            $controller->getByUser($id);
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método no permitido en vivienda"]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Acción no reconocida"]);
}
