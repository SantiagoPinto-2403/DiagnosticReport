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
            effectiveDate: document.getElementById('effectiveDateTime').value, // Cambiado de effectiveDateTime
            issuedDate: document.getElementById('issued').value, // Cambiado de issued
            performerReference: document.getElementById('performerReference').value,
            resultsInterpreterReference: document.getElementById('resultsInterpreterReference').value,
            conclusion: document.getElementById('conclusion').value
        };

        // Validaciones básicas
        if (!formData.effectiveDate || !formData.issuedDate) {
            throw new Error("Las fechas de estudio y emisión son requeridas");
        }

        // Función para formatear solo la fecha (sin hora)
        const formatDateOnly = (dateStr) => {
            return dateStr; // Ya es YYYY-MM-DD al venir de input type="date"
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
            effectiveDateTime: `${formatDateOnly(formData.effectiveDate)}T00:00:00Z`, // Añade hora mínima
            issued: `${formatDateOnly(formData.issuedDate)}T00:00:00Z`, // Añade hora mínima
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
            throw new Error(`Error ${response.status}: ${errorData.message || JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        alert('Informe diagnóstico registrado exitosamente!');
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
});
