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

  // --- Lead Form Submission Simulation ---
  leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();
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
