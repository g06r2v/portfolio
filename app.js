// Capital Financial Services Website JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    setupMobileNavigation();
    setupSmoothScrolling();
    setupFormHandling();
    setupFAQToggle();
    setupModalFunctionality();
    setupScrollEffects();
    console.log('App initialized successfully');
}

// Mobile Navigation
function setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    console.log('Setting up mobile navigation...');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Hamburger clicked');
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Nav link clicked, closing mobile menu');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                console.log('Clicked outside nav, closing menu');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    } else {
        console.log('Mobile navigation elements not found');
    }
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    console.log('Setting up smooth scrolling...');
    // Get all navigation links that point to sections
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation link clicked:', this.getAttribute('href'));
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                console.log('Target element found:', targetId);
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            } else {
                console.log('Target element not found:', targetId);
            }
        });
    });
}

// Modal Functionality
function setupModalFunctionality() {
    console.log('Setting up modal functionality...');
    const modal = document.getElementById('contactModal');

    // Set up modal event listeners
    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                console.log('Clicked outside modal, closing');
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                console.log('Escape pressed, closing modal');
                closeModal();
            }
        });
    }
}

// Open Modal Function
function openModal() {
    console.log('Opening modal...');
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input for accessibility
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
                console.log('Focused on first input');
            }, 100);
        }
    } else {
        console.error('Modal element not found');
    }
}

// Close Modal Function
function closeModal() {
    console.log('Closing modal...');
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset form when closing modal
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            clearFormErrors(form);
        }
    }
}

// FAQ Toggle Function
function toggleFAQ(questionElement) {
    console.log('FAQ toggled');
    const faqItem = questionElement.closest('.faq-item');
    if (!faqItem) return;

    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.faq-icon');
    if (!answer || !icon) return;

    const isCurrentlyActive = answer.classList.contains('active');

    // Close all FAQ items first
    document.querySelectorAll('.faq-answer').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.faq-icon').forEach(item => {
        item.textContent = '+';
        item.style.transform = 'rotate(0deg)';
    });

    // Open current item if it wasn't active
    if (!isCurrentlyActive) {
        answer.classList.add('active');
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
        console.log('FAQ opened');
    } else {
        console.log('FAQ closed');
    }
}

// Set up FAQ toggle functionality
function setupFAQToggle() {
    console.log('Setting up FAQ toggle...');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('FAQ question clicked');
            toggleFAQ(this);
        });
    });
}

// Form Handling
function setupFormHandling() {
    console.log('Setting up form handling...');
    const contactForm = document.getElementById('contactForm');
    const modalForm = document.getElementById('modalForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted');
            handleContactFormSubmission();
        });
    }

    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Modal form submitted');
            handleModalFormSubmission();
        });
    }
}

// Handle Contact Form Submission - GOOGLE SHEETS VERSION
async function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('Contact form not found');
        return;
    }

    if (!validateForm(form)) {
        showNotification('Please correct the errors in the form and try again.', 'error');
        return;
    }

    // Disable submit during processing
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
    }

    // Capture form data properly for Google Sheets
    const formData = new FormData(form);
    const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject') || 'General Inquiry',
        message: formData.get('message'),
        consent: formData.get('consent') ? 'Yes' : 'No',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        formType: 'Contact Form'
    };

    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log('Sending to Google Sheets:', payload);

    try {
        // Send to Google Sheets via your Apps Script
        const response = await fetch('https://script.google.com/macros/s/AKfycbxLUCdWGK1UaABj6s0wOgT7neiT5QZ4YrRojVuf3J0QMtRLaZ2ZISgUajIQ5ILCA9x_/exec', {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // Note: With no-cors mode, we can't read the response, but that's normal for Google Apps Script
        console.log('✅ Form data sent to Google Sheets successfully');
        
        // Show success message and reset form
        showNotification('Thank you for your inquiry! We will contact you within 24 hours.', 'success');
        form.reset();
        clearFormErrors(form);

        // Log what was sent for your reference
        console.log('📧 CONTACT FORM DATA SENT:');
        console.log(`Name: ${payload.name}`);
        console.log(`Email: ${payload.email}`);
        console.log(`Phone: ${payload.phone}`);
        console.log(`Subject: ${payload.subject}`);
        console.log(`Message: ${payload.message}`);
        console.log(`Consent: ${payload.consent}`);
        console.log(`Time: ${payload.timestamp}`);

    } catch (err) {
        console.error('Send failed:', err);
        showNotification('Error sending message. Please try again later.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.prevText || 'Send Message';
        }
    }
}

// Handle Modal Form Submission - GOOGLE SHEETS VERSION
async function handleModalFormSubmission() {
    const form = document.getElementById('modalForm');
    if (!form) {
        console.error('Modal form not found');
        return;
    }

    if (!validateForm(form)) {
        showNotification('Please correct the errors in the form and try again.', 'error');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent;
        submitBtn.textContent = 'Booking…';
    }

    // Capture modal form data for Google Sheets
    const formData = new FormData(form);
    const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: 'Consultation Booking',
        message: `Consultation booking request. Preferred time: ${formData.get('preferredTime') || 'Not specified'}`,
        preferredTime: formData.get('preferredTime') || 'Not specified',
        consent: formData.get('consent') ? 'Yes' : 'No',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        formType: 'Consultation Booking'
    };

    console.log('=== CONSULTATION BOOKING ===');
    console.log('Sending to Google Sheets:', payload);

    try {
        // Send to Google Sheets via your Apps Script
        const response = await fetch('https://script.google.com/macros/s/AKfycbzNjcDJHdjrXMYWBdfyOwJ8K-BC6p8jL5E2htTWu_HK6NiuzC2gIxVC_7QEitgy_VGy/exec', {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('✅ Consultation booking sent to Google Sheets successfully');
        
        showNotification('Consultation booked successfully! We will call at the preferred time.', 'success');
        closeModal();

        // Log what was sent for your reference
        console.log('📅 CONSULTATION BOOKING DATA SENT:');
        console.log(`Name: ${payload.name}`);
        console.log(`Email: ${payload.email}`);
        console.log(`Phone: ${payload.phone}`);
        console.log(`Preferred Time: ${payload.preferredTime}`);
        console.log(`Consent: ${payload.consent}`);
        console.log(`Time: ${payload.timestamp}`);

    } catch (err) {
        console.error('Booking failed:', err);
        showNotification('Error sending message. Please try again later.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.prevText || 'Book Consultation';
        }
    }
}

// Form Validation
function validateForm(form) {
    console.log('Validating form...');
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Clear previous errors
    clearFormErrors(form);

    requiredFields.forEach(field => {
        const value = field.value ? field.value.trim() : '';
        if (!value) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    });

    // Check consent checkbox
    const consentCheckbox = form.querySelector('input[name="consent"]');
    if (consentCheckbox && !consentCheckbox.checked) {
        showFieldError(consentCheckbox, 'You must consent to be contacted');
        isValid = false;
    }

    console.log('Form validation result:', isValid);
    return isValid;
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone Validation - More flexible for international numbers
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[\+]?[\d]{10,15}$/;
    return phoneRegex.test(cleanPhone);
}

// Show Field Error
function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    if (!fieldGroup) return;

    // Remove existing error
    const existingError = fieldGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    errorDiv.textContent = message;
    fieldGroup.appendChild(errorDiv);

    // Add error styling to field
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
}

// Clear Form Errors
function clearFormErrors(form) {
    if (!form) return;

    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());

    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

// Notification System
function showNotification(message, type = 'info') {
    try {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        // Create notification element safely
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const bgColor = type === 'success' ? '#28a745'
            : type === 'error' ? '#dc3545'
            : type === 'warning' ? '#ffc107'
            : '#17a2b8';

        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: bgColor,
            color: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 3000,
            maxWidth: '400px',
            fontWeight: 500,
            fontSize: '0.95rem',
            lineHeight: 1.4
        });

        const text = document.createElement('span');
        text.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            marginLeft: '12px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '1.2rem',
            cursor: 'pointer'
        });

        closeBtn.addEventListener('click', () => notification.remove());

        notification.appendChild(text);
        notification.appendChild(closeBtn);
        document.body.appendChild(notification);

        // Auto dismiss
        setTimeout(() => notification.remove(), 4500);

    } catch (e) {
        console.error('Notification error:', e);
    }
}

// Scroll Effects (optional)
function setupScrollEffects() {
    // Add scroll-based animations if needed
    console.log('Scroll effects setup complete');
}

// Global functions for HTML onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleFAQ = toggleFAQ;
