document.getElementById('diagnosticReportForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    try {
        // Obtener valores del formulario
        const formData = {
            identifierSystem: document.getElementById('identifierSystem').value,
            identifierValue: document.getElementById('identifierValue').value,
            status: document.getElementById('status').value,
            codeSystem: document.getElementById('codeSystem').value,
            codeCode: document.getElementById('codeCode').value,
            codeDisplay: document.getElementById('codeDisplay').value,
            subjectReference: document.getElementById('subjectReference').value,
            effectiveDateTime: document.getElementById('effectiveDateTime').value,
            issued: document.getElementById('issued').value,
            performerReference: document.getElementById('performerReference').value,
            resultsInterpreterReference: document.getElementById('resultsInterpreterReference').value,
            conclusion: document.getElementById('conclusion').value
        };

        // Validar fechas
        if (!formData.effectiveDateTime || !formData.issued) {
            throw new Error("Las fechas de estudio y emisión son requeridas");
        }

        // Formatear fechas a ISO 8601
        const formatDateTime = (dateTimeStr) => {
            const date = new Date(dateTimeStr);
            return date.toISOString();
        };

        // Crear objeto DiagnosticReport
        const diagnosticReport = {
            resourceType: "DiagnosticReport",
            identifier: [{
                system: formData.identifierSystem,
                value: formData.identifierValue
            }],
            status: formData.status,
            code: {
                coding: [{
                    system: formData.codeSystem,
                    code: formData.codeCode,
                    display: formData.codeDisplay
                }],
                text: formData.codeDisplay
            },
            subject: {
                reference: formData.subjectReference
            },
            effectiveDateTime: formatDateTime(formData.effectiveDateTime),
            issued: formatDateTime(formData.issued),
            performer: [{
                reference: formData.performerReference
            }],
            conclusion: formData.conclusion
        };

        // Agregar resultsInterpreter solo si tiene valor
        if (formData.resultsInterpreterReference) {
            diagnosticReport.resultsInterpreter = [{
                reference: formData.resultsInterpreterReference
            }];
        }

        console.log("Datos a enviar:", diagnosticReport);

        // Enviar al servidor
        const response = await fetch('https://back-end-santiago.onrender.com/diagnosticreport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(diagnosticReport)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Detalles del error:", errorData);
            throw new Error(`Error ${response.status}: ${errorData.message || 'Error al enviar el informe'}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        alert('Informe diagnóstico registrado exitosamente!');
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
});
