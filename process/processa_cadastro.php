<?php
include '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST['nome'];
    $nickname = $_POST['nickname'];
    $cpf = $_POST['cpf'];
    $cidade = $_POST['cidade'];
    $estado = $_POST['estado'];
    $nascimento = $_POST['nascimento'];
    $perfil = $_POST['perfil'];
    $registro = isset($_POST['registro']) ? $_POST['registro'] : null;
    $senha = password_hash('123456', PASSWORD_DEFAULT); // Senha padrão para teste

    // Verificar se CPF já existe
    $check = $conn->prepare("SELECT id FROM usuarios WHERE cpf=?");
    $check->bind_param("s", $cpf);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "CPF já cadastrado.";
    } else {
        $stmt = $conn->prepare("INSERT INTO usuarios (nome, cpf, cidade, nascimento, tipo, registro, senha) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $nome, $cpf, $cidade, $nascimento, $perfil, $registro, $senha);
        if($stmt->execute()){
            echo "Cadastro realizado com sucesso!";
        } else {
            echo "Erro ao cadastrar.";
        }
        $stmt->close();
    }
    $check->close();
}
$conn->close();
?>
