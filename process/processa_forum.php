<?php
include '../config/database.php';

session_start();
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $texto = $_POST['texto'];
    // Pegando usuário logado (pode vir do localStorage ou sessão)
    $autor_id = 1; // teste fixo, altere para pegar do login

    $stmt = $conn->prepare("INSERT INTO forum (autor_id, texto) VALUES (?, ?)");
    $stmt->bind_param("is", $autor_id, $texto);
    if($stmt->execute()){
        header("Location: ../pages/acolhimento.html");
    } else {
        echo "Erro ao publicar mensagem.";
    }
    $stmt->close();
}
$conn->close();
?>
