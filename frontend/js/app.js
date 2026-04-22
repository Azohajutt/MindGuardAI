// API Configuration
const API_URL = 'http://127.0.0.1:5000';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize range sliders if on prediction page
    if (document.getElementById('sleep_hours')) {
        initializeRangeSliders();
        setupEmploymentLogic();
        setupFormSubmit();
    }

    // Modal functionality for About page
    const modal = document.getElementById('aboutModal');
    const aboutLinks = document.querySelectorAll('#aboutLink, #aboutLinkFooter');
    const closeBtns = document.querySelectorAll('.close-modal, .modal-close-btn');

    // Open modal when About link is clicked
    aboutLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (modal) {
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    });

    // Close modal functions
    const closeModal = () => {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    closeBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeModal);
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Handle "How It Works" button click - smooth scroll to section
    const howItWorksBtn = document.querySelector('a[href="#how-it-works"]');
    if (howItWorksBtn) {
        howItWorksBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const howItWorksSection = document.getElementById('how-it-works');
            if (howItWorksSection) {
                howItWorksSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

function initializeRangeSliders() {
    const sliders = [
        { id: 'sleep_hours', display: 'sleep_value', suffix: ' hrs' },
        { id: 'physical_activity', display: 'activity_value', suffix: ' hrs' },
        { id: 'screen_time', display: 'screen_value', suffix: ' hrs' },
        { id: 'social_support', display: 'social_value', suffix: '' },
        { id: 'work_stress', display: 'work_stress_value', suffix: '' },
        { id: 'academic_pressure', display: 'academic_value', suffix: '' },
        { id: 'job_satisfaction', display: 'job_value', suffix: '' },
        { id: 'financial_stress', display: 'financial_value', suffix: '' },
        { id: 'working_hours', display: 'hours_value', suffix: ' hrs' },
        { id: 'anxiety_score', display: 'anxiety_value', suffix: '' },
        { id: 'depression_score', display: 'depression_value', suffix: '' },
        { id: 'stress_level', display: 'stress_value', suffix: '' },
        { id: 'mood_swings', display: 'mood_value', suffix: '' },
        { id: 'concentration', display: 'concentration_value', suffix: '' }
    ];

    sliders.forEach(slider => {
        const input = document.getElementById(slider.id);
        const display = document.getElementById(slider.display);

        if (input && display) {
            input.addEventListener('input', (e) => {
                display.textContent = e.target.value + slider.suffix;
            });
        }
    });
}

function setupEmploymentLogic() {
    const employmentSelect = document.getElementById('employment_status');
    if (!employmentSelect) return;

    const workStress = document.getElementById('work_stress');
    const jobSatisfaction = document.getElementById('job_satisfaction');
    const workingHours = document.getElementById('working_hours');
    const academicPressure = document.getElementById('academic_pressure');

    const workStressValue = document.getElementById('work_stress_value');
    const jobValue = document.getElementById('job_value');
    const hoursValue = document.getElementById('hours_value');
    const academicValue = document.getElementById('academic_value');

    function updateFields() {
        const status = employmentSelect.value;

        // Reset mins to allow 0
        if (workStress) workStress.min = 0;
        if (jobSatisfaction) jobSatisfaction.min = 0;
        if (workingHours) workingHours.min = 0;
        if (academicPressure) academicPressure.min = 0;

        if (status === 'Student') {
            // Disable work fields
            if (workStress) { workStress.disabled = true; workStress.value = 0; if (workStressValue) workStressValue.textContent = '0 (N/A)'; }
            if (jobSatisfaction) { jobSatisfaction.disabled = true; jobSatisfaction.value = 0; if (jobValue) jobValue.textContent = '0 (N/A)'; }
            if (workingHours) { workingHours.disabled = true; workingHours.value = 0; if (hoursValue) hoursValue.textContent = '0 hrs (N/A)'; }

            // Enable academic
            if (academicPressure) {
                academicPressure.disabled = false;
                academicPressure.min = 1;
                if (academicPressure.value == 0) academicPressure.value = 5;
                if (academicValue) academicValue.textContent = academicPressure.value;
            }
        } 
        else if (status === 'Unemployed') {
            // Disable all work and academic
            if (workStress) { workStress.disabled = true; workStress.value = 0; if (workStressValue) workStressValue.textContent = '0 (N/A)'; }
            if (jobSatisfaction) { jobSatisfaction.disabled = true; jobSatisfaction.value = 0; if (jobValue) jobValue.textContent = '0 (N/A)'; }
            if (workingHours) { workingHours.disabled = true; workingHours.value = 0; if (hoursValue) hoursValue.textContent = '0 hrs (N/A)'; }
            if (academicPressure) { academicPressure.disabled = true; academicPressure.value = 0; if (academicValue) academicValue.textContent = '0 (N/A)'; }
        }
        else { // Employed or Self-Employed
            // Enable work
            if (workStress) {
                workStress.disabled = false;
                workStress.min = 1;
                if (workStress.value == 0) workStress.value = 5;
                if (workStressValue) workStressValue.textContent = workStress.value;
            }
            if (jobSatisfaction) {
                jobSatisfaction.disabled = false;
                jobSatisfaction.min = 1;
                if (jobSatisfaction.value == 0) jobSatisfaction.value = 7;
                if (jobValue) jobValue.textContent = jobSatisfaction.value;
            }
            if (workingHours) {
                workingHours.disabled = false;
                workingHours.min = 20;
                if (workingHours.value == 0) workingHours.value = 40;
                if (hoursValue) hoursValue.textContent = workingHours.value + ' hrs';
            }

            // Disable academic
            if (academicPressure) { academicPressure.disabled = true; academicPressure.value = 0; if (academicValue) academicValue.textContent = '0 (N/A)'; }
        }
    }

    employmentSelect.addEventListener('change', updateFields);
    updateFields(); // Run on initialization
}

function setupFormSubmit() {
    const form = document.getElementById('assessmentForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await predictRisk();
        });
    }
}

async function predictRisk() {
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    if (!submitBtn) return;

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    submitBtn.disabled = true;

    try {
        // Collect form data
        const formData = {
            age: parseInt(document.getElementById('age')?.value || 25),
            gender: document.getElementById('gender')?.value || 'Male',
            marital_status: document.getElementById('marital_status')?.value || 'Single',
            education_level: document.getElementById('education_level')?.value || 'Bachelor',
            employment_status: document.getElementById('employment_status')?.value || 'Employed',
            sleep_hours: parseFloat(document.getElementById('sleep_hours')?.value || 7),
            physical_activity_hours_per_week: parseFloat(document.getElementById('physical_activity')?.value || 5),
            screen_time_hours_per_day: parseFloat(document.getElementById('screen_time')?.value || 5),
            social_support_score: parseInt(document.getElementById('social_support')?.value || 7),
            work_stress_level: parseInt(document.getElementById('work_stress')?.value || 5),
            academic_pressure_level: parseInt(document.getElementById('academic_pressure')?.value || 5),
            job_satisfaction_score: parseInt(document.getElementById('job_satisfaction')?.value || 7),
            financial_stress_level: parseInt(document.getElementById('financial_stress')?.value || 5),
            working_hours_per_week: parseInt(document.getElementById('working_hours')?.value || 40),
            anxiety_score: parseInt(document.getElementById('anxiety_score')?.value || 5),
            depression_score: parseInt(document.getElementById('depression_score')?.value || 5),
            stress_level: parseInt(document.getElementById('stress_level')?.value || 5),
            mood_swings_frequency: parseInt(document.getElementById('mood_swings')?.value || 5),
            concentration_difficulty_level: parseInt(document.getElementById('concentration')?.value || 5),
            panic_attack_history: document.getElementById('panic_attack')?.checked ? 1 : 0,
            family_history_mental_illness: document.getElementById('family_history')?.checked ? 1 : 0,
            previous_mental_health_diagnosis: document.getElementById('previous_diagnosis')?.checked ? 1 : 0,
            therapy_history: document.getElementById('therapy_history')?.checked ? 1 : 0,
            substance_use: document.getElementById('substance_use')?.checked ? 1 : 0
        };

        // Make API call
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Prediction failed');
        }

        const result = await response.json();

        if (result.success) {
            displayResults(result);
        } else {
            showError(result.error);
        }

    } catch (error) {
        console.error('Prediction error:', error);
        showError('Unable to connect to the prediction service. Please make sure the backend server is running on port 5000');
    } finally {
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
}

function displayResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    const riskLevel = document.getElementById('riskLevel');
    const confidence = document.getElementById('confidence');
    const recommendationsList = document.getElementById('recommendationsList');

    if (!resultsSection) return;

    // Show results section
    resultsSection.style.display = 'block';

    // Set risk level with color
    if (riskLevel) {
        riskLevel.textContent = result.risk_level;
        riskLevel.style.backgroundColor = result.color + '20';
        riskLevel.style.color = result.color;
        riskLevel.style.border = `2px solid ${result.color}`;
    }

    // Set confidence
    if (confidence) {
        confidence.textContent = `Confidence: ${result.confidence.toFixed(1)}%`;
    }

    // Create probability chart
    createProbabilityChart(result.probabilities);

    // Display recommendations
    if (recommendationsList) {
        recommendationsList.innerHTML = '';
        result.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerHTML = rec;
            recommendationsList.appendChild(li);
        });
    }

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

let chartInstance = null;

function createProbabilityChart(probabilities) {
    const ctx = document.getElementById('probabilityChart')?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
            datasets: [{
                label: 'Probability',
                data: [probabilities.low * 100, probabilities.moderate * 100, probabilities.high * 100],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.raw.toFixed(1)}%`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Probability (%)'
                    }
                }
            }
        }
    });
}

function showError(message) {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) return;

    resultsSection.style.display = 'block';

    const riskLevel = document.getElementById('riskLevel');
    if (riskLevel) {
        riskLevel.textContent = 'Error';
        riskLevel.style.backgroundColor = '#f8d7da';
        riskLevel.style.color = '#721c24';
    }

    const confidence = document.getElementById('confidence');
    if (confidence) {
        confidence.textContent = message;
    }

    const recommendationsList = document.getElementById('recommendationsList');
    if (recommendationsList) {
        recommendationsList.innerHTML = '<li>Please try again or contact support if the issue persists.</li>';
    }
}

// Check API health on page load
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log('API Status:', data.status);
    } catch (error) {
        console.warn('API not available. Make sure backend is running on port 5000');
    }
}

// Call health check if on prediction page
if (window.location.pathname.includes('predict.html')) {
    checkAPIHealth();
}