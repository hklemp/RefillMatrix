document.addEventListener('DOMContentLoaded', () => {
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => buildMatrix(data))
        .catch(error => console.error('Error loading JSON:', error));
});

function buildMatrix(data) {
    const tableHead = document.querySelector('#matrixTable thead');
    const tableBody = document.querySelector('#matrixTable tbody');
    const spools = data.spool;
    const refills = data.refill;
    const rules = data.compatibility;

    // 1. Create header row (Master Spools)
    let headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Refill ↓ / Spool →</th>'; // Empty corner cell
    
    spools.forEach(spoolBrand => {
        let th = document.createElement('th');
        th.innerHTML = `<span>${spoolBrand.name}</span>`;
        if (spoolBrand.urls && spoolBrand.urls.length > 0) {
            spoolBrand.urls.forEach(url => {
                th.innerHTML += ` <a href="${url}" class="header-link" target="_blank" rel="noopener noreferrer" title="Visit ${spoolBrand.name} website">🔗</a>`;
            });
        }
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // 2. Create body (Refills)
    refills.forEach(refillBrand => {
        let row = document.createElement('tr');
        
        // First column: Refill name
        let thRow = document.createElement('th');
        thRow.innerHTML = `<span>${refillBrand.name}</span>`;
        if (refillBrand.url) {
            thRow.innerHTML += ` <a href="${refillBrand.url}" class="header-link" target="_blank" rel="noopener noreferrer" title="Visit ${refillBrand.name} website">🔗</a>`;
        }
        row.appendChild(thRow);

        // Cells for each Master Spool combination
        spools.forEach(spoolBrand => {
            let cell = document.createElement('td');
            
            // Search for a rule for this combination
            const match = rules.find(r => r.refill === refillBrand.name && r.spool === spoolBrand.name);

            if (match) {
                cell.classList.add(match.status);
                
                // Wrapper für Icons erstellen
                const iconWrapper = document.createElement('div');
                iconWrapper.classList.add('icon-wrapper');

                // Status-Icon
                const statusIcon = document.createElement('div');
                statusIcon.classList.add('status-icon');
                statusIcon.innerHTML = getStatusIcon(match.status);
                iconWrapper.appendChild(statusIcon);

                // Link-Icon (falls vorhanden)
                if (match.link) {
                    const linkIcon = document.createElement('div');
                    linkIcon.classList.add('link-icon');
                    linkIcon.innerHTML = `<a href="${match.link}" class="header-link" target="_blank" rel="noopener noreferrer" title="Link to adapter">🔗</a>`;
                    iconWrapper.appendChild(linkIcon);
                }
                
                cell.appendChild(iconWrapper);

                // Wenn eine Notiz vorhanden ist, als Tooltip hinzufügen
                if (match.note) {
                    cell.setAttribute('title', match.note);
                    cell.classList.add('has-tooltip');
                }
            } else {
                cell.classList.add('unknown');
                cell.textContent = '?';
            }

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

function getStatusIcon(status) {
    switch(status) {
        case 'ok': return '✅';
        case 'adapter': return '⚠️';
        case 'no': return '❌';
        default: return '?';
    }
}