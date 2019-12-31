DROP TABLE IF EXISTS Todos;

CREATE TABLE Todos(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  contact VARCHAR(255),
  status VARCHAR(255),
  category VARCHAR(255),
  due DATE NOT NULL DEFAULT NOW()
);

INSERT INTO Todos (title, contact, status, category, description) 
VALUES('Each Shawerma','Ahmad','Do it at 1:00','Food','I am so hungry');
