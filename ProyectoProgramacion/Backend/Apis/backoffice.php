<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../controladores/controladorUsuario.php";
require_once __DIR__ . "/../controladores/controladorPago.php";
require_once __DIR__ . "/../controladores/controladorVivienda.php";
require_once __DIR__ . "/../controladores/controladorTrabajo.php";


$db = (new Database())->getConnection();

$usuarioController = new UsuarioController($db);
$pagoController = new PagoController($db);
$viviendaController = new ViviendaController($db);
$trabajoController = new TrabajoController($db);

$method = $_SERVER["REQUEST_METHOD"];
$path = explode("/", trim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), "/"));
$action = $path[4] ?? null; 
$id = $path[5] ?? null;
$input = json_decode(file_get_contents("php://input"));

$body = json_decode(file_get_contents("php://input"), true);
if ($body && isset($body['action'])) {
    $action = $body['action'];
    $id = $body['id'] ?? null;
}

switch ($action) {
    case "usuarios":
        switch ($method) {
            case "GET":
                $id ? $usuarioController->show($id) : $usuarioController->index();
                break;
            case "PUT":
                if ($id) $usuarioController->update($input);
                break;
            case "DELETE":
                if ($id) $usuarioController->delete($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Método no permitido"]);
        }
        break;

    case "pagos":
        switch ($method) {
            case "GET":
                $id ? $pagoController->show($id) : $pagoController->index();
                break;
            case "PUT":
                if ($id) $pagoController->update($input);
                break;
            case "DELETE":
                if ($id) $pagoController->delete($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Método no permitido"]);
        }
        break;

    case "viviendas":
        switch ($method) {
            case "GET":
                $viviendaController->index();
                break;
            case "PUT":
                if ($id) $viviendaController->update($input);
                break;
            case "DELETE":
                if ($id) $viviendaController->delete($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Método no permitido"]);
        }
        break;

    case "trabajo":
        switch ($method) {
            case "GET":
                $trabajoController->index();
                break;
            case "PUT":
                if ($id) $trabajoController->update($input);
                break;
            case "DELETE":
                if ($id) $trabajoController->delete($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Método no permitido"]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Recurso no encontrado"]);
}
