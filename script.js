// =========================================================================
// THEME AND VIEW MANAGER
// =========================================================================

// Load saved theme or default to dark
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = `theme-${savedTheme} view-dashboard`;
    
    // Initialize Charts
    initDashboardCharts();
    initPrintCharts();
});

// Toggle Theme (Light / Dark)
function toggleTheme() {
    if (document.body.classList.contains('theme-dark')) {
        document.body.classList.replace('theme-dark', 'theme-light');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.replace('theme-light', 'theme-dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Toggle View (Dashboard / Print A4)
function setView(view) {
    const btnDashboard = document.getElementById('btnDashboard');
    const btnPrintView = document.getElementById('btnPrintView');
    
    if (view === 'dashboard') {
        document.body.classList.replace('view-print', 'view-dashboard');
        btnDashboard.classList.add('active');
        btnPrintView.classList.remove('active');
    } else {
        document.body.classList.replace('view-dashboard', 'view-print');
        btnDashboard.classList.remove('active');
        btnPrintView.classList.add('active');
    }
}

// Trigger browser printing
function triggerPrint() {
    window.print();
}

// =========================================================================
// LIGHTBOX EVIDENCES MODAL
// =========================================================================

function openLightbox(imgSrc, captionText) {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const modalCaption = document.getElementById('lightboxCaption');
    
    modal.style.display = "flex";
    modalImg.src = imgSrc;
    modalCaption.textContent = captionText;
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.style.display = "none";
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// =========================================================================
// CHARTS INITIALIZATION (CHART.JS)
// =========================================================================

let charts = {};

// Helper to determine text colors based on theme
function getThemeChartColors() {
    const isLight = document.body.classList.contains('theme-light');
    return {
        text: isLight ? '#475569' : '#9ca3af',
        grid: isLight ? '#e2e8f0' : '#22314d',
        tooltipBg: isLight ? '#0f172a' : '#151f32',
        tooltipText: '#ffffff'
    };
}

function initDashboardCharts() {
    const colors = getThemeChartColors();

    // 1. Dashboard Pesagem Chart (Line)
    const ctxPesagem = document.getElementById('chartPesagemDashboard').getContext('2d');
    
    // Create gradient fill for dashboard
    const gradient = ctxPesagem.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(20, 184, 166, 0.4)');
    gradient.addColorStop(1, 'rgba(20, 184, 166, 0.0)');

    charts.pesagemDash = new Chart(ctxPesagem, {
        type: 'line',
        data: {
            labels: ['Fardo 1','Fardo 2','Fardo 3','Fardo 4','Fardo 5','Fardo 6','Fardo 7','Fardo 8'],
            datasets: [{
                label: 'Média Parcial (g)',
                data: [64.14, 64.05, 64.30, 62.90, 63.77, 63.72, 63.63, 63.52],
                borderColor: '#14b8a6',
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                pointBackgroundColor: '#14b8a6',
                pointBorderColor: '#ffffff',
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#14b8a6',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2,
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipText,
                    bodyColor: colors.tooltipText,
                    borderColor: '#22314d',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Peso: ${context.parsed.y.toFixed(2)} g`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: colors.grid },
                    ticks: { color: colors.text, font: { family: 'Inter', size: 10 } }
                },
                y: {
                    min: 62,
                    max: 65,
                    grid: { color: colors.grid },
                    ticks: { 
                        color: colors.text, 
                        font: { family: 'Inter', size: 10 },
                        stepSize: 0.5,
                        callback: function(value) { return value + 'g'; }
                    }
                }
            }
        }
    });

    // 2. Dashboard Lote P Chart (Bar)
    const ctxLoteP = document.getElementById('chartLotePDashboard').getContext('2d');
    charts.lotePDash = new Chart(ctxLoteP, {
        type: 'bar',
        data: {
            labels: ['1P','2P','3P','4P','5P','6P','7P','8P','10P','12P'],
            datasets: [{
                label: 'Média por Saco (g)',
                data: [64.40, 64.50, 66.40, 64.50, 64.50, 63.30, 63.80, 64.70, 64.00, 63.60],
                backgroundColor: [
                    '#3b82f6', // 1P (Conforme)
                    '#3b82f6', // 2P (Conforme)
                    '#ef4444', // 3P (Crítico - Acima)
                    '#3b82f6', // 4P (Conforme)
                    '#3b82f6', // 5P (Conforme)
                    '#f59e0b', // 6P (Abaixo Ideal mas conforme)
                    '#3b82f6', // 7P (Conforme)
                    '#3b82f6', // 8P (Conforme)
                    '#3b82f6', // 10P (Conforme)
                    '#3b82f6'  // 12P (Conforme)
                ],
                borderRadius: 4,
                borderWidth: 0,
                barPercentage: 0.65
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipText,
                    bodyColor: colors.tooltipText,
                    borderColor: '#22314d',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Média: ${context.parsed.y.toFixed(2)} g`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: colors.grid },
                    ticks: { color: colors.text, font: { family: 'Inter', size: 10 } }
                },
                y: {
                    min: 60,
                    max: 68,
                    grid: { color: colors.grid },
                    ticks: { 
                        color: colors.text, 
                        font: { family: 'Inter', size: 10 },
                        stepSize: 1,
                        callback: function(value) { return value + 'g'; }
                    }
                }
            }
        }
    });

    // Handle theme toggle chart update
    const observer = new MutationObserver(() => {
        const newColors = getThemeChartColors();
        
        // Update scales & tooltips colors
        [charts.pesagemDash, charts.lotePDash].forEach(chart => {
            if (chart) {
                chart.options.scales.x.grid.color = newColors.grid;
                chart.options.scales.y.grid.color = newColors.grid;
                chart.options.scales.x.ticks.color = newColors.text;
                chart.options.scales.y.ticks.color = newColors.text;
                chart.options.plugins.tooltip.backgroundColor = newColors.tooltipBg;
                chart.update();
            }
        });
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

function initPrintCharts() {
    // 1. Print View Pesagem (Line)
    const ctxPesagem = document.getElementById('chartPesagem').getContext('2d');
    charts.pesagemPrint = new Chart(ctxPesagem, {
        type: 'line',
        data: {
            labels: ['Fardo 1','Fardo 2','Fardo 3','Fardo 4','Fardo 5','Fardo 6','Fardo 7','Fardo 8'],
            datasets: [{
                label: 'Média Parcial (g)',
                data: [64.14, 64.05, 64.30, 62.90, 63.77, 63.72, 63.63, 63.52],
                borderColor: '#16a085',
                backgroundColor: 'rgba(22, 160, 133, 0.05)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#2c3e50',
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: '#e5e8e8' },
                    ticks: { color: '#2c3e50', font: { family: 'Inter', size: 9 } }
                },
                y: {
                    min: 62,
                    max: 65,
                    grid: { color: '#e5e8e8' },
                    ticks: { color: '#2c3e50', font: { family: 'Inter', size: 9 } }
                }
            }
        }
    });

    // 2. Print View Lote P (Bar)
    const ctxLoteP = document.getElementById('chartLoteP').getContext('2d');
    charts.lotePPrint = new Chart(ctxLoteP, {
        type: 'bar',
        data: {
            labels: ['1P','2P','3P','4P','5P','6P','7P','8P','10P','12P'],
            datasets: [{
                label: 'Média por Saco (g)',
                data: [64.40, 64.50, 66.40, 64.50, 64.50, 63.30, 63.80, 64.70, 64.00, 63.60],
                backgroundColor: [
                    '#3498db', // 1P
                    '#16a085', // 2P
                    '#e74c3c', // 3P (Critico)
                    '#16a085', // 4P
                    '#16a085', // 5P
                    '#f39c12', // 6P (Abaixo)
                    '#16a085', // 7P
                    '#16a085', // 8P
                    '#16a085', // 10P
                    '#16a085'  // 12P
                ],
                borderWidth: 1,
                borderColor: '#2c3e50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: '#e5e8e8' },
                    ticks: { color: '#2c3e50', font: { family: 'Inter', size: 9 } }
                },
                y: {
                    min: 60,
                    max: 68,
                    grid: { color: '#e5e8e8' },
                    ticks: { color: '#2c3e50', font: { family: 'Inter', size: 9 } }
                }
            }
        }
    });
}
