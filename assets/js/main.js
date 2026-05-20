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
// 7. INICIALIZAÇÃO GERAL
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    initMobileMenu();

    initHeaderScroll();

    initRevealAnimation();

    loadGoogleReviews();
});