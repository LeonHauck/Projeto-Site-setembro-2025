@echo off
echo Baixando bibliotecas para a pasta libs...
if not exist "libs" mkdir libs

powershell -Command "Invoke-WebRequest -Uri 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js' -OutFile 'libs/chart.js'"
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js' -OutFile 'libs/xlsx.full.min.js'"
powershell -Command "Invoke-WebRequest -Uri 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' -OutFile 'libs/jspdf.umd.min.js'"
powershell -Command "Invoke-WebRequest -Uri 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js' -OutFile 'libs/jspdf.plugin.autotable.min.js'"

echo.
echo Processo finalizado! Se nao apareceu nenhum erro vermelho, deu certo.
echo Verifique se os arquivos estao na pasta libs.
pause
