document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('diagnosticReportForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Obtener valores del formulario
            const getValue = id => {
                const element = document.getElementById(id);
                return element ? element.value : null;
            };

            const identifierSystem = getValue('identifierSystem');
            const identifierValue = getValue('identifierValue');
            const status = getValue('status');
            const codeSystem = getValue('codeSystem');
            const codeCode = getValue('codeCode');
            const codeDisplay = getValue('codeDisplay');
            const subjectReference = getValue('subjectReference');
            
            // Manejo seguro de fechas
            const effectiveDateElement = document.getElementById('effectiveDateTime');
            const issuedDateElement = document.getElementById('issued');
            
            const effectiveDate = effectiveDateElement ? effectiveDateElement.value.split('T')[0] : '';
            const issuedDate = issuedDateElement ? issuedDateElement.value.split('T')[0] : '';
            
            const performerReference = getValue('performerReference');
            const resultsInterpreterReference = getValue('resultsInterpreterReference');
            const conclusion = getValue('conclusion');

            // Validación básica
            if (!identifierSystem || !identifierValue || !status || !codeSystem || !codeCode || 
                !codeDisplay || !subjectReference || !effectiveDate || !issuedDate) {
                alert('Por favor complete todos los campos requeridos');
                return;
            }

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
                effectiveDateTime: effectiveDate,
                issued: issuedDate,
                performer: performerReference ? [{
                    reference: performerReference
                }] : undefined,
                resultsInterpreter: resultsInterpreterReference ? [{
                    reference: resultsInterpreterReference
                }] : undefined,
                conclusion: conclusion || undefined
            };

            // Enviar al servidor
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
                form.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Hubo un error al registrar el informe diagnóstico.');
            });
        });
    } else {
        console.error('El formulario con ID "diagnosticReportForm" no fue encontrado');
    }
});
