/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Authentication & Form Validation JS
 * File: assets/js/auth.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.textContent = 'Hide';
                } else {
                    input.type = 'password';
                    btn.textContent = 'Show';
                }
            }
        });
    });

    // Real-time client-side registration form validation
    const registerForm = document.getElementById('studentRegisterForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirm_password')?.value;
            const marks = parseFloat(document.getElementById('marks_percentage')?.value || '0');
            const income = parseFloat(document.getElementById('annual_income')?.value || '0');

            if (password && password.length < 8) {
                e.preventDefault();
                alert('Password must contain at least 8 characters.');
                return;
            }

            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match. Please re-enter.');
                return;
            }

            if (marks < 0 || marks > 100) {
                e.preventDefault();
                alert('Marks percentage must be between 0% and 100%.');
                return;
            }

            if (income < 0) {
                e.preventDefault();
                alert('Annual income cannot be negative.');
                return;
            }
        });
    }
});
