@echo off
echo Iniciando aplicação Rinha de Backend...
docker-compose up -d
echo.
echo Verifique se a aplicação está funcionando corretamente acessando:
echo GET http://localhost:9999/clientes/1/extrato
echo.
echo Para parar a aplicação, execute: docker-compose down
