const { google } = require('googleapis');
const fs = require('fs');

// Credenciales para la autenticación
const credentials = require('../credentials.json');

// Instanciamos el cliente de Google Drive
const drive = google.drive({
    version: 'v3',
    auth: new google.auth.OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.redirect_uris[0]
    )
});

// Función para subir un archivo a Google Drive
async function uploadFile(file) {
    try {
        const res = await drive.files.create({
            requestBody: {
                name: file.name,
                mimeType: file.type
            },
            media: {
                mimeType: file.type,
                body: fs.createReadStream(file.path)
            },
            fields: 'id'
        });

        console.log(`Archivo subido correctamente. ID: ${res.data.id}`);
        return res.data.id;
    } catch (err) {
        console.error('Error al subir el archivo', err);
        throw err;
    }
}

module.exports = {
    drive,
    uploadFile
};
