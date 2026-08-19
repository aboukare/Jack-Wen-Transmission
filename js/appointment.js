  const form = document.getElementById('apptForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const lines = [
      `Name: ${data.fname}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Vehicle: ${data.year} ${data.make} ${data.model}`,
      `Service Needed: ${data.service || 'Not specified'}`,
      `Preferred Date: ${data.date || 'Not specified'}`,
      `Preferred Time: ${data.time || 'Not specified'}`,
      '',
      'Details:',
      data.message || '(none provided)'
    ];

    const subject = encodeURIComponent(`Appointment Request - ${data.fname}`);
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:info@jackwentransmission.com?subject=${subject}&body=${body}`;

    success.classList.add('show');
    success.scrollIntoView({behavior:'smooth', block:'nearest'});
  });
