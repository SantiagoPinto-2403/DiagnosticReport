ddocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('diagnosticReportForm');
    
    if (!form) {
        console.error('No se encontró el formulario con ID diagnosticReportForm');
        return;
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        try {
            // Verificar que todos los elementos existen antes de acceder a ellos
            const getElement = (id) => {
                const element = document.getElementById(id);
                if (!element) {
                    throw new Error(`Elemento con ID ${id} no encontrado`);
                }
                return element;
            };

            // Obtener valores del formulario con validación
            const formData = {
                identifierSystem: getElement('identifierSystem').value,
                identifierValue: getElement('identifierValue').value,
                status: getElement('status').value,
                codeSystem: getElement('codeSystem').value,
                codeCode: getElement('codeCode').value,
                codeDisplay: getElement('codeDisplay').value,
                subjectReference: getElement('subjectReference').value,
                effectiveDate: getElement('effectiveDate').value,
                issuedDate: getElement('issuedDate').value,
                performerReference: getElement('performerReference').value,
                resultsInterpreterReference: getElement('resultsInterpreterReference').value,
                conclusion: getElement('conclusion').value
            };

            // Validar campos requeridos
            const requiredFields = ['identifierValue', 'status', 'codeCode', 'subjectReference', 
                                   'effectiveDate', 'issuedDate', 'performerReference'];
            
            for (const field of requiredFields) {
                if (!formData[field]) {
                    throw new Error(`El campo ${field} es requerido`);
                }
            }

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
                effectiveDateTime: `${formData.effectiveDate}T00:00:00Z`,
                issued: `${formData.issuedDate}T00:00:00Z`,
                performer: [{
                    reference: formData.performerReference
                }],
                conclusion: formData.conclusion || undefined // Enviar undefined si está vacío
            };

            // Añadir resultsInterpreter solo si tiene valor
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            alert('Informe diagnóstico registrado exitosamente!');
            
        } catch (error) {
            console.error('Error en el formulario:', error);
            alert(`Error: ${error.message}`);
        }
    });
});
