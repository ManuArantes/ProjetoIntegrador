<?php
include "../config/database.php";
session_start();

$usuario_id = $_SESSION['usuario_id'] ?? NULL;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $titulo = $_POST['titulo'];
    $url = $_POST['url'];
    $autor = $_POST['autor'];
    $origem = $_POST['origem'] ?? NULL;

    $stmt = $conn->prepare("INSERT INTO artigos (titulo, url, origem, autor, revisado, criado_por) VALUES (?, ?, ?, ?, FALSE, ?)");
    $stmt->execute([$titulo, $url, $origem, $autor, $usuario_id]);

    echo "Artigo enviado!";
}
?>
