@echo off
echo ===================================================
echo    Launching TradeBoot AI Monorepo Servers
echo ===================================================
echo.
echo Starting Java Spring Boot Backend (Port 8000)...
start "TradeBoot Backend" cmd /k "color 0A && title TradeBoot Backend (Port 8000) && cd tradeboot-backend && mvn spring-boot:run"

echo.
echo Starting React Vite Frontend (Port 5173)...
start "TradeBoot Frontend" cmd /k "color 0B && title TradeBoot Frontend (Port 5173) && cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate console windows!
echo You can now access your application at http://localhost:5173
echo ===================================================
timeout /t 3
