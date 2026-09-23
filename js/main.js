/**
 * Pirapire TaxTech - Main Application Logic
 * UX Interactions, Sticky Header, Modal Lead Management, and Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Sticky Header Scroll Effect ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- Mobile Navigation Drawer ---
  const navToggleBtn = document.querySelector('.nav-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  function openMobileNav() {
    mobileDrawer?.classList.add('active');
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileDrawer?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggleBtn?.addEventListener('click', openMobileNav);
  mobileCloseBtn?.addEventListener('click', closeMobileNav);
  mobileOverlay?.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // --- Modal (Lead Capture & PoC Request) ---
  const modal = document.querySelector('.modal-overlay');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const leadForm = document.getElementById('lead-poc-form');
  const toastNotification = document.getElementById('toast-notification');

  function openModal(originText = '') {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto-select regime in modal if changed in simulator
    if (window.PirapireSimulator) {
      const state = window.PirapireSimulator.getEstimates();
      const modalRegimeSelect = document.getElementById('modal-regime');
      if (modalRegimeSelect && state.regime) {
        modalRegimeSelect.value = state.regime;
      }
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.textContent);
    });
  });

  modalCloseBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle ESC key for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMobileNav();
    }
  });

  // --- Phone Mask & Real-time Sanitization ---
  const phoneInput = document.getElementById('lead-phone');
  const nameInput = document.getElementById('lead-name');
  const companyInput = document.getElementById('lead-company');
  const emailInput = document.getElementById('lead-email');

  function maskPhone(value) {
    let digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  phoneInput?.addEventListener('input', (e) => {
    e.target.value = maskPhone(e.target.value);
    updateCharCount('phone-count', e.target.value.length);
    clearFieldError(phoneInput, 'lead-phone-hint');
  });

  phoneInput?.addEventListener('keydown', (e) => {
    const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });

  function updateCharCount(counterId, count) {
    const el = document.getElementById(counterId);
    if (el) el.textContent = count;
  }

  function setFieldError(input, hintId, msg = '') {
    if (!input) return;
    input.classList.add('is-invalid');
    const hint = document.getElementById(hintId);
    if (hint) {
      if (msg) hint.textContent = msg;
      hint.classList.add('active');
    }
  }

  function clearFieldError(input, hintId) {
    if (!input) return;
    input.classList.remove('is-invalid');
    const hint = document.getElementById(hintId);
    if (hint) hint.classList.remove('active');
  }

  function isValidEmail(email) {
    if (!email || email.length > 50) return false;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  nameInput?.addEventListener('input', (e) => {
    updateCharCount('name-count', e.target.value.length);
    if (e.target.value.trim().length >= 3) {
      clearFieldError(nameInput, 'lead-name-hint');
    }
  });

  companyInput?.addEventListener('input', (e) => {
    updateCharCount('company-count', e.target.value.length);
    if (e.target.value.trim().length >= 2) {
      clearFieldError(companyInput, 'lead-company-hint');
    }
  });

  emailInput?.addEventListener('input', (e) => {
    updateCharCount('email-count', e.target.value.length);
    if (isValidEmail(e.target.value.trim())) {
      clearFieldError(emailInput, 'lead-email-hint');
    }
  });

  // --- Lead Form Submission Simulation ---
  leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;

    // Validate Name (max 50, min 3)
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal || nameVal.length < 3 || nameVal.length > 50) {
      setFieldError(nameInput, 'lead-name-hint', 'Nome completo obrigatório (3 a 50 caracteres).');
      if (!hasError) nameInput?.focus();
      hasError = true;
    } else {
      clearFieldError(nameInput, 'lead-name-hint');
    }

    // Validate Company (max 50, min 2)
    const companyVal = companyInput ? companyInput.value.trim() : '';
    if (!companyVal || companyVal.length < 2 || companyVal.length > 50) {
      setFieldError(companyInput, 'lead-company-hint', 'Informe a empresa ou escritório (máximo 50 caracteres).');
      if (!hasError) companyInput?.focus();
      hasError = true;
    } else {
      clearFieldError(companyInput, 'lead-company-hint');
    }

    // Validate Email (with @ and domain, max 50)
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!isValidEmail(emailVal)) {
      setFieldError(emailInput, 'lead-email-hint', 'E-mail corporativo inválido. Use o formato nome@empresa.com ou .com.br (máx 50 carac.).');
      if (!hasError) emailInput?.focus();
      hasError = true;
    } else {
      clearFieldError(emailInput, 'lead-email-hint');
    }

    // Validate Phone (10 or 11 digits, formatted (XX) XXXXX-XXXX)
    const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setFieldError(phoneInput, 'lead-phone-hint', 'Insira um telefone válido com DDD (ex: (11) 99999-9999).');
      if (!hasError) phoneInput?.focus();
      hasError = true;
    } else {
      clearFieldError(phoneInput, 'lead-phone-hint');
    }

    if (hasError) return;

    const submitBtn = leadForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando e validando...';
    }

    setTimeout(() => {
      closeModal();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Solicitar Auditoria & Diagnóstico Gratuito';
      }
      leadForm.reset();
      updateCharCount('name-count', 0);
      updateCharCount('company-count', 0);
      updateCharCount('email-count', 0);
      updateCharCount('phone-count', 0);
      showToast('Solicitação recebida! Nossa equipe entrará em contato em menos de 15 minutos.');
    }, 900);
  });

  // --- Toast Notification Helper ---
  function showToast(message) {
    if (!toastNotification) return;
    const toastMessage = toastNotification.querySelector('.toast-message');
    if (toastMessage) toastMessage.textContent = message;

    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 5000);
  }

  // --- Live Audit Feed Simulation (Hero Widget) ---
  const feedList = document.querySelector('.feed-list');
  if (feedList) {
    const sampleItems = [
      { badge: 'badge-nfe', type: 'NF-e Mercadoria', desc: 'Insumo Produtivo #8491 - Crédito PIS/COFINS', value: '+ R$ 4.820,15', status: 'status-approved' },
      { badge: 'badge-nfse', type: 'NFS-e Serviço', desc: 'Tomada de TI #1042 - Retenção CSRF Compensada', value: '+ R$ 1.940,00', status: 'status-approved' },
      { badge: 'badge-ativo', type: 'Ativo Imob.', desc: 'Máquina Industrial CIAP #203 - Apropriação 1/48', value: '+ R$ 3.125,50', status: 'status-approved' },
      { badge: 'badge-nfe', type: 'NF-e Mercadoria', desc: 'CFOP 5102 - Glosa de Crédito Indevido (Blindagem)', value: 'Risco Bloqueado', status: 'status-glosa' }
    ];

    let itemIndex = 0;
    setInterval(() => {
      const itemData = sampleItems[itemIndex % sampleItems.length];
      itemIndex++;

      const newElem = document.createElement('div');
      newElem.className = 'feed-item';
      newElem.style.opacity = '0';
      newElem.style.transform = 'translateY(-10px)';
      newElem.innerHTML = `
        <div class="feed-left">
          <span class="feed-badge ${itemData.badge}">${itemData.type}</span>
          <span class="feed-title">${itemData.desc}</span>
        </div>
        <div class="feed-status ${itemData.status}">${itemData.value}</div>
      `;

      feedList.insertBefore(newElem, feedList.firstChild);

      // Animation
      setTimeout(() => {
        newElem.style.transition = 'all 0.4s ease';
        newElem.style.opacity = '1';
        newElem.style.transform = 'translateY(0)';
      }, 30);

      // Keep only 4 items in feed
      if (feedList.children.length > 4) {
        feedList.removeChild(feedList.lastChild);
      }
    }, 4500);
  }

  // --- Regime Tabs Switcher (Dobra 3: Progressive Disclosure) ---
  const regimeTabButtons = document.querySelectorAll('.regime-tab-button');
  const regimeTabPanes = document.querySelectorAll('.regime-tab-pane');

  regimeTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      regimeTabButtons.forEach(b => b.classList.remove('active'));
      regimeTabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`tab-pane-${targetTab}`);
      if (activePane) activePane.classList.add('active');
    });
  });
});
