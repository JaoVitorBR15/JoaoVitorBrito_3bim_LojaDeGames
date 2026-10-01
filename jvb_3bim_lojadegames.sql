/* =========================================================
   GAME STORE - BANCO DE DADOS
   Projeto DW1 - 3º Bimestre 2026
   PostgreSQL
   ========================================================= */


/* =========================================================
   1. LIMPEZA DO BANCO
   ========================================================= */

DROP TABLE IF EXISTS jogo_plataforma CASCADE;
DROP TABLE IF EXISTS detalhes_jogo CASCADE;
DROP TABLE IF EXISTS jogos CASCADE;
DROP TABLE IF EXISTS plataformas CASCADE;
DROP TABLE IF EXISTS desenvolvedoras CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;


/* =========================================================
   2. TABELA DE DESENVOLVEDORAS
   RELACIONAMENTO: DESENVOLVEDORAS 1:N JOGOS
   ========================================================= */

CREATE TABLE desenvolvedoras (
    id_desenvolvedora SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    pais VARCHAR(60) NOT NULL
);


/* =========================================================
   3. TABELA DE PLATAFORMAS
   ========================================================= */

CREATE TABLE plataformas (
    id_plataforma SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE,
    fabricante VARCHAR(80) NOT NULL
);


/* =========================================================
   4. TABELA DE JOGOS
   RELACIONAMENTO:
   DESENVOLVEDORA 1:N JOGOS
   ========================================================= */

CREATE TABLE jogos (
    id_jogo SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_lancamento DATE NOT NULL,
    imagem VARCHAR(255),
    id_desenvolvedora INT NOT NULL,

    CONSTRAINT fk_jogo_desenvolvedora
        FOREIGN KEY (id_desenvolvedora)
        REFERENCES desenvolvedoras(id_desenvolvedora)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


/* =========================================================
   5. TABELA DE DETALHES DOS JOGOS
   RELACIONAMENTO: JOGOS 1:1 DETALHES_JOGO
   ========================================================= */

CREATE TABLE detalhes_jogo (
    id_jogo INT PRIMARY KEY,
    descricao TEXT NOT NULL,
    classificacao_indicativa VARCHAR(10) NOT NULL,
    numero_jogadores INT NOT NULL,
    modo_jogo VARCHAR(50) NOT NULL,

    CONSTRAINT fk_detalhes_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES jogos(id_jogo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_numero_jogadores
        CHECK (numero_jogadores > 0)
);


/* =========================================================
   6. TABELA INTERMEDIÁRIA JOGO_PLATAFORMA
   RELACIONAMENTO: JOGOS N:N PLATAFORMAS
   ========================================================= */

CREATE TABLE jogo_plataforma (
    id_jogo INT NOT NULL,
    id_plataforma INT NOT NULL,

    PRIMARY KEY (id_jogo, id_plataforma),

    CONSTRAINT fk_jogo_plataforma_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES jogos(id_jogo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_jogo_plataforma_plataforma
        FOREIGN KEY (id_plataforma)
        REFERENCES plataformas(id_plataforma)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


/* =========================================================
   7. TABELA DE CLIENTES
   TABELA INDEPENDENTE
   ========================================================= */

CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20)
);


/* =========================================================
   8. INSERTS - DESENVOLVEDORAS
   ========================================================= */

INSERT INTO desenvolvedoras (nome, pais) VALUES
('Nintendo', 'Japão'),
('Sonic Team', 'Japão'),
('Toys for Bob', 'Estados Unidos'),
('Santa Monica Studio', 'Estados Unidos'),
('Naughty Dog', 'Estados Unidos'),
('Ubisoft Montpellier', 'França'),
('Rockstar Games', 'Estados Unidos'),
('FromSoftware', 'Japão'),
('Valve', 'Estados Unidos'),
('CD Projekt Red', 'Polônia'),
('Insomniac Games', 'Estados Unidos'),
('Capcom', 'Japão');


/* =========================================================
   9. INSERTS - PLATAFORMAS
   ========================================================= */

INSERT INTO plataformas (nome, fabricante) VALUES
('PC', 'Microsoft'),
('PlayStation 4', 'Sony'),
('PlayStation 5', 'Sony'),
('Xbox One', 'Microsoft'),
('Xbox Series X/S', 'Microsoft'),
('Nintendo Switch', 'Nintendo'),
('Nintendo Wii U', 'Nintendo'),
('PlayStation 3', 'Sony'),
('Xbox 360', 'Microsoft'),
('Nintendo 3DS', 'Nintendo');


/* =========================================================
   10. INSERTS - JOGOS
   ========================================================= */

INSERT INTO jogos
(nome, data_lancamento, imagem, id_desenvolvedora)
VALUES
(
    'Super Mario Odyssey',
    '2017-10-27',
    'super_mario_odyssey.jpg',
    1
),
(
    'Sonic Generations',
    '2011-11-01',
    'sonic_generations.jpg',
    2
),
(
    'Crash Bandicoot 4: It''s About Time',
    '2020-10-02',
    'crash_bandicoot_4.jpg',
    3
),
(
    'God of War',
    '2018-04-20',
    'god_of_war_2018.jpg',
    4
),
(
    'The Last of Us',
    '2013-06-14',
    'the_last_of_us.jpg',
    5
),
(
    'Rayman Legends',
    '2013-08-29',
    'rayman_legends.jpg',
    6
),
(
    'Grand Theft Auto V',
    '2013-09-17',
    'gta_v.jpg',
    7
),
(
    'Elden Ring',
    '2022-02-25',
    'elden_ring.jpg',
    8
),
(
    'Portal 2',
    '2011-04-19',
    'portal_2.jpg',
    9
),
(
    'Cyberpunk 2077',
    '2020-12-10',
    'cyberpunk_2077.jpg',
    10
),
(
    'Marvel''s Spider-Man',
    '2018-09-07',
    'spider_man.jpg',
    11
),
(
    'Resident Evil 4',
    '2023-03-24',
    'resident_evil_4.jpg',
    12
);


/* =========================================================
   11. INSERTS - DETALHES DOS JOGOS
   RELACIONAMENTO 1:1
   ========================================================= */

INSERT INTO detalhes_jogo
(id_jogo, descricao, classificacao_indicativa, numero_jogadores, modo_jogo)
VALUES
(
    1,
    'Aventura de plataforma em 3D na qual Mario viaja por diferentes reinos para resgatar a Princesa Peach.',
    'Livre',
    1,
    'Single-player'
),
(
    2,
    'Jogo de plataforma que reúne versões clássica e moderna de Sonic em fases inspiradas na história da franquia.',
    'Livre',
    1,
    'Single-player'
),
(
    3,
    'Aventura de plataforma com Crash Bandicoot, Coco e seus amigos enfrentando novos desafios e inimigos.',
    '10',
    1,
    'Single-player'
),
(
    4,
    'Aventura de ação que acompanha Kratos e seu filho Atreus em uma jornada pela mitologia nórdica.',
    '18',
    1,
    'Single-player'
),
(
    5,
    'Jogo de ação e aventura que acompanha Joel e Ellie em uma jornada por um mundo devastado por uma pandemia.',
    '16',
    1,
    'Single-player'
),
(
    6,
    'Jogo de plataforma 2D com Rayman e seus amigos enfrentando diversos desafios em mundos coloridos.',
    'Livre',
    1,
    'Single-player'
),
(
    7,
    'Jogo de ação em mundo aberto ambientado em Los Santos, com três protagonistas e diversas atividades.',
    '18',
    1,
    'Single-player'
),
(
    8,
    'RPG de ação em mundo aberto desenvolvido pela FromSoftware e criado em colaboração com Hidetaka Miyazaki e George R. R. Martin.',
    '16',
    1,
    'Single-player'
),
(
    9,
    'Jogo de quebra-cabeças em primeira pessoa que utiliza portais para solucionar desafios em laboratórios.',
    '12',
    1,
    'Single-player / Cooperativo'
),
(
    10,
    'RPG de ação em mundo aberto ambientado em Night City, uma metrópole futurista.',
    '18',
    1,
    'Single-player'
),
(
    11,
    'Aventura de ação em mundo aberto protagonizada pelo Homem-Aranha em uma versão de Nova York.',
    '12',
    1,
    'Single-player'
),
(
    12,
    'Jogo de ação e terror de sobrevivência que acompanha Leon Kennedy em uma missão para resgatar Ashley Graham.',
    '18',
    1,
    'Single-player'
);


/* =========================================================
   12. INSERTS - JOGO_PLATAFORMA
   RELACIONAMENTO N:N
   ========================================================= */

/* Super Mario Odyssey */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(1, 6);


/* Sonic Generations */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(2, 2),
(2, 4),
(2, 6),
(2, 10);


/* Crash Bandicoot 4 */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6);


/* God of War */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(4, 2),
(4, 3);


/* The Last of Us */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(5, 8);


/* Rayman Legends */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(6, 1),
(6, 2),
(6, 4),
(6, 6),
(6, 7),
(6, 8),
(6, 9);


/* Grand Theft Auto V */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(7, 1),
(7, 2),
(7, 4),
(7, 5),
(7, 9);


/* Elden Ring */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 5);


/* Portal 2 */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(9, 1),
(9, 8),
(9, 9);


/* Cyberpunk 2077 */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(10, 1),
(10, 2),
(10, 3),
(10, 4),
(10, 5);


/* Marvel's Spider-Man */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(11, 2),
(11, 3);


/* Resident Evil 4 */
INSERT INTO jogo_plataforma (id_jogo, id_plataforma) VALUES
(12, 1),
(12, 2),
(12, 3),
(12, 4),
(12, 5);


/* =========================================================
   13. INSERTS - CLIENTES
   ========================================================= */

INSERT INTO clientes (nome, email, telefone) VALUES
('João Silva', 'joao.silva@email.com', '(44) 99999-0001'),
('Pedro Santos', 'pedro.santos@email.com', '(44) 99999-0002'),
('Lucas Oliveira', 'lucas.oliveira@email.com', '(44) 99999-0003'),
('Gabriel Souza', 'gabriel.souza@email.com', '(44) 99999-0004'),
('Matheus Costa', 'matheus.costa@email.com', '(44) 99999-0005'),
('Rafael Almeida', 'rafael.almeida@email.com', '(44) 99999-0006'),
('Felipe Rodrigues', 'felipe.rodrigues@email.com', '(44) 99999-0007'),
('Gustavo Pereira', 'gustavo.pereira@email.com', '(44) 99999-0008'),
('Bruno Martins', 'bruno.martins@email.com', '(44) 99999-0009'),
('André Ferreira', 'andre.ferreira@email.com', '(44) 99999-0010'),
('Henrique Gomes', 'henrique.gomes@email.com', '(44) 99999-0011'),
('Daniel Ribeiro', 'daniel.ribeiro@email.com', '(44) 99999-0012');


/* =========================================================
   14. CONSULTAS DE TESTE
   ========================================================= */

/* Listar todos os jogos */
SELECT * FROM jogos;


/* Listar todas as plataformas */
SELECT * FROM plataformas;


/* Listar todas as desenvolvedoras */
SELECT * FROM desenvolvedoras;


/* Listar todos os clientes */
SELECT * FROM clientes;


/* =========================================================
   CONSULTA COM RELACIONAMENTO 1:N
   Jogos + suas desenvolvedoras
   ========================================================= */

SELECT
    j.id_jogo,
    j.nome AS jogo,
    j.data_lancamento,
    d.nome AS desenvolvedora
FROM jogos j
INNER JOIN desenvolvedoras d
    ON j.id_desenvolvedora = d.id_desenvolvedora
ORDER BY j.nome;


/* =========================================================
   CONSULTA COM RELACIONAMENTO 1:1
   Jogos + detalhes
   ========================================================= */

SELECT
    j.nome AS jogo,
    d.descricao,
    d.classificacao_indicativa,
    d.numero_jogadores,
    d.modo_jogo
FROM jogos j
INNER JOIN detalhes_jogo d
    ON j.id_jogo = d.id_jogo
ORDER BY j.nome;


/* =========================================================
   CONSULTA COM RELACIONAMENTO N:N
   Jogos + plataformas
   ========================================================= */

SELECT
    j.nome AS jogo,
    p.nome AS plataforma
FROM jogos j
INNER JOIN jogo_plataforma jp
    ON j.id_jogo = jp.id_jogo
INNER JOIN plataformas p
    ON jp.id_plataforma = p.id_plataforma
ORDER BY j.nome, p.nome;


/* =========================================================
   CONSULTA COMPLETA
   ========================================================= */

SELECT
    j.id_jogo,
    j.nome AS jogo,
    j.data_lancamento,
    d.nome AS desenvolvedora,
    p.nome AS plataforma,
    j.imagem
FROM jogos j
INNER JOIN desenvolvedoras d
    ON j.id_desenvolvedora = d.id_desenvolvedora
INNER JOIN jogo_plataforma jp
    ON j.id_jogo = jp.id_jogo
INNER JOIN plataformas p
    ON jp.id_plataforma = p.id_plataforma
ORDER BY j.nome, p.nome;