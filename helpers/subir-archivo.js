const path = require('path');
const { v4: uuidv4 } = require('uuid');

// si quiero validar otras extensiones las paso como parametro
// carpeta donde quiero guardar
const subirArchivo = (
    files,
    extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'],
    carpeta = ''
) => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(
                `La extension ${extension} no es permitida - ${extensionesValidas}`
            );
        }

        // guardar el archivo en la ruta
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(
            __dirname,
            '../uploads/',
            carpeta,
            nombreTemp
        );

        // mv mover el archivo
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });
    });
};

module.exports = {
    subirArchivo,
};
