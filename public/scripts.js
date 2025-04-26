function showResult(data) {
    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
  }
  
  function showProcessing(show) {
    const modal = document.getElementById('processingModal');
    if (show) {
      modal.classList.add('active');
    } else {
      modal.classList.remove('active');
    }
  }
  
  function showToast(title, message, isSuccess = true) {
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    const toastElement = document.getElementById('liveToast');
  
    toastTitle.textContent = title;
    toastBody.textContent = message;
  
    toastTitle.classList.remove('text-success', 'text-danger');
    toastBody.classList.remove('toast-success', 'toast-error');
  
    if (isSuccess) {
      toastTitle.classList.add('text-success');
      toastBody.classList.add('toast-success');
    } else {
      toastTitle.classList.add('text-danger');
      toastBody.classList.add('toast-error');
    }
  
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
  
  async function testAuth() {
    try {
      showProcessing(true);
      const res = await fetch('/auth/test');
      const data = await res.json();
      showResult(data);
      showToast('Authentication', '✅ Authentication successful!', true);
    } catch (err) {
      showResult({ error: err.message });
      showToast('Authentication', '❌ Failed to authenticate.', false);
    } finally {
      showProcessing(false);
    }
  }
  
  async function getWorkflows() {
    try {
      showProcessing(true);
      const res = await fetch('/workflows');
      const data = await res.json();
      showResult(data);
      showToast('Workflows', '✅ Workflows retrieved successfully!', true);
    } catch (err) {
      showResult({ error: err.message });
      showToast('Workflows', '❌ Failed to retrieve workflows.', false);
    } finally {
      showProcessing(false);
    }
  }
  
  async function analyze(type) {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
      alert('Please select a file first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    let url = '';
    if (type === 'invoice') {
      url = '/analyze/invoice';
    } else if (type === 'id') {
      url = '/analyze/id';
    }
  
    try {
      showProcessing(true);
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      showResult(data);
  
      if (data.jobUUID) {
        document.getElementById('uuidInput').value = data.jobUUID;
      }
  
      showToast('Analysis', `✅ ${type === 'invoice' ? 'Invoice' : 'ID'} submitted!`, true);
    } catch (err) {
      showResult({ error: err.message });
      showToast('Analysis', '❌ Error analyzing document.', false);
    } finally {
      showProcessing(false);
    }
  }
  
  async function getResults() {
    const uuid = document.getElementById('uuidInput').value.trim();
    if (!uuid) {
      alert('Please enter a UUID first.');
      return;
    }
  
    try {
      showProcessing(true);
      const res = await fetch(`/results/${uuid}`);
      const data = await res.json();
      showResult(data);
      showToast('Results', '✅ Results retrieved successfully!', true);
    } catch (err) {
      showResult({ error: err.message });
      showToast('Results', '❌ Failed to retrieve results.', false);
    } finally {
      showProcessing(false);
    }
  }
  
  function toggleTheme() {
    const body = document.body;
    const resultCard = document.querySelector('.card-body');
    const navbar = document.querySelector('.navbar');
    const themeIcon = document.getElementById('theme-icon');
    const isDark = body.classList.contains('bg-dark');
  
    if (isDark) {
      body.classList.replace('bg-dark', 'bg-light');
      body.classList.replace('text-white', 'text-dark');
  
      resultCard.classList.remove('bg-dark', 'text-white');
      resultCard.classList.add('bg-white', 'text-dark');
  
      navbar.classList.replace('navbar-dark', 'navbar-light');
      navbar.classList.replace('bg-dark', 'bg-light');
  
      themeIcon.classList.replace('bi-sun', 'bi-moon');
  
      document.querySelectorAll('.btn-outline-light').forEach(btn => {
        btn.classList.replace('btn-outline-light', 'btn-outline-dark');
      });
  
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.replace('bg-light', 'bg-dark');
      body.classList.replace('text-dark', 'text-white');
  
      resultCard.classList.remove('bg-white', 'text-dark');
      resultCard.classList.add('bg-dark', 'text-white');
  
      navbar.classList.replace('navbar-light', 'navbar-dark');
      navbar.classList.replace('bg-light', 'bg-dark');
  
      themeIcon.classList.replace('bi-moon', 'bi-sun');
  
      document.querySelectorAll('.btn-outline-dark').forEach(btn => {
        btn.classList.replace('btn-outline-dark', 'btn-outline-light');
      });
  
      localStorage.setItem('theme', 'dark');
    }
  }
  
  window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    const navbar = document.querySelector('.navbar');
    const resultCard = document.querySelector('.card-body');
    const themeIcon = document.getElementById('theme-icon');
  
    if (savedTheme === 'dark') {
      document.body.classList.replace('bg-light', 'bg-dark');
      document.body.classList.replace('text-dark', 'text-white');
  
      resultCard.classList.remove('bg-white', 'text-dark');
      resultCard.classList.add('bg-dark', 'text-white');
  
      navbar.classList.replace('navbar-light', 'navbar-dark');
      navbar.classList.replace('bg-light', 'bg-dark');
  
      themeIcon.classList.replace('bi-moon', 'bi-sun');
  
      document.querySelectorAll('.btn-outline-dark').forEach(btn => {
        btn.classList.replace('btn-outline-dark', 'btn-outline-light');
      });
    }
  };
  