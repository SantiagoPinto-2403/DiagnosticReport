document.getElementById('diagnosticReportForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const codeSystem = document.getElementById('codeSystem').value;
    const codeCode = document.getElementById('codeCode').value;
    const codeDisplay = document.getElementById('codeDisplay').value;
    const subjectReference = document.getElementById('subjectReference').value;
    const performerReference = document.getElementById('performerReference').value;
    const conclusion = document.getElementById('conclusion').value;

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
        performer: [{
            reference: performerReference
        }],
        conclusion: conclusion
    };

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
        alert('Informe diagnóstico creado exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear el informe diagnóstico.');
    });
});
