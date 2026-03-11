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
    // Always show survey when page loads
    setTimeout(() => this.showSurvey(), 500);

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

    // Get selected basic needs
    const basicNeedsCheckboxes = document.querySelectorAll('input[name="basicNeeds"]:checked');
    const basicNeeds = Array.from(basicNeedsCheckboxes).map(cb => cb.value);

    // Collect form data
    const formData = {
      petType: document.getElementById('petType').value,
      petAge: document.getElementById('petAge').value,
      petWeight: document.getElementById('petWeight').value,
      petName: document.getElementById('petName').value,
      petHealth: document.getElementById('petHealth').value,
      basicNeeds: basicNeeds,
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
        'pet_health': formData.petHealth,
        'basic_needs': basicNeeds.join(',')
      });
    }

    // Send to backend if needed
    this.sendSurveyData(formData);

    // Show success message
    this.showSuccessMessage();

    // Get product recommendations based on pet type
    if (formData.petType) {
      this.fetchPetTypeRecommendations(formData.petType);
    }
  }

  async fetchPetTypeRecommendations(petType) {
    try {
      const response = await fetch('http://localhost:3000/api/recommendations/pet-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ petType })
      });

      if (response.ok) {
        const data = await response.json();
        // Show recommendations after survey closes
        setTimeout(() => {
          this.showPetTypeRecommendations(data);
        }, 1500);
      }
    } catch (error) {
      console.warn('Could not fetch pet type recommendations:', error);
    }
  }

  showPetTypeRecommendations(data) {
    // Create modal for recommendations
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.id = 'recommendationModal';

    let recommendationsHTML = data.recommendations.map(product => {
      return `
        <div class="product-card" data-product-id="${product.id}">
          <div class="product-image">
            <img src="/api/images/image/${product.id}?name=${encodeURIComponent(product.name)}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover;">
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description" style="font-size: 13px; color: #666; margin: 8px 0;">${product.description}</p>
            <div class="product-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
              <span class="price" style="font-weight: bold; color: var(--primary-color); font-size: 16px;">₫${product.price.toLocaleString('vi-VN')}</span>
              <button class="btn-add-cart" onclick="Cart.addToCart({id: ${product.id}, name: '${product.name.replace(/'/g, "\\'")}', price: ${product.price}, image: '${product.image}'}); alert('Đã thêm vào giỏ hàng')" style="background: var(--primary-color); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">
                <i class="fas fa-shopping-cart"></i> Thêm
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 90%; width: 900px; max-height: 80vh; overflow-y: auto;">
        <span class="close-btn" onclick="this.closest('.modal').remove(); document.querySelector('[data-category=\\'all\\']')?.click(); window.scrollTo({top: 0, behavior: 'smooth'});" style="font-size: 28px; cursor: pointer;">&times;</span>
        <div class="survey-header" style="text-align: center; padding: 20px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; border-radius: 8px 8px 0 0;">
          <i class="fas fa-lightbulb" style="font-size: 32px; margin-bottom: 10px;"></i>
          <h2 style="margin: 10px 0; color: white;">${data.message}</h2>
          <p style="margin: 5px 0; opacity: 0.9;">Khám phá các sản phẩm phù hợp cho thú cưng của bạn</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; padding: 20px;">
          ${recommendationsHTML}
        </div>
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
          <button class="btn-primary" onclick="this.closest('.modal').remove(); document.querySelector('[data-category=\\'all\\']')?.click(); window.scrollTo({top: 0, behavior: 'smooth'});" style="background: var(--primary-color); color: white; padding: 12px 40px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">
            <i class="fas fa-home"></i> Tiếp tục mua sắm
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        document.querySelector('[data-category="all"]')?.click();
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    });
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

// Banner Carousel
class BannerCarousel {
  constructor() {
    this.slides = document.querySelectorAll('.carousel-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.getElementById('prevSlide');
    this.nextBtn = document.getElementById('nextSlide');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    
    if (this.slides.length === 0) return;
    
    this.init();
  }

  init() {
    // Event listeners
    this.prevBtn?.addEventListener('click', () => this.previousSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Auto-play carousel every 5 seconds
    this.startAutoPlay();
    
    // Pause on hover
    document.querySelector('.banner-carousel')?.addEventListener('mouseenter', () => this.stopAutoPlay());
    document.querySelector('.banner-carousel')?.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  showSlide(n) {
    // Remove active class from all slides and indicators
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current slide and indicator
    if (this.slides[n]) {
      this.slides[n].classList.add('active');
    }
    if (this.indicators[n]) {
      this.indicators[n].classList.add('active');
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(this.currentSlide);
    this.resetAutoPlay();
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(this.currentSlide);
    this.resetAutoPlay();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.showSlide(this.currentSlide);
    this.resetAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize components
  const surveyManager = new SurveyManager();
  const carousel = new BannerCarousel();
  
  // Initialize other modules
  // These are loaded via separate script tags and initialized
  // via DOMContentLoaded events, so we just need to ensure they load properly.
});

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
