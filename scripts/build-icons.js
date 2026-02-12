/**
 * Gera build/icon.ico a partir de public/icon.svg para o executável e instalador Windows.
 * Uso: node scripts/build-icons.js
 */
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const inputSvg = path.join(projectRoot, 'public', 'icon.svg');
const outputDir = path.join(projectRoot, 'build');
const outputIco = path.join(outputDir, 'icon.ico');

if (!fs.existsSync(inputSvg)) {
  console.error('Erro: public/icon.svg não encontrado.');
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const publicIco = path.join(projectRoot, 'public', 'icon.ico');

require('svg-to-ico')({
  input_name: inputSvg,
  output_name: outputIco,
  sizes: [16, 24, 32, 48, 64, 256],
})
  .then(() => {
    fs.copyFileSync(outputIco, publicIco);
    console.log('Ícone gerado: build/icon.ico e public/icon.ico');
  })
  .catch((err) => {
    console.error('Erro ao gerar ícone:', err);
    process.exit(1);
  });
