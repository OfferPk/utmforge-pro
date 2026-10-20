/**
 * UTMForge Pro - Application Controller & State Manager
 * (c) 2026 UTMForge Pro. All rights reserved.
 */

document.addEventListener('DOMContentLoaded', () => {
  let state = {
    baseUrl: 'https://cloudscale.ai/enterprise',
    params: {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'q4-enterprise-ai-launch',
      utm_term: 'cloud-inference-cluster',
      utm_content: 'rsa-headline-v1'
    },
    customParams: {
      ref: 'partner_portal',
      discount: 'ENTERPRISE20'
    },
    qrConfig: {
      fgColor: '#0a0f1d',
      bgColor: '#ffffff',
      badgeText: 'SCAN ME'
    },
    options: {
      forceLowercase: true,
      slugifyParams: true
    }
  };

  const utmEngine = new UTMEngine(state.options);

  // DOM Elements
  const elPresetSelect = document.getElementById('presetSelect');
  const elBaseUrl = document.getElementById('baseUrl');
  const elUtmSource = document.getElementById('utmSource');
  const elUtmMedium = document.getElementById('utmMedium');
  const elUtmCampaign = document.getElementById('utmCampaign');
  const elUtmTerm = document.getElementById('utmTerm');
  const elUtmContent = document.getElementById('utmContent');
  const elCustomParamsContainer = document.getElementById('customParamsContainer');
  const elBtnAddCustom = document.getElementById('btnAddCustom');

  const elOptLowercase = document.getElementById('optLowercase');
  const elOptSlugify = document.getElementById('optSlugify');

  // Preview elements
  const elFinalUrl = document.getElementById('finalUrl');
  const elValidationNotice = document.getElementById('validationNotice');
  const elParamTableBody = document.getElementById('paramTableBody');
  const elQrContainer = document.getElementById('qrContainer');
  const elQrBadgeText = document.getElementById('qrBadgeText');
  const elQrFgColor = document.getElementById('qrFgColor');

  const elBtnCopyUrl = document.getElementById('btnCopyUrl');
  const elBtnDownloadQr = document.getElementById('btnDownloadQr');
  const elBtnExportJson = document.getElementById('btnExportJson');
  const elBtnExportCsv = document.getElementById('btnExportCsv');

  // Channel preset pills
  document.querySelectorAll('.channel-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.channel-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const channelKey = pill.dataset.channel;
      const preset = CHANNEL_PRESETS[channelKey];
      if (preset) {
        state.params = { ...state.params, ...preset.params };
        syncForm();
      }
    });
  });

  function renderCustomParams() {
    elCustomParamsContainer.innerHTML = '';
    const entries = Object.entries(state.customParams);
    entries.forEach(([key, val], idx) => {
      const row = document.createElement('div');
      row.className = 'form-grid-2';
      row.style.marginBottom = '0.5rem';
      row.innerHTML = `
        <input type="text" class="form-input cp-key" data-idx="${idx}" placeholder="Parameter Key (e.g. ref)" value="${escapeAttr(key)}">
        <div style="display:flex; gap:0.4rem;">
          <input type="text" class="form-input cp-val" data-idx="${idx}" placeholder="Value" value="${escapeAttr(val)}">
          <button type="button" class="btn btn-secondary btn-del-cp" data-key="${escapeAttr(key)}" style="padding:0.3rem 0.6rem; color:#ef4444;">&times;</button>
        </div>
      `;
      elCustomParamsContainer.appendChild(row);
    });

    elCustomParamsContainer.querySelectorAll('.btn-del-cp').forEach(btn => {
      btn.addEventListener('click', () => {
        delete state.customParams[btn.dataset.key];
        renderCustomParams();
        updatePreview();
      });
    });

    elCustomParamsContainer.querySelectorAll('.cp-key, .cp-val').forEach(inp => {
      inp.addEventListener('input', () => {
        const newObj = {};
        const rows = elCustomParamsContainer.querySelectorAll('.form-grid-2');
        rows.forEach(r => {
          const k = r.querySelector('.cp-key').value.trim();
          const v = r.querySelector('.cp-val').value.trim();
          if (k) newObj[k] = v;
        });
        state.customParams = newObj;
        updatePreview();
      });
    });
  }

  function syncForm() {
    elBaseUrl.value = state.baseUrl;
    elUtmSource.value = state.params.utm_source || '';
    elUtmMedium.value = state.params.utm_medium || '';
    elUtmCampaign.value = state.params.utm_campaign || '';
    elUtmTerm.value = state.params.utm_term || '';
    elUtmContent.value = state.params.utm_content || '';

    elOptLowercase.checked = state.options.forceLowercase;
    elOptSlugify.checked = state.options.slugifyParams;

    elQrBadgeText.value = state.qrConfig.badgeText;
    elQrFgColor.value = state.qrConfig.fgColor;

    renderCustomParams();
    updatePreview();
  }

  function updatePreview() {
    utmEngine.forceLowercase = state.options.forceLowercase;
    utmEngine.slugifyParams = state.options.slugifyParams;

    const buildRes = utmEngine.buildURL(state.baseUrl, state.params, state.customParams);

    if (!buildRes.success) {
      elFinalUrl.textContent = buildRes.error;
      elValidationNotice.className = 'validation-badge val-error';
      elValidationNotice.innerHTML = `✕ <b>Validation Error:</b> ${escapeHtml(buildRes.error)}`;
      return;
    }

    elFinalUrl.textContent = buildRes.finalUrl;

    // Validation notice
    if (buildRes.issues && buildRes.issues.length > 0) {
      const msgs = buildRes.issues.map(i => i.message).join(' ');
      elValidationNotice.className = 'validation-badge val-warning';
      elValidationNotice.innerHTML = `⚠ <b>Recommendations:</b> ${escapeHtml(msgs)}`;
    } else {
      elValidationNotice.className = 'validation-badge val-valid';
      elValidationNotice.innerHTML = `✓ <b>GA4 Standards Compliant:</b> Ready for production deployment.`;
    }

    // Breakdown Table
    let tableRows = '';
    const allParams = { ...state.params, ...state.customParams };
    for (const [k, v] of Object.entries(allParams)) {
      if (v) {
        tableRows += `
          <tr>
            <td class="param-key">${escapeHtml(k)}</td>
            <td class="param-val">${escapeHtml(utmEngine.cleanParam(v))}</td>
          </tr>
        `;
      }
    }
    elParamTableBody.innerHTML = tableRows;

    // Render Vector QR Code
    const qr = new QRMatrix(buildRes.finalUrl);
    const svgCode = qr.renderSVG({
      fgColor: state.qrConfig.fgColor,
      bgColor: state.qrConfig.bgColor,
      badgeText: state.qrConfig.badgeText
    });
    elQrContainer.innerHTML = svgCode;

    try {
      localStorage.setItem('utmforge_state', JSON.stringify(state));
    } catch (e) {}
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }

  function escapeAttr(text) {
    if (!text) return '';
    return String(text).replace(/"/g, '&quot;');
  }

  // Form input listeners
  elBaseUrl.addEventListener('input', e => { state.baseUrl = e.target.value; updatePreview(); });
  elUtmSource.addEventListener('input', e => { state.params.utm_source = e.target.value; updatePreview(); });
  elUtmMedium.addEventListener('input', e => { state.params.utm_medium = e.target.value; updatePreview(); });
  elUtmCampaign.addEventListener('input', e => { state.params.utm_campaign = e.target.value; updatePreview(); });
  elUtmTerm.addEventListener('input', e => { state.params.utm_term = e.target.value; updatePreview(); });
  elUtmContent.addEventListener('input', e => { state.params.utm_content = e.target.value; updatePreview(); });

  elOptLowercase.addEventListener('change', e => { state.options.forceLowercase = e.target.checked; updatePreview(); });
  elOptSlugify.addEventListener('change', e => { state.options.slugifyParams = e.target.checked; updatePreview(); });

  elQrBadgeText.addEventListener('input', e => { state.qrConfig.badgeText = e.target.value; updatePreview(); });
  elQrFgColor.addEventListener('input', e => { state.qrConfig.fgColor = e.target.value; updatePreview(); });

  elBtnAddCustom.addEventListener('click', () => {
    const key = `custom_${Date.now().toString().slice(-4)}`;
    state.customParams[key] = 'value';
    renderCustomParams();
    updatePreview();
  });

  // Action: Copy Tagged URL
  elBtnCopyUrl.addEventListener('click', () => {
    const url = elFinalUrl.textContent;
    navigator.clipboard.writeText(url).then(() => {
      const orig = elBtnCopyUrl.textContent;
      elBtnCopyUrl.textContent = 'Copied to Clipboard!';
      setTimeout(() => { elBtnCopyUrl.textContent = orig; }, 2000);
    });
  });

  // Action: Download Vector SVG QR
  elBtnDownloadQr.addEventListener('click', () => {
    const buildRes = utmEngine.buildURL(state.baseUrl, state.params, state.customParams);
    const qr = new QRMatrix(buildRes.finalUrl);
    const svgCode = qr.renderSVG({
      fgColor: state.qrConfig.fgColor,
      bgColor: state.qrConfig.bgColor,
      badgeText: state.qrConfig.badgeText
    });
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utm-qr-${state.params.utm_campaign || 'campaign'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Action: Export Campaign JSON
  elBtnExportJson.addEventListener('click', () => {
    const buildRes = utmEngine.buildURL(state.baseUrl, state.params, state.customParams);
    const manifest = {
      campaign: state.params.utm_campaign,
      generatedUrl: buildRes.finalUrl,
      timestamp: new Date().toISOString(),
      parameters: {
        destinationUrl: state.baseUrl,
        ...state.params,
        custom: state.customParams
      }
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-manifest-${state.params.utm_campaign || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Action: Export CSV
  elBtnExportCsv.addEventListener('click', () => {
    const buildRes = utmEngine.buildURL(state.baseUrl, state.params, state.customParams);
    const headers = ['Final URL', 'Destination', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const row = [
      `"${buildRes.finalUrl}"`,
      `"${state.baseUrl}"`,
      `"${state.params.utm_source || ''}"`,
      `"${state.params.utm_medium || ''}"`,
      `"${state.params.utm_campaign || ''}"`,
      `"${state.params.utm_term || ''}"`,
      `"${state.params.utm_content || ''}"`
    ];
    const csvContent = `${headers.join(',')}\n${row.join(',')}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utm-export-${state.params.utm_campaign || 'campaign'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Template loader
  elPresetSelect.addEventListener('change', async (e) => {
    const val = e.target.value;
    if (!val) return;
    try {
      const res = await fetch(`templates/${val}.json`);
      if (res.ok) {
        const tmpl = await res.json();
        if (tmpl.links && tmpl.links.length > 0) {
          const first = tmpl.links[0];
          state.baseUrl = first.baseUrl;
          state.params = first.params;
          state.customParams = first.customParams || {};
          syncForm();
        }
      }
    } catch (err) {
      console.warn('Template load fallback', err);
    }
  });

  // Initialize
  try {
    const cached = localStorage.getItem('utmforge_state');
    if (cached) state = JSON.parse(cached);
  } catch (e) {}

  syncForm();
});
