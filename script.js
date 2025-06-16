document.addEventListener('DOMContentLoaded', () => {
    const mathInput = document.getElementById('math-input');
    const themeSelect = document.getElementById('theme');
    const rewriteBtn = document.getElementById('rewrite-btn');
    const loadingContainer = document.getElementById('loading-container');
    const outputContainer = document.querySelector('.output-container');
    const resultsContainer  = document.getElementById('results');
    const actionButtons = document.getElementById('action-buttons');
    const originalText = document.getElementById('original-text');
    const rewrittenText = document.getElementById('rewritten-text');
    const problemTheme = document.getElementById('problem-theme');
    const copyBtn = document.getElementById('copy-btn');
    const customToast = document.getElementById('custom-toast');
    const toastTitle  = document.querySelector('.toast-title');
    const toastMsg = document.querySelector('.toast-message');
    const tryAgainBtn = document.getElementById('try-again-btn');


    // initial state
    rewriteBtn.setAttribute('disabled','disabled');
    outputContainer.style.display = 'none';

    // Check if inputs are provided
    function validateInputs() {
        const hasText = mathInput.value.length > 0;
        const hasTheme = themeSelect.value.length > 0;

        if (hasText && hasTheme) {
            rewriteBtn.removeAttribute('disabled');
        } else {
            rewriteBtn.setAttribute('disabled', 'disabled');
        }
    }

    // call validateInputs function when inputs are provided
    mathInput.addEventListener('input', validateInputs);
    themeSelect.addEventListener('change', validateInputs);

    // mock response rewriteBtn
    function mockRewriteAPI(original, theme) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`🔄 [${theme}] ${original}`)
            }, 2000)
        })
    }

    // helper function to show toast
    function showToast (message, title, isError = false) {
        // set toast content
        toastTitle.textContent = title;
        toastMsg.textContent = message;

        // toggle classes
        customToast.classList.remove('hide', 'error', 'success');
        customToast.classList.add('show', isError ? 'error' : 'success');

        // hide toast after 2.5 seconds
        setTimeout(() => {
            customToast.classList.replace('show','hide');
        }, 2500);
    }
    
    rewriteBtn.addEventListener('click', async () => {
        // get user's input
        const original = mathInput.value.trim('');
        const theme = themeSelect.value;

        // display the output container,and loading container
        outputContainer.style.display= 'block';
        loadingContainer.classList.remove('hidden');

        // hide old results if any
        resultsContainer.classList.add('hidden');
        actionButtons.classList.add('hidden');

        // inject math input in the original problem container, and the related theme
        originalText.textContent = original;
        problemTheme.textContent = theme;

        // call the mockRewriteAPI to display results
        let rewritten;
        try {
            rewritten = await mockRewriteAPI(original, theme);
        } catch (error) {
            console.log('error fetching rewritten problem:', error);
            rewritten = '⚠️ Failed to rewrite problem. Please try again.';
            showToast('Your math problem has been rewritten.' ,'Success!');
        }

        // hide loading container, display results, and action buttons
        loadingContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        actionButtons.classList.remove('hidden');

        // inject rewritten text
        rewrittenText.textContent = rewritten;

        // show toast success message
        if (rewritten.startsWith('⚠️')) {
            showToast('Error rewriting problem, please try again.', 'Failed!', true);
        } else {
            showToast('Your math problem has been rewritten.' ,'Success!');
        }
    })

    copyBtn.addEventListener('click', async () => {
        // get rewritten text
        const textToCopy = rewrittenText.textContent.trim('');
        if(!textToCopy) return;

        try {
            // copy text to clipboard
            await navigator.clipboard.writeText(textToCopy);
            showToast('The rewritten problem has been copied to your clipboard.', 'Copied!');
        } catch (error) {
            console.log('copy failed:', error);
            showToast('Failed to copy. Please try again.', 'Error!');
        }
    });

    tryAgainBtn.addEventListener('click', () => {
        // hide results content
        outputContainer.style.display = 'none';
        loadingContainer.classList.add('hidden');      
        actionButtons.classList.add('hidden');         
    })
});