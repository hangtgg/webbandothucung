// Main application initialization
document.addEventListener('DOMContentLoaded', async () => {
  console.log('PetShop application starting...');
  
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
