/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Admin Panel Interactions & Native SVG Chart Engine
 * File: assets/js/admin.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Quick search in admin tables
    const tableSearch = document.getElementById('adminTableSearch');
    if (tableSearch) {
        tableSearch.addEventListener('input', () => {
            const query = tableSearch.value.toLowerCase().trim();
            const rows = document.querySelectorAll('.admin-data-table tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // SVG Bar Chart Generation Engine (Pure Vanilla Math)
    window.renderSVGBarChart = function(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container || !data || data.length === 0) return;

        const width = 600;
        const height = 240;
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxVal = Math.max(...data.map(d => d.value), 5);
        const barWidth = chartWidth / data.length - 16;

        let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:100%;font-family:var(--font-body);">`;
        
        // Grid lines
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartHeight / 4) * i;
            const val = Math.round(maxVal - (maxVal / 4) * i);
            svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#E2DFD7" stroke-dasharray="3,3"/>`;
            svg += `<text x="${padding.left - 8}" y="${y + 4}" font-size="11" fill="#8A94A6" text-anchor="end">${val}</text>`;
        }

        // Bars
        data.forEach((d, idx) => {
            const barH = (d.value / maxVal) * chartHeight;
            const x = padding.left + idx * (chartWidth / data.length) + 8;
            const y = padding.top + chartHeight - barH;

            svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" fill="${d.color || '#344B78'}"/>`;
            svg += `<text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" font-weight="600" fill="#18263D" text-anchor="middle">${d.value}</text>`;
            svg += `<text x="${x + barWidth / 2}" y="${height - padding.bottom + 18}" font-size="11" fill="#5B6472" text-anchor="middle">${d.label}</text>`;
        });

        svg += `</svg>`;
        container.innerHTML = svg;
    };
});
