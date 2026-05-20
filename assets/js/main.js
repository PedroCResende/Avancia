// =========================================
// SCRIPT PRINCIPAL AVANCIA
// =========================================

// =========================================
// 1. ACCORDION (FAQ)
// =========================================

function toggleAccordion(button) {
    const content = button.nextElementSibling;
    const isActive = content.classList.contains('active');

    // Fecha outros accordions
    document.querySelectorAll('.accordion-content.active').forEach(item => {
        if (item !== content) {
            item.classList.remove('active');
            item.previousElementSibling.classList.remove('active');
        }
    });

    // Toggle accordion atual
    if (isActive) {
        content.classList.remove('active');
        button.classList.remove('active');
    } else {
        content.classList.add('active');
        button.classList.add('active');
    }
}

// =========================================
// 2. SMOOTH SCROLL
// =========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(
            this.getAttribute('href')
        );

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =========================================
// 3. GOOGLE REVIEWS
// =========================================

function renderStars(rating) {
    return "★".repeat(Math.round(rating)) +
           "☆".repeat(5 - Math.round(rating));
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}

async function loadGoogleReviews() {

    const container = document.getElementById("google-reviews");
    const summary = document.getElementById("reviews-summary");

    // Evita erro caso a seção não exista
    if (!container || !summary) return;

    try {

        const response = await fetch(
            "/.netlify/functions/google-reviews"
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Erro ao carregar avaliações."
            );
        }

        summary.textContent =
            `${data.userRatingCount}+ avaliações • nota ${data.rating} no Google`;

        if (!data.reviews || data.reviews.length === 0) {

            container.innerHTML = `
                <p class="text-center col-span-full text-gray-500">
                    Nenhuma avaliação disponível no momento.
                </p>
            `;

            return;
        }

        container.innerHTML = data.reviews.map((review) => `

            <div class="review-card card-shadow card-hover">

                <div class="flex items-center gap-4 mb-4">

                    ${
                        review.authorPhoto
                            ? `
                                <img
                                    src="${review.authorPhoto}"
                                    alt="${escapeHtml(review.authorName)}"
                                    class="w-14 h-14 rounded-full object-cover"
                                >
                            `
                            : `
                                <div class="review-avatar">
                                    ${escapeHtml(review.authorName.charAt(0))}
                                </div>
                            `
                    }

                    <div>
                        <h4 class="font-bold text-gray-900">
                            ${escapeHtml(review.authorName)}
                        </h4>

                        <div class="star-rating">
                            ${renderStars(review.rating)}
                        </div>

                        <div class="text-gray-400 text-sm">
                            ${escapeHtml(review.relativeTime)}
                        </div>
                    </div>

                </div>

                <p class="text-gray-700 leading-relaxed">
                    "${escapeHtml(
                        review.text.length > 180
                            ? review.text.slice(0, 180) + "..."
                            : review.text
                    )}"
                </p>

                ${
                    review.authorUri
                        ? `
                            <a
                                href="${review.authorUri}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-block mt-4 text-sm font-medium primary-blue"
                            >
                                Ver perfil no Google
                            </a>
                        `
                        : ""
                }

            </div>

        `).join("");

    } catch (error) {

        summary.textContent =
            "Não foi possível carregar as avaliações agora.";

        container.innerHTML = `
            <p class="text-center col-span-full text-gray-500">
                Erro ao carregar avaliações.
            </p>
        `;

        console.error(error);
    }
}

// =========================================
// 4. MENU MOBILE
// =========================================

function initMobileMenu() {

    const menuButton =
        document.getElementById('mobile-menu-button');

    const mobileMenu =
        document.getElementById('mobile-menu');

    // Evita erro caso a página não tenha menu
    if (!menuButton || !mobileMenu) return;

    const menuIcon = menuButton.querySelector('i');

    menuButton.addEventListener('click', () => {

        const isHidden =
            mobileMenu.classList.toggle('hidden');

        // Troca ícone
        if (menuIcon) {

            if (isHidden) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            } else {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            }
        }
    });

    // Fecha menu ao clicar nos links
    const mobileLinks = mobileMenu.querySelectorAll('a');

    mobileLinks.forEach(link => {

        link.addEventListener('click', () => {

            mobileMenu.classList.add('hidden');

            if (menuIcon) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });
}

// =========================================
// 5. HEADER SHADOW ON SCROLL
// =========================================

function initHeaderScroll() {

    const header = document.querySelector('.main-header');

    if (!header) return;

    window.addEventListener('scroll', () => {

        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// =========================================
// 6. ANIMAÇÃO AO SCROLL
// =========================================

function initRevealAnimation() {

    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });

    }, {
        threshold: 0.1
    });

    reveals.forEach(item => observer.observe(item));
}

// =========================================
// 7. LGPD COOKIE CONSENT & META PIXEL
// =========================================

// INSIRA OS IDENTIFICADORES DO CLIENTE AQUI:
const META_PIXEL_ID = 'INSIRA_META_PIXEL_ID_AQUI';
const GOOGLE_ANALYTICS_ID = 'INSIRA_GOOGLE_ANALYTICS_ID_AQUI';

function loadTrackingScripts() {
    const consent = localStorage.getItem('avancia_cookie_consent');
    if (consent !== 'accepted') return;

    // 1. Injetar Google Analytics (se configurado)
    if (GOOGLE_ANALYTICS_ID && GOOGLE_ANALYTICS_ID !== 'INSIRA_GOOGLE_ANALYTICS_ID_AQUI') {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', GOOGLE_ANALYTICS_ID);
    }

    // 2. Injetar Meta Pixel (se configurado)
    if (META_PIXEL_ID && META_PIXEL_ID !== 'INSIRA_META_PIXEL_ID_AQUI') {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', META_PIXEL_ID);
        fbq('track', 'PageView');
    }
}

function initCookieConsent() {
    const consent = localStorage.getItem('avancia_cookie_consent');

    // Se já foi aceito, carrega os scripts e sai
    if (consent === 'accepted') {
        loadTrackingScripts();
        initCookieSettingsLink();
        return;
    }

    // Se já foi recusado, apenas inicializa o link de configurações e sai
    if (consent === 'declined') {
        initCookieSettingsLink();
        return;
    }

    // Caso contrário, renderiza o banner
    showCookieBanner();
}

function showCookieBanner() {
    if (document.getElementById('cookie-consent-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-consent-banner p-6 md:p-8 flex flex-col gap-4 text-left';
    
    banner.innerHTML = `
        <div>
            <h4 class="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i class="fas fa-cookie-bite text-[#3A61A7]"></i> Valorizamos sua privacidade
            </h4>
            <p class="text-sm text-gray-600 leading-relaxed">
                Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência, otimizar o desempenho do site e personalizar anúncios do Google e Meta de acordo com seus interesses. Ao clicar em "Aceitar Todos", você concorda com o uso de cookies em conformidade com a nossa <a href="politicas-de-privacidade.html" class="text-[#3A61A7] hover:underline font-semibold">Política de Privacidade</a>.
            </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 mt-2">
            <button id="cookie-accept-all" class="cookie-btn-accept px-6 py-3 rounded-lg text-sm font-semibold flex-1">
                Aceitar Todos
            </button>
            <button id="cookie-decline" class="cookie-btn-decline px-6 py-3 rounded-lg text-sm font-semibold flex-1">
                Recusar
            </button>
        </div>
    `;

    document.body.appendChild(banner);

    // Efeito fade-in suave
    setTimeout(() => {
        banner.classList.add('show');
    }, 100);

    // Eventos
    document.getElementById('cookie-accept-all').addEventListener('click', () => {
        localStorage.setItem('avancia_cookie_consent', 'accepted');
        hideCookieBanner(banner);
        loadTrackingScripts();
    });

    document.getElementById('cookie-decline').addEventListener('click', () => {
        localStorage.setItem('avancia_cookie_consent', 'declined');
        hideCookieBanner(banner);
    });

    initCookieSettingsLink();
}

function hideCookieBanner(banner) {
    banner.classList.remove('show');
    setTimeout(() => {
        banner.remove();
    }, 500);
}

function initCookieSettingsLink() {
    // Procura todos os links que gerenciam cookies no footer
    document.querySelectorAll('.manage-cookies-link').forEach(link => {
        // Remove event listener antigo se houver para evitar duplicados
        link.replaceWith(link.cloneNode(true));
    });

    // Re-seleciona e adiciona evento
    document.querySelectorAll('.manage-cookies-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('avancia_cookie_consent');
            showCookieBanner();
        });
    });
}

// =========================================
// 8. RASTREAMENTO DO WHATSAPP (LEADS)
// =========================================

function setupWhatsAppTracking() {
    document.addEventListener('click', (e) => {
        // Encontra se o clique foi em um link do WhatsApp
        const link = e.target.closest('a');
        if (!link) return;

        const url = link.getAttribute('href') || '';
        if (url.includes('wa.me') || url.includes('api.whatsapp.com') || url.includes('whatsapp.com')) {
            const consent = localStorage.getItem('avancia_cookie_consent');
            
            // Só executa o rastreamento se o usuário deu consentimento
            if (consent === 'accepted') {
                // Rastreamento no Meta Pixel (evento de Lead padrão)
                if (typeof fbq === 'function') {
                    fbq('track', 'Lead');
                }
                // Rastreamento no Google Analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', {
                        'event_category': 'conversion',
                        'event_label': 'WhatsApp CTA Click'
                    });
                }
            }
        }
    });
}

// =========================================
// 9. INICIALIZAÇÃO GERAL
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initHeaderScroll();
    initRevealAnimation();
    loadGoogleReviews();
    initCookieConsent();
    setupWhatsAppTracking();
});