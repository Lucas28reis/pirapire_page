/**
 * Pirapire TaxTech - Interactive Tax Recovery & Risk Simulator
 * Simula estimativas reais e conservadoras com base na legislação tributária brasileira
 */

(function () {
  'use strict';

  // State
  let currentRevenue = 2500000; // R$ 2.5M faturamento mensal padrão
  let currentRegime = 'real';    // 'real' ou 'presumido'

  // DOM Elements
  const slider = document.getElementById('revenue-slider');
  const revenueDisplay = document.getElementById('calc-revenue-val');
  const totalRecoverableDisplay = document.getElementById('calc-total-recoverable');
  const pisCofinsDisplay = document.getElementById('calc-pis-cofins');
  const icmsRetencoesDisplay = document.getElementById('calc-icms-retencoes');
  const glosaPreventivaDisplay = document.getElementById('calc-glosa-preventiva');
  const regimeButtons = document.querySelectorAll('.regime-btn');
  const regimeNote = document.getElementById('calc-regime-note');

  // Currency Formatter BRL
  const formatBRL = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Calculation Logic
  function calculateEstimates() {
    const monthlyRev = currentRevenue;
    const sixtyMonthsRev = monthlyRev * 60; // Janela retroativa de 5 anos

    let pisCofins = 0;
    let icmsRetencoes = 0;
    let glosasEvitadas = 0;

    if (currentRegime === 'real') {
      // Lucro Real: Não-cumulatividade (9,25% PIS/COFINS).
      // Média conservadora de créditos não aproveitados em insumos, fretes, ativo e energia: ~1.45% da receita acumulada.
      pisCofins = sixtyMonthsRev * 0.0145;
      // ICMS (diferencial de alíquota, base de cálculo, ST) e Retenções: ~0.85%
      icmsRetencoes = sixtyMonthsRev * 0.0085;
      // Risco de multas e autuações evitadas pela blindagem ativa (glosa preventiva): ~0.95%
      glosasEvitadas = sixtyMonthsRev * 0.0095;

      if (regimeNote) {
        regimeNote.textContent = 'Apuração integral imediata de PIS/COFINS e ICMS nos últimos 60 meses.';
      }
    } else {
      // Lucro Presumido: PIS/COFINS cumulativo até 2027 (sem créditos diretos de insumos),
      // mas recuperação expressiva de Retenções na Fonte não compensadas (CSRF 4,65% e IRRF),
      // e ICMS (exclusão de base e segregação correta de monofásicos/ST): ~0.75%
      pisCofins = sixtyMonthsRev * 0.0015; // Correção de monofásicos e retenções vinculadas
      icmsRetencoes = sixtyMonthsRev * 0.0090; // ICMS-ST, retenções federais e municipais
      glosasEvitadas = sixtyMonthsRev * 0.0080;

      if (regimeNote) {
        regimeNote.textContent = 'Foco em Retenções na Fonte e ICMS-ST agora. Preparação integral para créditos pós-2027.';
      }
    }

    const totalRecoverable = pisCofins + icmsRetencoes;

    // Update UI
    if (revenueDisplay) {
      revenueDisplay.textContent = formatBRL(monthlyRev) + '/mês';
    }

    if (totalRecoverableDisplay) {
      totalRecoverableDisplay.textContent = formatBRL(totalRecoverable);
    }

    if (pisCofinsDisplay) {
      pisCofinsDisplay.textContent = formatBRL(pisCofins);
    }

    if (icmsRetencoesDisplay) {
      icmsRetencoesDisplay.textContent = formatBRL(icmsRetencoes);
    }

    if (glosaPreventivaDisplay) {
      glosaPreventivaDisplay.textContent = formatBRL(glosasEvitadas);
    }
  }

  // Quick Revenue Preset Buttons
  const quickRevButtons = document.querySelectorAll('.quick-rev-btn');
  if (quickRevButtons.length > 0) {
    quickRevButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        quickRevButtons.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        const val = Number(this.getAttribute('data-val'));
        if (val) {
          currentRevenue = val;
          if (slider) slider.value = val;
          calculateEstimates();
        }
      });
    });
  }

  // Event Listeners
  if (slider) {
    slider.addEventListener('input', function (e) {
      currentRevenue = Number(e.target.value);
      // Remove active from preset buttons if slider manually adjusted
      quickRevButtons.forEach((b) => {
        if (Number(b.getAttribute('data-val')) === currentRevenue) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      calculateEstimates();
    });
  }

  if (regimeButtons.length > 0) {
    regimeButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        regimeButtons.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        currentRegime = this.getAttribute('data-regime') || 'real';
        calculateEstimates();
      });
    });
  }

  // Initialize on load
  document.addEventListener('DOMContentLoaded', calculateEstimates);
  // Also run immediately if script loads after DOM
  calculateEstimates();

  // Expose function for lead form integration if needed
  window.PirapireSimulator = {
    getEstimates: function () {
      return {
        revenue: currentRevenue,
        regime: currentRegime,
        total: totalRecoverableDisplay ? totalRecoverableDisplay.textContent : 'R$ 0'
      };
    }
  };
})();
