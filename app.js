// app.js
document.getElementById('diagnosticReportForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const codeSystem = document.getElementById('codeSystem').value;
    const codeCode = document.getElementById('codeCode').value;
    const codeDisplay = document.getElementById('codeDisplay').value;
    const subjectReference = document.getElementById('subjectReference').value;
    const effectiveDate = document.getElementById('effectiveDate').value;
    const issuedDate = document.getElementById('issuedDate').value;
    const performerReference = document.getElementById('performerReference').value;
    const resultsInterpreterReference = document.getElementById('resultsInterpreterReference').value;
    const conclusion = document.getElementById('conclusion').value;

    // Crear objeto DiagnosticReport
    const diagnosticReport = {
        resourceType: "DiagnosticReport",
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        status: status,
        code: {
            coding: [{
                system: codeSystem,
                code: codeCode,
                display: codeDisplay
            }],
            text: codeDisplay
        },
        subject: {
            reference: subjectReference
        },
        effectiveDateTime: effectiveDate, // Solo fecha (YYYY-MM-DD)
        issued: issuedDate, // Solo fecha (YYYY-MM-DD)
        performer: [{
            reference: performerReference
        }],
        resultsInterpreter: resultsInterpreterReference ? [{
            reference: resultsInterpreterReference
        }] : undefined,
        conclusion: conclusion
    };

    // Enviar al servidor
    console.log("Enviando DiagnosticReport:", diagnosticReport);
    
    fetch('https://back-end-santiago.onrender.com/diagnosticreport', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(diagnosticReport)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Informe diagnóstico registrado exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al registrar el informe diagnóstico.');
    });
});