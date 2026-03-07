// Survey management
class SurveyManager {
  constructor() {
    this.surveyModal = document.getElementById('surveyModal');
    this.surveyForm = document.getElementById('surveyForm');
    this.surveyClose = document.getElementById('surveyClose');
    this.surveySkip = document.getElementById('surveySkip');
    this.storageKey = 'petshop_survey_completed';
    this.init();
  }

  init() {
    // Check if survey was completed before
    if (!this.isSurveyCompleted()) {
      // Show survey after a short delay to allow page to load
      setTimeout(() => this.showSurvey(), 500);
    }

    // Event listeners
    this.surveyClose.addEventListener('click', () => this.closeSurvey());
    this.surveySkip.addEventListener('click', () => this.closeSurvey());
    this.surveyForm.addEventListener('submit', (e) => this.handleSubmit(e));

    // Click outside modal to close
    this.surveyModal.addEventListener('click', (e) => {
      if (e.target === this.surveyModal) {
        this.closeSurvey();
      }
    });
  }

  isSurveyCompleted() {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  showSurvey() {
    this.surveyModal.style.display = 'flex';
    // Track survey view in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'survey_viewed', {
        'event_category': 'engagement'
      });
    }
  }

  closeSurvey() {
    this.surveyModal.style.display = 'none';
    // Track survey skip in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'survey_skipped', {
        'event_category': 'engagement'
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
      petType: document.getElementById('petType').value,
      petAge: document.getElementById('petAge').value,
      petWeight: document.getElementById('petWeight').value,
      petBreed: document.getElementById('petBreed').value,
      petName: document.getElementById('petName').value,
      petHealth: document.getElementById('petHealth').value,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('petshop_pet_info', JSON.stringify(formData));
    localStorage.setItem(this.storageKey, 'true');

    // Track survey submission in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'survey_submitted', {
        'event_category': 'engagement',
        'pet_type': formData.petType,
        'pet_age': formData.petAge,
        'pet_health': formData.petHealth
      });
    }

    // Send to backend if needed
    this.sendSurveyData(formData);

    // Show success message
    this.showSuccessMessage();
  }

  showSuccessMessage() {
    const originalButton = this.surveyForm.querySelector('button[type=\"submit\"]');
    const originalText = originalButton.textContent;
    originalButton.textContent = '✓ Cảm ơn bạn!';
    originalButton.style.backgroundColor = 'var(--secondary-color)';

    setTimeout(() => {
      this.closeSurvey();
      originalButton.textContent = originalText;
      originalButton.style.backgroundColor = '';
    }, 1500);
  }

  async sendSurveyData(data) {
    try {
      const response = await fetch('http://localhost:3000/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Survey data saved successfully');
      }
    } catch (error) {
      console.warn('Could not send survey data to server:', error);
      // Data is still saved locally even if server request fails
    }
  }
}

// Main application initialization
document.addEventListener('DOMContentLoaded', async () => {
  console.log('PetShop application starting...');
  
  // Initialize survey
  const surveyManager = new SurveyManager();
  
  // Health check
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();
    console.log('Server status:', data.status);
  } catch (error) {
    console.warn('Server may not be running. Some features may not work properly.');
  }

  // Initialize all components
  console.log('Initializing application components...');
  
  // The individual component initializations are handled in their respective files
  // via DOMContentLoaded events, so we just need to ensure they load properly.
  
  console.log('PetShop application ready!');
});
