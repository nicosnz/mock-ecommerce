
CREATE TABLE products (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre     VARCHAR(255)   NOT NULL,
  description       TEXT,
  precio     NUMERIC(10, 2) NOT NULL CHECK (precio > 0),
  stock      INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
  cat        VARCHAR(50)    NOT NULL,
  emoji      VARCHAR(10),
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);


CREATE TABLE opinions (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id BIGINT       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  autor      VARCHAR(255) NOT NULL,
  estrellas  SMALLINT     NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  texto      TEXT         NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opinions_product_id ON opinions(product_id);


CREATE TABLE pedidos (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cliente    VARCHAR(255) NOT NULL,
  estado     VARCHAR(20)  NOT NULL DEFAULT 'Pendiente'
             CHECK (estado IN ('Pendiente', 'En proceso', 'Entregado')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pedidos_updated_at
BEFORE UPDATE ON pedidos
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


CREATE TABLE pedido_items (
  id         BIGINT         PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  pedido_id  BIGINT         NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  nombre     VARCHAR(255)   NOT NULL,
  precio     NUMERIC(10, 2) NOT NULL CHECK (precio > 0),
  qty        INT            NOT NULL CHECK (qty > 0)
);

CREATE INDEX idx_pedido_items_pedido_id ON pedido_items(pedido_id);


INSERT INTO products (nombre, description, precio, stock, cat, emoji) VALUES
  ('Salteñas',     'Empanadas bolivianas horneadas con relleno de carne y verduras', 8.00,  50, 'Alimentos', '🥟'),
  ('Jugo de majo', 'Refrescante jugo natural de majo, fruta amazónica boliviana',   15.00, 30, 'Bebidas',   '🧃'),
  ('Singani',      'Aguardiente boliviano destilado de uva moscatel',               55.00, 20, 'Bebidas',   '🍾'),
  ('Blusa bordada','Blusa artesanal con bordados a mano de flores andinas',         120.00, 15, 'Ropa',     '👚'),
  ('Manta de llama','Manta tejida a mano con lana de llama 100% natural',           220.00, 10, 'Hogar',    '🧣'),
  ('Radio portatil','Radio AM/FM portátil con linterna LED incorporada',             95.00, 25, 'Electrónica','📻');

INSERT INTO opinions (product_id, autor, estrellas, texto) VALUES
  (1, 'Ana M.',    5, 'Las mejores salteñas que he probado, muy jugosas'),
  (1, 'Carlos R.', 4, 'Ricas, aunque podrían tener más ají'),
  (2, 'Luis P.',   5, 'Sabor único, muy refrescante'),
  (4, 'María T.',  5, 'Hermosa blusa, los bordados son increíbles');

INSERT INTO pedidos (cliente, estado) VALUES
  ('María González', 'Pendiente'),
  ('Juan Flores',    'En proceso'),
  ('Elena Paz',      'Entregado');

INSERT INTO pedido_items (pedido_id, nombre, precio, qty) VALUES
  (1, 'Salteñas',     8.00,  4),
  (1, 'Jugo de majo', 15.00, 2),
  (2, 'Singani',      55.00, 1),
  (3, 'Blusa bordada',120.00, 2);
