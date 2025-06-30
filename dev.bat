@echo off
REM --- Iniciar Tudo para Loja Generica (com MongoDB via Docker Compose) ---

REM Defina os caminhos para as pastas do backend e frontend
SET BACKEND_DIR=.\backend
SET FRONTEND_DIR=.\frontend

ECHO Iniciando Contêiner do MongoDB via Docker Compose...
cd %BACKEND_DIR%

ECHO Iniciando Servidor Backend...
cd %BACKEND_DIR%
REM Inicie o servidor backend em uma nova janela do console
START "Backend Server" npm start
cd ..\

REM Aguarde alguns segundos para o backend iniciar
ECHO Aguardando Backend iniciar...
timeout /t 5 /nobreak > NUL

ECHO Iniciando Servidor Frontend...
cd %FRONTEND_DIR%
REM Inicie o servidor frontend em uma nova janela do console
START "Frontend Dev Server" npm run dev
cd ..\

ECHO.
ECHO --- Todos os servicos foram iniciados em janelas separadas. ---
ECHO O MongoDB deve estar rodando no Docker.
ECHO.
ECHO Pressione qualquer tecla para fechar este script (as janelas dos servicos e o Docker permanecerão em execução).
pause > NUL

:eof