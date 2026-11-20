// SplatLink Editor startup (moved out of index.html, which may not hold inline scripts).
navigator.serviceWorker?.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()));
['dragover', 'drop'].forEach((type) => window.addEventListener(type, (e) => {
    if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
}));
