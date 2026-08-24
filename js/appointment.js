  const form = document.getElementById('apptForm');
  const success = document.getElementById('formSuccess');
  const error = document.getElementById('formError');
  const submitBtn = form.querySelector('button[type="submit"], .submit-row button');

  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  const WEB3FORMS_ACCESS_KEY = '2706ea35-205c-4065-8197-918962642988';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: real visitors never interact with this hidden field. If it's
    // checked, silently drop the submission instead of hitting the API.
    if (form.botcheck && form.botcheck.checked) {
      return;
    }

    error.classList.remove('show');
    success.classList.remove('show');

    const formData = new FormData(form);
    formData.set('access_key', WEB3FORMS_ACCESS_KEY);
    formData.set('subject', 'New Repair Request - Jack Wen Transmission');
    formData.set('from_name', 'Jack Wen Transmission Website');
    if (formData.get('email')) {
      formData.set('replyto', formData.get('email'));
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      const result = await res.json();

      if (res.ok && result.success) {
        form.reset();
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      error.classList.add('show');
      error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
