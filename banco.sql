-- ==============================
-- Banco de dados Caminho Leve MC
-- ==============================

CREATE DATABASE IF NOT EXISTS caminho_leve_mc;
USE caminho_leve_mc;

-- ==============================
-- TABELA DE USUÁRIOS
-- ==============================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(20) UNIQUE NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    nascimento DATE,
    tipo ENUM('paciente', 'familiar', 'amigo', 'simpatizante', 'profissional') NOT NULL,
    registro VARCHAR(50),
    senha VARCHAR(255) NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- TABELA DE ARTIGOS
-- ==============================
CREATE TABLE IF NOT EXISTS artigos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    origem VARCHAR(255),
    autor VARCHAR(255),
    revisado BOOLEAN DEFAULT FALSE,
    criado_por INT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- ==============================
-- TABELA DE FÓRUM
-- ==============================
CREATE TABLE IF NOT EXISTS forum (
    id INT AUTO_INCREMENT PRIMARY KEY,
    autor_id INT NOT NULL,
    texto TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);

-- Curtidas no Fórum
CREATE TABLE IF NOT EXISTS forum_curtidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forum_id INT NOT NULL,
    usuario_id INT NOT NULL,
    UNIQUE (forum_id, usuario_id),
    FOREIGN KEY (forum_id) REFERENCES forum(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Respostas do Fórum
CREATE TABLE IF NOT EXISTS forum_respostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forum_id INT NOT NULL,
    autor_id INT NOT NULL,
    texto TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    FOREIGN KEY (forum_id) REFERENCES forum(id) ON DELETE CASCADE,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Curtidas nas respostas do Fórum
CREATE TABLE IF NOT EXISTS forum_resposta_curtidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resposta_id INT NOT NULL,
    usuario_id INT NOT NULL,
    UNIQUE (resposta_id, usuario_id),
    FOREIGN KEY (resposta_id) REFERENCES forum_respostas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ==============================
-- TABELA DE RELATOS
-- ==============================
CREATE TABLE IF NOT EXISTS relatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    autor_id INT NOT NULL,
    texto TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);

-- Curtidas nos relatos
CREATE TABLE IF NOT EXISTS relato_curtidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    relato_id INT NOT NULL,
    usuario_id INT NOT NULL,
    UNIQUE (relato_id, usuario_id),
    FOREIGN KEY (relato_id) REFERENCES relatos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ==============================
-- Exemplo de usuário admin para teste
-- ==============================
INSERT INTO usuarios (nome, cpf, cidade, estado, nascimento, tipo, senha)
VALUES ('Admin', '00000000000', 'Cidade', 'Estado', '2000-01-01', 'profissional', 
        '$2y$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'); -- Substitua pelo hash real da senha
